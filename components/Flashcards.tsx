'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { spring } from '@/lib/motion';

const CARDS = [
  { question: 'Who is Talk the Talk for?', answer: 'Everyone! Whether you are a beginner or advanced, as long as you want consistency and practice.' },
  { question: 'Do I need a high English level to start?', answer: "No! You don't have to be at a certain level. You just have to start at your own pace." },
  { question: 'Will I become fluent in 30 days?', answer: "The goal isn't magical fluency in 30 days—it's building a daily practice habit so you stop starting over!" },
  { question: 'What makes this planner different from a regular notebook?', answer: 'It provides a proven daily system (Learn -> Write -> Speak -> Practice -> Reflect -> Repeat) instead of blank pages.' },
];

const FACE = 'absolute inset-0 flex flex-col justify-between rounded-3xl p-7 [backface-visibility:hidden]';

function Flashcard({ question, answer }: (typeof CARDS)[number]) {
  const [flipped, setFlipped] = useState(false);

  return (
    <motion.div whileHover={{ y: -6 }} transition={spring} className="[perspective:1200px]">
      <button
        type="button"
        onClick={() => setFlipped((value) => !value)}
        aria-pressed={flipped}
        className="relative block h-72 w-full text-left sm:h-64"
      >
        <motion.div
          className="relative h-full w-full [transform-style:preserve-3d]"
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ type: 'spring', stiffness: 150, damping: 18 }}
        >
          <div className={`${FACE} border border-matcha-600/20 bg-butter shadow-md`}>
            <p className="font-serif text-2xl leading-snug text-matcha-800">{question}</p>
            <p className="text-xs text-matcha-600">Click on card to see answer · إضغط على الكارت لرؤية الإجابة</p>
          </div>
          <div className={`${FACE} bg-matcha-800 text-butter shadow-md [transform:rotateY(180deg)]`}>
            <p className="text-lg leading-relaxed">{answer}</p>
          </div>
        </motion.div>
      </button>
    </motion.div>
  );
}

export function Flashcards() {
  return (
    <div className="mx-auto grid max-w-5xl gap-6 px-6 sm:grid-cols-2">
      {CARDS.map((card) => (
        <Flashcard key={card.question} {...card} />
      ))}
    </div>
  );
}
