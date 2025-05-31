"use client";

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import ResultPopup from "./ResultPopup";

interface TypingProps {
  wordId: string;
  translation: string;
  correctWord: string;
  partOfSpeech?: string;
  definition?: string;
  examples?: string[];
  onNext: (score: number) => void;
}

export default function Typing({
  wordId,
  translation,
  correctWord,
  partOfSpeech,
  definition,
  examples,
  onNext,
}: TypingProps) {
  const [input, setInput] = useState("");
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const playFeedbackSound = (correct: boolean) => {
    const audio = new Audio(
      correct ? "/sounds/correct.mp3" : "/sounds/incorrect.mp3"
    );
    audio.play();
  };

  const handleSubmit = async () => {
    const trimmedInput = input.trim().toLowerCase();
    const isCorrectAnswer = trimmedInput === correctWord.toLowerCase();
    setIsCorrect(isCorrectAnswer);
    playFeedbackSound(isCorrectAnswer);

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

    setShowPopup(true);
  };

  const handleNext = (score: number) => {
    setInput("");
    setIsCorrect(null);
    setShowPopup(false);
    onNext(score);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSubmit();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-6 text-center">
      <p className="text-xl text-white bg-indigo-600 px-6 py-4 rounded-xl shadow max-w-lg leading-relaxed">
        Type the English word for:
        <b className="text-yellow-300 ml-2">{translation}</b>
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

      {showPopup && isCorrect !== null && (
        <ResultPopup
          isCorrect={isCorrect}
          word={correctWord}
          translation={translation}
          partOfSpeech={partOfSpeech}
          definition={definition}
          examples={examples}
          onNext={() => handleNext(isCorrect ? 2.5 : 0)}
        />
      )}
    </div>
  );
}
