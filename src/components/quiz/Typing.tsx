"use client";
import { useState, useRef } from "react";
import axios from "axios";
import ResultPopup from "./ResultPopup";
import { FaKeyboard, FaLanguage } from "react-icons/fa";

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

  const handleSubmit = async () => {
    const trimmedInput = input.trim().toLowerCase();
    const isCorrectAnswer = trimmedInput === correctWord.toLowerCase();
    setIsCorrect(isCorrectAnswer);

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
      setShowPopup(true);
    }, 500);
  };

  const handleNext = () => {
    setInput("");
    setIsCorrect(null);
    setShowPopup(false);
    onNext(isCorrect ? 2.5 : 0);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSubmit();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-4 pt-10">
      <div className="max-w-4xl w-full flex flex-col space-y-5">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-3 mb-3">
            <FaKeyboard className="text-3xl text-green-400 drop-shadow-lg" />
            <h2 className="text-3xl font-bold text-white drop-shadow-lg">
              Type the Word
            </h2>
            <FaKeyboard className="text-3xl text-green-400 drop-shadow-lg" />
          </div>
          <p className="text-slate-300 text-base font-medium drop-shadow">
            Type the English word for the given translation
          </p>
        </div>

        {/* Translation Card */}
        <div className="relative">
          <div className="absolute inset-0 bg-green-600/20 rounded-2xl blur-xl"></div>
          <div className="relative bg-slate-800/95 backdrop-blur-sm border-2 border-slate-600/80 rounded-2xl p-8 shadow-2xl">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-2 mb-4">
                <FaLanguage className="text-2xl text-green-400 drop-shadow" />
                <span className="text-slate-300 text-lg font-medium drop-shadow">
                  Translation:
                </span>
              </div>
              <p className="text-3xl text-white font-bold drop-shadow-lg leading-relaxed">
                {translation}
              </p>
            </div>
          </div>
        </div>

        {/* Hint */}
        <div className="flex justify-center">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 text-slate-200">
              <span className="text-sm font-medium drop-shadow">
                Target word length:
              </span>
              <span className="font-mono text-sm bg-slate-800/60 px-3 py-1 rounded border border-slate-600/60 text-white shadow-inner">
                {correctWord.length} letters
              </span>
            </div>
          </div>
        </div>

        {/* Input Section */}
        <div className="flex flex-col items-center space-y-6">
          <div className="relative w-full max-w-md">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyPress}
              placeholder="Type the English word..."
              className="w-full px-6 py-4 text-xl text-center text-white bg-slate-800/70 backdrop-blur-sm border-2 border-slate-600/70 rounded-2xl shadow-2xl focus:outline-none focus:border-green-400 focus:ring-4 focus:ring-green-400/30 transition-all duration-300 placeholder-slate-400 font-medium"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={!input.trim()}
            className="group relative px-10 py-4 bg-green-600 hover:bg-green-700 disabled:bg-slate-600 text-white text-xl font-bold rounded-2xl shadow-2xl transition-all duration-300 transform hover:scale-105 disabled:cursor-not-allowed disabled:transform-none border border-green-500/30"
          >
            <span className="relative z-10 drop-shadow-lg">Submit Answer</span>
          </button>
        </div>
      </div>

      {showPopup && isCorrect !== null && (
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
