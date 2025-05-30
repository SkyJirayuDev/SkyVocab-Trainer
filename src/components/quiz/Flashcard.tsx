"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface FlashcardProps {
  word: string;
  translation: string;
  onNext: (score: number) => void;
}

export default function Flashcard({
  word,
  translation,
  onNext,
}: FlashcardProps) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh]">
      <div className="perspective w-80 h-52 mb-6">
        <motion.div
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.6 }}
          className="relative w-full h-full rounded-2xl shadow-xl border border-white/20 text-black dark:text-white transform-style-preserve-3d"
          style={{
            transformStyle: "preserve-3d",
          }}
        >
          {/* Front */}
          <div
            className="absolute w-full h-full flex items-center justify-center text-2xl font-bold rounded-2xl bg-white dark:bg-slate-700 backface-hidden"
            style={{ backfaceVisibility: "hidden" }}
            onClick={() => setFlipped(true)}
          >
            {word}
          </div>

          {/* Back */}
          <div
            className="absolute w-full h-full flex items-center justify-center text-2xl font-bold rounded-2xl bg-indigo-100 dark:bg-indigo-500 text-white rotateY-180"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
            onClick={() => setFlipped(false)}
          >
            {translation}
          </div>
        </motion.div>
      </div>

      {flipped && (
        <div className="flex gap-4 mt-2">
          <button
            onClick={() => onNext(1)}
            className="px-5 py-2 text-white bg-green-600 hover:bg-green-700 rounded-lg font-semibold transition"
          >
            Remembered
          </button>
          <button
            onClick={() => onNext(0)}
            className="px-5 py-2 text-white bg-red-500 hover:bg-red-600 rounded-lg font-semibold transition"
          >
            Forgot
          </button>
        </div>
      )}
    </div>
  );
}
