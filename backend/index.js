const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { spawnSync } = require('child_process');
const OpenAI = require('openai');
const { renderScene } = require('./render');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json({ limit: '2mb' }));
// Serve videos so the fron-tend can hit /renders/<file>.mp4 directly
app.use('/renders', express.static(path.join(__dirname, 'renders')));

// Ensure tmp dir exists
const TMP_DIR = path.join(__dirname, 'tmp_scenes');
if (!fs.existsSync(TMP_DIR)) fs.mkdirSync(TMP_DIR);

// === TTS output directory ===
const TTS_DIR = path.join(__dirname, 'tts');
if (!fs.existsSync(TTS_DIR)) fs.mkdirSync(TTS_DIR);
app.use('/tts', express.static(TTS_DIR));

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Helper to send Server-Sent Events
function sseSend(res, { event, data }) {
  if (event) res.write(`event: ${event}\n`);
  if (data !== undefined) res.write(`data: ${data}\n`);
  res.write('\n');
}

// Explanation system prompt (simple version)
const EXPLAIN_SYS_PROMPT = `You are a concise math tutor. Explain the user question in ≤ 300 words using simple language and USE ONLY PLAIN TEXT NO LATEX OR MARKDOWN`;

// Code generation system prompt – template supplied by user
const CODE_SYS_PROMPT = (
  userPrompt,
  explanation,
  context = ''
) => `You are the world's best manim-ce code generator working against manim-community v0.19.

TASK:
• Write **only** valid Python code (no Markdown fences, no comments outside \`\`\`python).
• Create animation to help user visualize and learn about abstract conceptes with practical and well desgined example and graph visualization 
• User initial question: ${userPrompt}. Illustrate the concept: ${explanation}. Optional extra context: ${context}

ALLOWED API CHEAT-SHEET (v0.19):
• Core mobjects: Scene, Axes, NumberPlane, Dot, Line, VGroup, Text, MathTex, ParametricFunction
• Calculus helpers: manim.mobject.graphing.functions.Derivative
• axes.plot(lambda x: f(x), x_range=[a, b])
• To draw a tangent at x₀: use Derivative(f)(x₀) to compute slope, then create a Line manually or via ParametricFunction.
• DO NOT use get_tangent_line or get_secant_slope_group (deprecated in v0.19).
• Basic animations: Create, FadeIn, FadeOut, Transform, Write, Wait
• Do NOT use "fill_color".

Avoid any helper not listed above. Focus on simple, deterministic constructions.

HARD RULES:
1. Imports **exactly**:
from manim import *
import math
import numpy as np
2. Define one class called PromptScene(Scene) with a construct(self) method.
3. Total length ≤ 300 physical lines.
4. Prefer Axes / NumberPlane and Step-by-Step Transformations where appropriate.
5. Do not use any library other than math and numpy.
6. End of file is end of code - no trailing blank lines, no explanatory text.

FAIL if any character outside legal Python appears.`;

function stripMarkdownFences(text) {
  const start = text.indexOf('```python');
  if (start === -1) return text.trim();
  const end = text.indexOf('```', start + 9);
  if (end === -1) return text.substring(start + 9).trim();
  return text.substring(start + 9, end).trim();
}

