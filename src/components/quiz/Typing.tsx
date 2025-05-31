"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import axios from "axios";

interface TypingProps {
  wordId: string;
  translation: string;
  correctWord: string;
  onNext: (score: number) => void;
}

export default function Typing({
  wordId,
  translation,
  correctWord,
  onNext,
}: TypingProps) {
  const [input, setInput] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = async () => {
    const trimmedInput = input.trim().toLowerCase();
    const isCorrectAnswer = trimmedInput === correctWord.toLowerCase();
    setIsCorrect(isCorrectAnswer);
    setShowResult(true);

    const score = isCorrectAnswer ? 2.5 : 0;

    if (isCorrectAnswer) {
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
      setInput("");
      setShowResult(false);
      setIsCorrect(null);
      onNext(score);
    }, 1800);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSubmit();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-6 text-center">
      <p className="text-xl text-white bg-indigo-600 px-6 py-4 rounded-xl shadow max-w-lg leading-relaxed">
        Type the English word for:
        <b className="text-yellow-300 underline ml-2">{translation}</b>
      </p>

      <input
        ref={inputRef}
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyPress}
        placeholder="Type the English word"
        className="w-full max-w-sm px-4 py-2 rounded-xl border-2 border-indigo-400 bg-black/20 text-white text-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
      />

      <button
        onClick={handleSubmit}
        className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded-xl text-lg font-semibold transition duration-300"
      >
        Submit
      </button>

      <AnimatePresence>
        {showResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`text-lg font-bold flex items-center gap-2 ${
              isCorrect ? "text-green-400" : "text-red-400"
            }`}
          >
            {isCorrect ? (
              <>
                <FaCheckCircle /> Correct!
              </>
            ) : (
              <>
                <FaTimesCircle /> Wrong. Answer:{" "}
                <span className="underline">{correctWord}</span>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
