"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import axios from "axios";
import ResultPopup from "./ResultPopup";
import { FaLightbulb } from "react-icons/fa";

interface FillInBlankProps {
  sentenceTemplate: string;
  correctWord: string;
  wordId: string;
  translation: string;
  partOfSpeech?: string;
  definition?: string;
  examples?: string[];
  onNext: (score: number) => void;
}

export default function FillInBlank({
  sentenceTemplate,
  correctWord,
  wordId,
  translation,
  partOfSpeech,
  definition,
  examples,
  onNext,
}: FillInBlankProps) {
  const [input, setInput] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = async () => {
    const isCorrectAnswer = input.trim().toLowerCase() === correctWord.toLowerCase();
    setIsCorrect(isCorrectAnswer);

    const point = isCorrectAnswer ? 3 : 0;

    if (isCorrectAnswer) {
      try {
        await axios.post("/api/score", {
          wordId,
          scoreToAdd: point,
        });
      } catch (error) {
        console.error("Error updating score:", error);
      }
    }

    setTimeout(() => {
      setShowPopup(true);
    }, 500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSubmit();
  };

  const handleNext = () => {
    setShowPopup(false);
    setInput("");
    setIsCorrect(null);
    onNext(isCorrect ? 3 : 0);
  };

  const parts = sentenceTemplate.split("___");

  const partialHint = useMemo(() => {
    const maxToShow = Math.floor(correctWord.length / 2);
    const indices = new Set<number>();
    while (indices.size < Math.min(maxToShow, correctWord.length)) {
      indices.add(Math.floor(Math.random() * correctWord.length));
    }
    return correctWord
      .split("")
      .map((char, idx) => (indices.has(idx) ? char : "_"))
      .join(" ");
  }, [correctWord]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-6 text-center">
      <p className="text-xl text-white bg-indigo-600 px-6 py-4 rounded-xl shadow max-w-lg leading-relaxed">
        {parts[0]}
        <b className="text-red-500 underline px-2 tracking-widest">___</b>
        {parts[1]}
      </p>

      <div className="flex flex-col gap-1 items-center text-yellow-400 text-sm italic">
        <div className="flex items-center gap-2">
          <FaLightbulb />
          Hint: <span className="font-mono text-white">{partialHint}</span>
        </div>
        <div>({correctWord.length} letters)</div>
      </div>

      <input
        ref={inputRef}
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyPress}
        placeholder="Type the missing word"
        className="w-full max-w-sm px-4 py-2 rounded-xl border-2 border-indigo-400 bg-black/20 text-white text-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
      />

      <button
        onClick={handleSubmit}
        className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded-xl text-lg font-semibold transition duration-300"
      >
        Submit
      </button>

      {showPopup && (
        <ResultPopup
          isCorrect={!!isCorrect}
          word={correctWord}
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