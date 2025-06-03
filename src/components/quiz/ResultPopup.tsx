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
    sound.onended = () => {
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = "en-US";
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    };
    sound.play();
  }, [isCorrect, word]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div
        className={`rounded-xl shadow-2xl p-8 w-[90%] max-w-md text-center transition-all duration-300 
          bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700 ${
          isCorrect
            ? "border-green-500/50 shadow-[0_0_30px_rgba(34,197,94,0.2)]"
            : "border-red-500/50 shadow-[0_0_30px_rgba(239,68,68,0.2)]"
        }`}
      >
        {/* Result Header */}
        <div className="mb-6">
          <h2
            className={`text-3xl font-bold mb-2 ${
              isCorrect ? "text-green-400" : "text-red-400"
            }`}
          >
            {isCorrect ? "✅ Correct!" : "❌ Incorrect"}
          </h2>
          
          {/* Status indicator */}
          <div 
            className={`inline-block px-4 py-1 rounded-full text-sm font-semibold ${
              isCorrect 
                ? "bg-green-500/20 text-green-300 border border-green-500/30" 
                : "bg-red-500/20 text-red-300 border border-red-500/30"
            }`}
          >
            {isCorrect ? "Well done!" : "Keep trying!"}
          </div>
        </div>

        {/* Word Information */}
        <div className="mb-6 space-y-3">
          <p className="text-2xl font-extrabold text-white mb-1">{word}</p>
          <p className="text-lg text-gray-300 italic">{translation}</p>
          
          {partOfSpeech && (
            <div className="inline-block px-3 py-1 bg-gray-700/50 border border-gray-600 rounded-lg">
              <p className="text-sm text-gray-400">
                <span className="font-semibold text-indigo-400">{partOfSpeech}</span>
              </p>
            </div>
          )}
        </div>

        {/* Definition */}
        {definition && (
          <div className="mb-4 p-4 bg-gray-800/50 border border-gray-700 rounded-xl">
            <p className="text-sm text-gray-400 mb-1 font-semibold">Definition:</p>
            <p className="text-sm text-gray-300">{definition}</p>
          </div>
        )}

        {/* Examples */}
        {examples && examples.length > 0 && (
          <div className="text-left mb-6 p-4 bg-gray-800/50 border border-gray-700 rounded-xl">
            <p className="text-sm text-gray-400 font-semibold mb-2 flex items-center gap-2">
              💡 Examples:
            </p>
            <ul className="space-y-2">
              {examples.slice(0, 2).map((example, index) => (
                <li key={index} className="text-sm text-gray-300 flex items-start gap-2">
                  <span className="text-indigo-400 mt-1">•</span>
                  <span>{example}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Next Button */}
        <button
          onClick={onNext}
          className="w-full mt-6 px-6 py-3 rounded-xl font-bold text-white
            bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 
            border border-gray-700 shadow-2xl
            hover:bg-gradient-to-br hover:from-indigo-600 hover:to-indigo-700 
            hover:border-indigo-500/50 hover:shadow-[0_6px_24px_rgba(99,102,241,0.3)]
            active:scale-95 transition-all duration-300 ease-out"
        >
          Continue →
        </button>
      </div>
    </div>
  );
}