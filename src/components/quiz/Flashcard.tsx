"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import ResultPopup from "./ResultPopup";

interface FlashcardProps {
  wordId: string;
  word: string;
  translation: string;
  partOfSpeech?: string;
  definition?: string;
  examples?: string[];
  onNext: (score: number) => void;
}

export default function Flashcard({
  wordId,
  word,
  translation,
  partOfSpeech,
  definition,
  examples,
  onNext,
}: FlashcardProps) {
  const [flipped, setFlipped] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleAnswer = async (score: number) => {
    setSubmitting(true);
    setIsCorrect(score === 1);
    try {
      await axios.post("/api/score", {
        wordId,
        scoreToAdd: score,
      });
    } catch (error) {
      console.error("Error updating score:", error);
    } finally {
      setShowResult(true);
      setSubmitting(false);
    }
  };

  const handleNext = () => {
    setShowResult(false);
    setIsCorrect(false);
    setFlipped(false);
    onNext(isCorrect ? 1 : 0);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh]">
      <div className="perspective w-80 h-52 mb-6">
        <motion.div
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.6 }}
          className="relative w-full h-full rounded-2xl shadow-xl border border-white/20 text-black dark:text-white"
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Front */}
          <div
            className="absolute w-full h-full flex items-center justify-center text-2xl font-bold rounded-2xl bg-white dark:bg-slate-700"
            style={{ backfaceVisibility: "hidden" }}
            onClick={() => setFlipped(true)}
          >
            {word}
          </div>

          {/* Back */}
          <div
            className="absolute w-full h-full flex items-center justify-center text-2xl font-bold rounded-2xl bg-indigo-100 dark:bg-indigo-500 text-white"
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
            onClick={() => handleAnswer(1)}
            disabled={submitting}
            className="px-5 py-2 text-white bg-green-600 hover:bg-green-700 rounded-lg font-semibold transition"
          >
            Remembered
          </button>
          <button
            onClick={() => handleAnswer(0)}
            disabled={submitting}
            className="px-5 py-2 text-white bg-red-500 hover:bg-red-600 rounded-lg font-semibold transition"
          >
            Forgot
          </button>
        </div>
      )}

      {showResult && (
        <ResultPopup
          isCorrect={isCorrect}
          word={word}
          translation={translation}
          partOfSpeech={partOfSpeech}
          definition={definition}
          examples={examples}
          onNext={handleNext}
        />
      )}
    </div>
  );
}
