"use client";

import { useEffect } from "react";

interface ResultPopupProps {
  isCorrect: boolean;
  word: string;
  translation: string;
  partOfSpeech?: string;
  definition?: string;
  examples?: string[];
  onNext: () => void;
}

export default function ResultPopup({
  isCorrect,
  word,
  translation,
  partOfSpeech,
  definition,
  examples,
  onNext,
}: ResultPopupProps) {
  useEffect(() => {
    const sound = new Audio(
      isCorrect ? "/sounds/correct.mp3" : "/sounds/incorrect.mp3"
    );
    sound.play();
  }, [isCorrect]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div
        className={`rounded-2xl shadow-xl p-8 w-[90%] max-w-md text-center transition-all duration-300 ${
          isCorrect
            ? "bg-green-100 border-2 border-green-400"
            : "bg-red-100 border-2 border-red-400"
        }`}
      >
        <h2
          className={`text-3xl font-bold mb-4 ${
            isCorrect ? "text-green-600" : "text-red-600"
          }`}
        >
          {isCorrect ? "✅ Correct!" : "❌ Incorrect"}
        </h2>

        <p className="text-2xl font-extrabold text-gray-900 mb-1">{word}</p>
        <p className="text-lg text-gray-700 italic mb-2">{translation}</p>

        {partOfSpeech && (
          <p className="text-sm text-gray-600 italic mb-1">
            Part of speech: <span className="font-semibold">{partOfSpeech}</span>
          </p>
        )}

        {definition && (
          <p className="text-sm text-gray-600 italic mb-2">
            Definition: <span className="font-medium">{definition}</span>
          </p>
        )}

        {examples && examples.length > 0 && (
          <div className="text-left mt-2">
            <p className="text-sm text-gray-700 font-semibold mb-1">Example:</p>
            <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
              {examples.slice(0, 2).map((example, index) => (
                <li key={index}>{example}</li>
              ))}
            </ul>
          </div>
        )}

        <button
          onClick={onNext}
          className="mt-6 px-6 py-3 rounded-xl font-bold bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95 transition"
        >
          Next
        </button>
      </div>
    </div>
  );
}