function validateScript(code) {
  if (code.split('\n').length > 100) {
    throw new Error('Script exceeds 100 lines');
  }
  if (Buffer.byteLength(code, 'utf8') > 8 * 1024) {
    throw new Error('Script too large');
  }
  const blacklist = /(import\s+(os|subprocess|socket|requests|sys|shlex|signal))/g;
  if (blacklist.test(code)) {
    throw new Error('Disallowed import detected');
  }
  const apiMisuse = /(get_tangent_line\(|get_secant_slope_group\(|get_riemann_rectangles\([^)]*fill_color=)/;
  if (apiMisuse.test(code)) {
    throw new Error('Detected unsupported deprecated API usage');
  }
  const badKw = /(get_riemann_rectangles\([^)]*fill_color=)/;
  if (badKw.test(code)) {
    throw new Error('Unsupported kwarg "fill_color" in get_riemann_rectangles');
  }
}

// ---------------- Text-to-Speech helper (OpenAI) ----------------
async function textToSpeechOpenAI(text, voice = process.env.TTS_VOICE || 'nova') {
  const mp3 = await openai.audio.speech.create({
    model: 'tts-1',
    voice,
    input: text,
    format: 'mp3',
  });
  return Buffer.from(await mp3.arrayBuffer());
}

app.post('/api/teach', async (req, res) => {
  const { prompt: userPrompt, mbti = 'INTJ', context = '' } = req.body || {};
  if (!userPrompt) return res.status(400).json({ error: 'Missing prompt' });

  // Set up SSE
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  let explanationFull = '';

  try {
    // ============ FIRST CALL – Explanation (streamed) ============
    const explainStream = await openai.chat.completions.create({
      model: 'gpt-4o',
      stream: true,
      messages: [
        { role: 'system', content: EXPLAIN_SYS_PROMPT },
        { role: 'user', content: userPrompt },
      ],
    });

    for await (const chunk of explainStream) {
      const delta = chunk.choices[0]?.delta?.content;
      if (delta) {
        explanationFull += delta;
        sseSend(res, { data: delta }); // default event="message"
      }
    }

    // ============ SECOND CALL – Code Generation + Compile + Render with retries ============
    const maxAttempts = 3;
    let relVideoPath = '';
    let compileErrorMsg = '';
    let runtimeErrorMsg = '';

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      const messages = [
        { role: 'system', content: CODE_SYS_PROMPT(userPrompt, explanationFull, context) },
      ];

      if (compileErrorMsg) {
        messages.push({
          role: 'system',
          content: `Your previous code had Python manim SYNTAX errors. Fix them and output the entire corrected file. Error: ${compileErrorMsg}`,
        });
      }

      if (runtimeErrorMsg) {
        messages.push({
          role: 'system',
          content: `Your previous code raised a runtime error when executed in manim v0.19. Avoid using the error causing functionailty completely and output with the code that is known to work:
${runtimeErrorMsg}`,
        });
      }

      const codeResp = await openai.chat.completions.create({
        model: 'gpt-4o',
        stream: false,
        temperature: 0.2,
        top_p: 0.8,
        messages,
        max_tokens: 800,
      });

      const rawAnswer = codeResp.choices[0].message.content || '';
      const script = stripMarkdownFences(rawAnswer);

      try {
        validateScript(script);
      } catch (valErr) {
        compileErrorMsg = valErr.message;
        runtimeErrorMsg = '';
        if (attempt === maxAttempts) throw valErr;
        continue;
      }

      const fileId = uuidv4();
      console.log(`[manim-code] Generated scene UUID: ${fileId}`);
      const tmpPath = path.join(TMP_DIR, `${fileId}.py`);
      fs.writeFileSync(tmpPath, script, 'utf8');

      const pyCheck = spawnSync('python', ['-m', 'py_compile', tmpPath]);
      if (pyCheck.status !== 0) {
        compileErrorMsg = pyCheck.stderr ? pyCheck.stderr.toString() : 'Unknown syntax error';
        runtimeErrorMsg = '';
        if (attempt === maxAttempts) throw new Error('Python syntax error in generated script');
        continue;
      }

      try {
        relVideoPath = await renderScene(tmpPath, 'PromptScene');
        // success
        break;
      } catch (renderErr) {
        runtimeErrorMsg = renderErr.message.slice(0, 800);
        compileErrorMsg = '';
        if (attempt === maxAttempts) throw renderErr;
        continue;
      }
    }

    // Construct absolute URL so that frontend (running on another port) can fetch the video correctly
    const videoURL = relVideoPath.startsWith('http')
      ? relVideoPath
      : `${req.protocol}://${req.get('host')}${relVideoPath}`;

    // Send video event
    sseSend(res, { event: 'video', data: videoURL });

    // All done
    sseSend(res, { event: 'done', data: '[DONE]' });
    res.end();
  } catch (err) {
    console.error(err);
    sseSend(res, { event: 'error', data: err.message });
    res.end();
  }
});

app.post('/api/voice', async (req, res) => {
  const { transcript, mbti = 'INTJ', contextId = '' } = req.body || {};
  if (!transcript) return res.status(400).json({ error: 'Missing transcript' });

  // Build system prompt exactly as per spec
  const VOICE_SYS_PROMPT = `You are tutorAI.  Given the learner's voice transcript and current lesson context, do two things:\n\n1. Compose a friendly ≤150-word reply (tone adjusted to MBTI tag).\n2. Decide which VIDEO-CONTROL actions to run next.\n   Allowed types: [\"play_animation\",\"pause_animation\",\"rewind_animation\",\n                   \"slow_down\",\"speed_up\",\"highlight_step\"].\n   Each action is a JSON object; \"slow_down\" / \"speed_up\" may include\n   {\"factor\": number}. \"highlight_step\" must include {\"index\": int}.\n\nReturn **only valid JSON** exactly in this schema:\n{\n  \"reply\": \"<string>\",\n  \"actions\": [ { \"type\": \"...\", ... }, ... ]\n}\nNo extra keys, no markdown, no comments.`;

  try {
    // 1) Ask GPT-4o
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      temperature: 0.3,
      messages: [
        { role: 'system', content: VOICE_SYS_PROMPT },
        { role: 'user', content: transcript },
      ],
      max_tokens: 500,
    });

    const gptContent = completion.choices[0]?.message?.content || '{}';
    let parsed;
    try {
      parsed = JSON.parse(gptContent);
    } catch (jsonErr) {
      console.error('Failed to parse GPT JSON', gptContent);
      return res.status(500).json({ error: 'Invalid JSON from GPT' });
    }

    const replyText = parsed.reply || '';
    const actions = Array.isArray(parsed.actions) ? parsed.actions : [];

    // 2) OpenAI TTS
    const buffer = await textToSpeechOpenAI(replyText);
    const fileName = `${uuidv4()}.mp3`;
    fs.writeFileSync(path.join(TTS_DIR, fileName), buffer);
    const audioUrl = `${req.protocol}://${req.get('host')}/tts/${fileName}`;

    res.json({ text: replyText, audioUrl, actions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Voice processing failed' });
  }
});

/**
 * Generate a quick multiple-choice quiz (5 questions) for self-testing.
 * Expects JSON: { "prompt": "original user prompt", "explanation": "the text shown to learner" }
 * Returns: { questions: [ { question, options: ["A","B",..], answerIndex } ] }
 */
app.post('/api/quiz', async (req, res) => {
  const { prompt = '', explanation = '', mbti = 'INTJ' } = req.body || {};
  if (!explanation) return res.status(400).json({ error: 'Missing explanation' });

  const QUIZ_SYS = `You are tutorAI creating a quick self-assessment quiz. Given the lesson explanation, output 5 concise multiple-choice questions (4 options each) that test understanding. Mark the correct option by its index (0-3). Return ONLY strict JSON in this schema:\n{\n  \"questions\": [\n    { \"question\": <string>, \"options\": [<string>,<string>,<string>,<string>], \"answerIndex\": <0-3> }\n  ]\n}`;

  try {
    const resp = await openai.chat.completions.create({
      model: 'gpt-4o',
      temperature: 0.7,
      messages: [
        { role: 'system', content: QUIZ_SYS },
        { role: 'user', content: `User prompt: ${prompt}\nExplanation:\n${explanation}` },
      ],
      max_tokens: 800,
    });

    let quiz;
    try { quiz = JSON.parse(resp.choices[0].message.content || '{}'); }
    catch { return res.status(500).json({ error: 'Failed to parse quiz JSON' }); }

    if (!Array.isArray(quiz.questions)) {
      return res.status(500).json({ error: 'Invalid quiz format' }); }

    res.json(quiz);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Quiz generation failed' });
  }
});

app.listen(PORT, () => console.log(`Backend listening on http://localhost:${PORT}`));