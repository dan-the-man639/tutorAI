import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeRaw from 'rehype-raw';
import rehypeKatex from 'rehype-katex';
import remarkBreaks from 'remark-breaks';

// Utility to normalise common OpenAI delimiters
const preprocess = (text) => {
  return text
    .replace(/\\\[/g, '$$')
    .replace(/\\\]/g, '$$')
    .replace(/\\\(/g, '$')
    .replace(/\\\)/g, '$');
};

export default function MarkdownLaTeXRenderer({ content }) {
  const processedText = preprocess(content);

  const remarkMathOptions = {
    singleDollarTextMath: false,
  };

  return (
    <ReactMarkdown
      className="markdown-content"
      remarkPlugins={[[remarkMath, remarkMathOptions], remarkGfm, remarkBreaks]}
      rehypePlugins={[rehypeRaw, rehypeKatex]}
    >
      {processedText}
    </ReactMarkdown>
  );
} 