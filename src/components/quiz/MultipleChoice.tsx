"use client";

import { useState } from "react";
import axios from "axios";
import ResultPopup from "./ResultPopup";

interface MultipleChoiceProps {
  wordId: string;
  word: string;
  translation: string;
  question: string;
  choices: string[];
  correctAnswer: string;
  partOfSpeech?: string;
  definition?: string;
  examples?: string[];
  onNext: (score: number) => void;
}

export default function MultipleChoice({
  wordId,
  word,
  translation,
  question,
  choices,
  correctAnswer,
  partOfSpeech,
  definition,
  examples,
  onNext,
}: MultipleChoiceProps) {
  const [selected, setSelected] = useState("");
  const [answered, setAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showPopup, setShowPopup] = useState(false);

  const handleSelect = async (choice: string) => {
    if (answered) return;

    const correct = choice === correctAnswer;
    const score = correct ? 2 : 0;

    setSelected(choice);
    setIsCorrect(correct);
    setAnswered(true);

    if (correct) {
      try {
        await axios.post("/api/score", {
          wordId,
          scoreToAdd: score,
        });
      } catch (err) {
        console.error("Failed to update score:", err);
      }
    }

    setTimeout(() => {
      setShowPopup(true);
    }, 500);
  };

  const handleNext = (score: number) => {
    setShowPopup(false);
    setSelected("");
    setAnswered(false);
    setIsCorrect(null);
    onNext(score);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-6">
      <p className="text-lg font-semibold text-white bg-indigo-600 px-6 py-3 rounded-xl shadow">
        {question}
      </p>

      <div className="grid grid-cols-1 gap-4 w-full max-w-sm">
        {choices.map((opt, i) => (
          <button
            key={i}
            onClick={() => handleSelect(opt)}
            disabled={answered}
            className={`w-full py-3 px-4 rounded-xl text-lg font-medium border transition-all
              ${
                answered
                  ? opt === correctAnswer
                    ? "bg-green-100 border-green-500 text-green-800"
                    : opt === selected
                    ? "bg-red-100 border-red-500 text-red-800"
                    : "bg-gray-100 text-gray-500"
                  : "bg-white hover:bg-indigo-50 text-black"
              }`}
          >
            {opt}
          </button>
        ))}
      </div>

      {showPopup && isCorrect !== null && (
        <ResultPopup
          isCorrect={isCorrect}
          word={word}
          translation={translation}
          partOfSpeech={partOfSpeech}
          definition={definition}
          examples={examples}
          onNext={() => handleNext(isCorrect ? 2 : 0)}
        />
      )}
    </div>
  );
}
