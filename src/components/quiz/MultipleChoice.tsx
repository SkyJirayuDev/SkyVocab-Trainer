"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

interface MultipleChoiceProps {
  wordId: string;
  question: string;
  choices: string[];
  correctAnswer: string;
  onNext: (score: number) => void;
}

export default function MultipleChoice({
  wordId,
  question,
  choices,
  correctAnswer,
  onNext,
}: MultipleChoiceProps) {
  const [selected, setSelected] = useState("");
  const [answered, setAnswered] = useState(false);

  const handleSelect = async (option: string) => {
    if (answered) return;
    setSelected(option);
    setAnswered(true);

    const isCorrect = option === correctAnswer;
    const score = isCorrect ? 1.5 : 0;

    if (isCorrect) {
      try {
        await axios.post("/api/score", {
          wordId,
          scoreToAdd: score,
        });
      } catch (error) {
        console.error("Failed to update score:", error);
      }
    }

    setTimeout(() => {
      setSelected("");
      setAnswered(false);
      onNext(score);
    }, 1500);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-6 text-center">
      <p className="text-lg text-white bg-indigo-600 px-6 py-4 rounded-xl shadow max-w-lg">
        {question}
      </p>

      <div className="grid grid-cols-1 gap-4 w-full max-w-sm">
        {choices.map((choice, index) => (
          <button
            key={index}
            onClick={() => handleSelect(choice)}
            disabled={answered}
            className={`w-full py-3 px-4 rounded-xl text-lg font-medium border transition-all
              ${
                answered
                  ? choice === correctAnswer
                    ? "bg-green-100 border-green-500 text-green-800"
                    : choice === selected
                    ? "bg-red-100 border-red-500 text-red-800"
                    : "bg-gray-100 text-gray-500"
                  : "bg-white hover:bg-indigo-50 text-black"
              }`}
          >
            {choice}
          </button>
        ))}
      </div>

      <AnimatePresence>
        {answered && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`text-lg font-bold ${
              selected === correctAnswer ? "text-green-500" : "text-red-500"
            }`}
          >
            {selected === correctAnswer ? "Correct!" : `Wrong. Answer: ${correctAnswer}`}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
