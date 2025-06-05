"use client";
import { useState, useRef, useMemo } from "react";
import ResultPopup from "./ResultPopup";
import { FaLightbulb, FaPuzzlePiece } from "react-icons/fa";
import { QUIZ_SCORE } from "@/utils/scoreMap";

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
  const [isTyping, setIsTyping] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    const isCorrectAnswer =
      input.trim().toLowerCase() === correctWord.toLowerCase();
    setIsCorrect(isCorrectAnswer);
    setTimeout(() => {
      setShowPopup(true);
    }, 500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSubmit();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    setIsTyping(e.target.value.length > 0);
  };

  const handleNext = () => {
    setShowPopup(false);
    setInput("");
    setIsCorrect(null);
    setIsTyping(false);
    const score = QUIZ_SCORE.fill(!!isCorrect);
    onNext(score);
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
    <div className="min-h-screen flex flex-col items-center p-4 pt-10">
      <div className="max-w-4xl w-full flex flex-col space-y-5">
        {/* Header with puzzle theme */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-3 mb-3">
            <FaPuzzlePiece className="text-3xl text-blue-400 drop-shadow-lg" />
            <h2 className="text-3xl font-bold text-white drop-shadow-lg">
              Fill in the Blank
            </h2>
            <FaPuzzlePiece className="text-3xl text-blue-400 drop-shadow-lg" />
          </div>
          <p className="text-slate-300 text-sm font-medium drop-shadow">
            Complete the sentence by filling in the missing word
          </p>
        </div>

        {/* Main sentence card */}
        <div className="relative">
          <div className="absolute inset-0 bg-blue-600/20 rounded-2xl blur-xl"></div>
          <div className="relative bg-slate-800/95 backdrop-blur-sm border-2 border-slate-600/80 rounded-2xl p-8 shadow-2xl">
            <div className="text-center">
              <p className="text-2xl text-white leading-relaxed font-semibold drop-shadow-lg">
                {parts[0]}
                <span className="inline-flex items-center justify-center mx-3 px-6 py-3 bg-slate-700/60 rounded-xl border-2 border-dashed border-blue-400/70 text-blue-200 font-mono tracking-wider min-w-[120px] animate-pulse shadow-lg">
                  {isTyping ? input : "???"}
                </span>
                {parts[1]}
              </p>
            </div>
          </div>
        </div>

        {/* Hint section */}
        <div className="flex justify-center">
          <div>
            <div className="flex items-center gap-2 text-slate-200">
              <FaLightbulb className="text-sm animate-pulse drop-shadow text-yellow-400" />
              <span className="text-sm font-medium drop-shadow">Hint:</span>
              <span className="font-mono text-sm bg-slate-800/60 px-2 py-1 rounded border border-slate-600/60 text-white shadow-inner">
                {partialHint}
              </span>
              <span className="text-sm text-slate-300 font-medium drop-shadow">
                ({correctWord.length} letters)
              </span>
            </div>
          </div>
        </div>

        {/* Input section */}
        <div className="flex flex-col items-center space-y-6">
          <div className="relative w-full max-w-md">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyPress}
              placeholder="Type your answer here..."
              className="w-full px-6 py-4 text-xl text-center text-white bg-slate-800/70 backdrop-blur-sm border-2 border-slate-600/70 rounded-2xl shadow-2xl focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-400/30 transition-all duration-300 placeholder-slate-400 font-medium"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={!input.trim()}
            className="group relative px-10 py-4 bg-green-600 hover:bg-green-700 disabled:bg-slate-600 text-white text-xl font-bold rounded-2xl shadow-2xl transition-all duration-300 transform hover:scale-105 disabled:cursor-not-allowed disabled:transform-none border border-green-500/30"
          >
            <span className="relative z-10 drop-shadow-lg">Check Answer</span>
          </button>
        </div>
      </div>

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
