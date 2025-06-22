'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../quiz.module.css';

// Simple 4-question MBTI-style quiz
const QUESTIONS = [
  {
    id: 'EI',
    axis: ['E', 'I'],
    question: 'In a new social setting, you usually…',
    options: [
      { label: 'Start conversations enthusiastically', value: 'E' },
      { label: 'Observe quietly before engaging', value: 'I' },
    ],
  },
  {
    id: 'SN',
    axis: ['S', 'N'],
    question: 'When learning something new, you prefer…',
    options: [
      { label: 'Concrete facts & practical examples', value: 'S' },
      { label: 'Concepts & big-picture ideas', value: 'N' },
    ],
  },
  {
    id: 'TF',
    axis: ['T', 'F'],
    question: 'Your decisions are usually based on…',
    options: [
      { label: 'Logical analysis', value: 'T' },
      { label: 'Personal values & feelings', value: 'F' },
    ],
  },
  {
    id: 'JP',
    axis: ['J', 'P'],
    question: 'You like your schedule to be…',
    options: [
      { label: 'Structured & decided', value: 'J' },
      { label: 'Flexible & open-ended', value: 'P' },
    ],
  },
];

export default function PersonalityQuiz() {
  const [answers, setAnswers] = useState({});
  const router = useRouter();

  const handleSelect = (axis, value) => {
    setAnswers((prev) => ({ ...prev, [axis]: value }));
  };

  const allAnswered = QUESTIONS.every((q) => answers[q.axis[0]] || answers[q.axis[1]]);

  const handleSubmit = () => {
    if (!allAnswered) return;
    const mbti = QUESTIONS.map((q) => answers[q.axis[0]] || q.axis[0]).join('');
    if (typeof window !== 'undefined') {
      localStorage.setItem('mbtiType', mbti);
    }
    router.push('/');
  };

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>Tell us about yourself</h1>
      <p className={styles.subtitle}>Answer a few quick questions so tutorAI can adapt its explanations.</p>

      {QUESTIONS.map((q) => (
        <div key={q.id} className={styles.questionBlock}>
          <p className={styles.question}>{q.question}</p>
          <div className={styles.options}>
            {q.options.map((opt) => (
              <label key={opt.value} className={styles.optionLabel}>
                <input
                  type="radio"
                  name={q.id}
                  value={opt.value}
                  checked={answers[q.axis[0]] === opt.value || answers[q.axis[1]] === opt.value}
                  onChange={() => handleSelect(q.axis[0], opt.value)}
                />
                {opt.label}
              </label>
            ))}
          </div>
        </div>
      ))}

      <button className={styles.submitBtn} disabled={!allAnswered} onClick={handleSubmit}>
        Start learning
      </button>
    </main>
  );
} 