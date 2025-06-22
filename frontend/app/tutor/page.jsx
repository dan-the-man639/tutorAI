'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import styles from './tutor.module.css';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import { Button } from '@/components/ui/button';

const normalizeLatex = (text) =>
  text
    .replace(/\\\(/g, '$')
    .replace(/\\\)/g, '$')
    .replace(/\\\[/g, '$$')
    .replace(/\\\]/g, '$$');

const cleanupMarkdown = (text) => {
  return text
    .replace(/\*\*\s+/g, '**') // remove space after opening **
    .replace(/\s+\*\*/g, '**') // remove space before closing **
    .replace(/#+\s+/g, (m) => m.replace(/\s+/g, ' ')) // collapse multiple spaces after #
    .replace(/\n{3,}/g, '\n\n'); // max double newline
};

export default function Home() {
  const router = useRouter();
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [explanation, setExplanation] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [videoGenerating, setVideoGenerating] = useState(false);
  const [currentQuery, setCurrentQuery] = useState('');
  const [basePrompt, setBasePrompt] = useState('');
  const [countdown, setCountdown] = useState(30);
  const [showSpec, setShowSpec] = useState(false);
  const [specText, setSpecText] = useState('');
  const [quiz, setQuiz] = useState(null);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizResult, setQuizResult] = useState(null);

  // Voice interaction state & refs
  const [listening, setListening] = useState(false);
  const [voiceReply, setVoiceReply] = useState('');
  const videoRef = useRef(null);
  const recognitionRef = useRef(null);

  // On mount, ensure MBTI is set; otherwise redirect to quiz.
  useEffect(() => {
    const mbti = typeof window !== 'undefined' ? localStorage.getItem('mbtiType') : null;
    if (!mbti) {
      router.push('/quiz');
    }
  }, [router]);

  // Countdown timer
  useEffect(() => {
    if (!videoGenerating) return;
    setCountdown(30);
    const id = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(id);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [videoGenerating]);

  // Initialise Web Speech API recogniser (once)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    const rec = new SpeechRecognition();
    rec.lang = 'en-US';
    rec.continuous = true;
    rec.interimResults = true;
    recognitionRef.current = rec;
  }, []);

  // Simple video player wrapper + action dispatch table
  const player = {
    play: () => videoRef.current?.play(),
    pause: () => videoRef.current?.pause(),
    seek: (t) => {
      if (videoRef.current) videoRef.current.currentTime = t;
    },
    setRate: (r) => {
      if (videoRef.current) videoRef.current.playbackRate = r;
    },
    highlightStep: (idx) => {
      const stepTimes = [0, 2, 4, 6, 8, 10]; // placeholder timestamps
      if (videoRef.current) videoRef.current.currentTime = stepTimes[idx] || 0;
    },
  };

  const actionTable = {
    play_animation: () => player.play(),
    pause_animation: () => player.pause(),
    rewind_animation: () => player.seek(0),
    slow_down: (p = {}) => player.setRate(p.factor ?? 0.5),
    speed_up: (p = {}) => player.setRate(p.factor ?? 1.5),
    highlight_step: (p = {}) => player.highlightStep(p.index),
  };

  const sendTranscript = async (transcript) => {
    try {
      const mbti = localStorage.getItem('mbtiType') || 'INTJ';
      const res = await fetch('http://localhost:4000/api/voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript, mbti, contextId: 'lesson-001' }),
      });
      const data = await res.json();
      setVoiceReply(data.text || '');

      // Play TTS audio
      if (data.audioUrl) {
        const audio = new Audio(data.audioUrl);
        audio.play();
      }

      // Dispatch video-control actions
      if (Array.isArray(data.actions)) {
        data.actions.forEach((a) => {
          const fn = actionTable[a.type];
          if (fn) fn(a);
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const toggleListening = () => {
    const rec = recognitionRef.current;
    if (!rec) {
      const manual = prompt('Speech recognition unavailable. Type your question:');
      if (manual) sendTranscript(manual);
      return;
    }

    if (!listening) {
      // Start conversation mode
      setListening(true);
      rec.start();
    } else {
      // Stop conversation mode
      setListening(false);
      rec.stop();
    }

    // Handle events once (safe to reassign each call)
    rec.onresult = (event) => {
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          const tr = result[0].transcript.trim();
          console.log('📢 Speech transcript:', tr);
          sendTranscript(tr);
        }
      }
    };

    rec.onerror = (e) => {
      // "no-speech" and "aborted" happen after silence; we'll simply wait for onend
      if (['no-speech', 'aborted', 'network'].includes(e.error)) return;
      console.error('SpeechRecognition error', e.error);
      // For unexpected errors try a manual restart
      if (listening) {
        try { rec.stop(); } catch (_) {}
      }
    };

    rec.onend = () => {
      if (listening) {
        // Restart with a slightly longer back-off to avoid rapid fire
        setTimeout(() => {
          try {
            rec.start();
          } catch (err) {
            // still shutting down; retry after 1s
            setTimeout(() => listening && rec.start(), 1000);
          }
        }, 600);
      }
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const mbti = localStorage.getItem('mbtiType') || 'INTJ';
    if (!prompt.trim()) return;
    setLoading(true);
    setExplanation('');
    setVideoUrl('');
    setVideoGenerating(true);
    const cleanPrompt = prompt.trim();
    setCurrentQuery(cleanPrompt);
    setBasePrompt(cleanPrompt);
    try {
      const res = await fetch('http://localhost:4000/api/teach', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'text/event-stream',
        },
        body: JSON.stringify({ prompt: cleanPrompt, mbti, context: '', language: 'en' }),
      });

      // If backend streams with SSE, parse incrementally
      const contentType = res.headers.get('content-type') || '';
      if (contentType.startsWith('text/event-stream')) {
        const reader = res.body.getReader();
        const decoder = new TextDecoder('utf-8');
        let buffer = '';
        let currentEvent = 'message';

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });

          const parts = buffer.split('\n\n');
          for (let i = 0; i < parts.length - 1; i++) {
            const lines = parts[i].split('\n');
            for (const ln of lines) {
              if (ln.startsWith('event:')) {
                currentEvent = ln.slice(6).trim();
              } else if (ln.startsWith('data:')) {
                const payload = ln.slice(5);
                if (currentEvent === 'video') {
                  setVideoUrl(payload.trim());
                  setVideoGenerating(false);
                  currentEvent = 'message';
                  continue;
                }
                if (payload === '[DONE]') continue;

                let data = payload;
                setExplanation((prev) => {
                  if (data.startsWith(' ')) {
                    const prevEnds = !prev || /[\s\n]$/.test(prev);
                    if (prevEnds) data = data.replace(/^ +/, '');
                  }
                  return prev + data;
                });
              }
            }
          }
          buffer = parts[parts.length - 1];
        }
        setLoading(false);
        return;
      }

      // Fallback: plain JSON response
      const data = await res.json();
      setExplanation(data.text);
      setResponse(data);
      if (data.videoUrl) {
        setVideoUrl(data.videoUrl);
        setVideoGenerating(false);
      }
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const regenerateVideo = async (spec = '') => {
    const newPrompt = spec ? `${basePrompt}\nAdditional animation specification: ${spec}` : basePrompt;
    setLoading(true);
    setVideoGenerating(true);
    setVideoUrl('');
    setCountdown(30);
    setShowSpec(false);
    setSpecText('');
    try {
      const mbti = localStorage.getItem('mbtiType') || 'INTJ';
      const res = await fetch('http://localhost:4000/api/teach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'text/event-stream' },
        body: JSON.stringify({ prompt: newPrompt, mbti, context: '', language: 'en' }),
      });

      const reader = res.body?.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';
      let currentEvent = 'message';
      while (reader) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const parts = buffer.split('\n\n');
        for (let i = 0; i < parts.length - 1; i++) {
          const lines = parts[i].split('\n');
          for (const ln of lines) {
            if (ln.startsWith('event:')) currentEvent = ln.slice(6).trim();
            else if (ln.startsWith('data:')) {
              const payload = ln.slice(5);
              if (currentEvent === 'video') {
                setVideoUrl(payload.trim());
                setVideoGenerating(false);
                currentEvent = 'message';
                continue;
              }
            }
          }
        }
        buffer = parts[parts.length - 1];
      }
      setVideoGenerating(false);
      setLoading(false);
    } catch (e) {
      console.error(e);
      setVideoGenerating(false);
      setLoading(false);
    }
  };

  const fetchQuiz = async () => {
    if (!explanation) return;
    setQuiz(null);
    setQuizResult(null);
    try {
      const res = await fetch('http://localhost:4000/api/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: basePrompt, explanation }),
      });
      const data = await res.json();
      if (Array.isArray(data.questions)) {
        setQuiz(data.questions);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const submitQuiz = () => {
    if (!quiz) return;
    const correct = quiz.filter((q, idx) => quizAnswers[idx] === q.answerIndex).length;
    setQuizResult(`${correct} / ${quiz.length} correct`);
  };

  return (
    <main className={"max-w-4xl mx-auto p-6"}>
      <h1 className={"text-3xl md:text-4xl font-bold mb-6 text-center"}>tutorAI</h1>
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-3 mb-8">
        <input
          className="flex-1 border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Ask me any math or STEM question…"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={loading}>
          {loading ? 'Loading…' : 'Teach me'}
        </Button>
        <Button type="button" variant="secondary" onClick={toggleListening}>
          {listening ? '⏹ Stop' : '🎤 Speak'}
        </Button>
      </form>

      {explanation && (
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-center">Explanation</h2>
          <ReactMarkdown
            remarkPlugins={[remarkMath, remarkGfm, remarkBreaks]}
            rehypePlugins={[rehypeKatex]}
            className={`${styles.explanation} prose max-w-none mx-auto`}
          >
            {cleanupMarkdown(normalizeLatex(explanation))}
          </ReactMarkdown>

          {/* Placeholder for video & audio */}
          {videoGenerating && (
            <div className={styles.videoPlaceholder}>
              <div className={styles.loader}></div>
              <span style={{ marginTop: '0.5rem' }}>Generating animation… {countdown}s</span>
            </div>
          )}
          {!videoGenerating && videoUrl && (
            <div className={styles.videoBlock}>
              <h3 className={styles.videoTitle}>Visualization: {currentQuery}</h3>
              <video ref={videoRef} src={videoUrl} controls className={styles.video} loop />
              {!showSpec && (
                <button className={styles.regenBtn} onClick={() => setShowSpec(true)}>
                  🔄 Regenerate animation
                </button>
              )}

              {showSpec && (
                <div className={styles.specBox}>
                  <input
                    type="text"
                    placeholder="Add extra instruction (optional)"
                    value={specText}
                    onChange={(e) => setSpecText(e.target.value)}
                    className={styles.specInput}
                  />
                  <div className={styles.specActions}>
                    <button
                      className={styles.specCancel}
                      onClick={() => {
                        setShowSpec(false);
                        setSpecText('');
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      className={styles.specSubmit}
                      onClick={() => regenerateVideo(specText.trim())}
                      disabled={loading}
                    >
                      Generate
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Quiz section */}
          {!quiz && (
            <button className={styles.regenBtn} style={{ marginTop: '1rem' }} onClick={fetchQuiz}>
              📝 Quiz me
            </button>
          )}

          {quiz && (
            <div className={styles.quizSection}>
              <h3>Quick Quiz</h3>
              {quiz.map((q, qi) => (
                <div key={qi} style={{ marginBottom: '1rem' }}>
                  <p style={{ fontWeight: 600 }}>{qi + 1}. {q.question}</p>
                  {q.options.map((opt, oi) => (
                    <label key={oi} style={{ display: 'block', cursor: 'pointer' }}>
                      <input
                        type="radio"
                        name={`q${qi}`}
                        checked={quizAnswers[qi] === oi}
                        onChange={() => setQuizAnswers(prev => ({ ...prev, [qi]: oi }))}
                      />{' '}
                      {opt}
                    </label>
                  ))}
                </div>
              ))}
              {!quizResult && (
                <button className={styles.specSubmit} onClick={submitQuiz}>Submit Quiz</button>
              )}
              {quizResult && <p style={{ fontStyle: 'italic' }}>{quizResult}</p>}
            </div>
          )}
          {/* TODO: add audio & avatar components */}
        </section>
      )}

      {/* Voice reply bubble */}
      {voiceReply && (
        <p className={styles.voiceReply}>{voiceReply}</p>
      )}
    </main>
  );
}

