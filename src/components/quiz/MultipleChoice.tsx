"use client";
import { useState } from "react";
import { FaQuestionCircle, FaCheckCircle } from "react-icons/fa";
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

  const handleNext = () => {
    setShowPopup(false);
    setSelected("");
    setAnswered(false);
    setIsCorrect(null);
    onNext(isCorrect ? 2 : 0);
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-4 pt-10">
      <div className="max-w-4xl w-full flex flex-col space-y-5">
        {/* Header with quiz theme */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-3 mb-3">
            <FaQuestionCircle className="text-3xl text-orange-400 drop-shadow-lg" />
            <h2 className="text-3xl font-bold text-white drop-shadow-lg">
              Multiple Choice
            </h2>
            <FaQuestionCircle className="text-3xl text-orange-400 drop-shadow-lg" />
          </div>
          <p className="text-slate-300 text-sm font-medium drop-shadow">
            Choose the best answer from the options below
          </p>
        </div>

        {/* Question card */}
        <div className="relative">
          <div className="absolute inset-0 bg-orange-600/20 rounded-2xl blur-xl"></div>
          <div className="relative bg-slate-800/95 backdrop-blur-sm border-2 border-slate-600/80 rounded-2xl p-8 shadow-2xl">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-2 mb-4">
                <FaCheckCircle className="text-2xl text-orange-400 drop-shadow" />
                <span className="text-slate-300 text-lg font-medium drop-shadow">
                  Question:
                </span>
              </div>
              <p className="text-2xl text-white font-semibold drop-shadow-lg leading-relaxed">
                {question}
              </p>
            </div>
          </div>
        </div>

        {/* Choices section */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 max-w-2xl mx-auto">
            {choices.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleSelect(opt)}
                disabled={answered}
                className={`relative w-full py-4 px-6 rounded-2xl text-lg font-semibold border-2 transition-all duration-300 transform hover:scale-[1.02] shadow-lg ${
                  answered
                    ? opt === correctAnswer
                      ? "bg-green-600/90 border-green-400 text-white shadow-green-500/30"
                      : opt === selected
                      ? "bg-red-600/90 border-red-400 text-white shadow-red-500/30"
                      : "bg-slate-700/60 border-slate-600 text-slate-400"
                    : "bg-slate-800/70 border-slate-600/70 text-white hover:border-orange-400 hover:bg-orange-600/20 hover:shadow-orange-500/20 active:scale-95"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 bg-slate-700/60 rounded-full flex items-center justify-center text-sm font-bold border border-slate-600">
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span className="relative z-10 drop-shadow text-left flex-1">
                    {opt}
                  </span>
                </div>
                {answered && opt === correctAnswer && (
                  <div className="absolute inset-0 bg-green-400/20 rounded-2xl animate-pulse"></div>
                )}
                {answered && opt === selected && opt !== correctAnswer && (
                  <div className="absolute inset-0 bg-red-400/20 rounded-2xl animate-pulse"></div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {showPopup && isCorrect !== null && (
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
