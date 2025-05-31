"use client";

import { useState, useEffect } from "react";
import { Volume2 } from "lucide-react";
import axios from "axios";
import ResultPopup from "./ResultPopup";

interface ListeningProps {
  wordId: string;
  word: string;
  choices: string[];
  translation: string;
  partOfSpeech?: string;
  definition?: string;
  examples?: string[];
  onNext: (score: number) => void;
}

export default function Listening({
  wordId,
  word,
  choices,
  translation,
  partOfSpeech,
  definition,
  examples,
  onNext,
}: ListeningProps) {
  const [selected, setSelected] = useState("");
  const [answered, setAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    playSound();
  }, [word]);

  const playSound = () => {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = "en-US";
    speechSynthesis.speak(utterance);
  };

  const handleSelect = async (option: string) => {
    if (answered) return;

    const correct = option === word;
    const score = correct ? 2 : 0;

    setSelected(option);
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
        Listen and choose the correct word
      </p>

      <button
        onClick={playSound}
        className="flex items-center gap-2 bg-white hover:bg-indigo-100 text-indigo-600 font-semibold px-4 py-2 rounded-xl shadow transition"
      >
        <Volume2 size={20} /> Replay Sound
      </button>

      <div className="grid grid-cols-1 gap-4 w-full max-w-sm">
        {choices.map((opt, i) => (
          <button
            key={i}
            onClick={() => handleSelect(opt)}
            disabled={answered}
            className={`w-full py-3 px-4 rounded-xl text-lg font-medium border transition-all
              ${
                answered
                  ? opt === word
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
