"use client";
import { useState, useEffect, useCallback } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { FaHeadphones, FaVolumeUp } from "react-icons/fa";
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
  const [isPlaying, setIsPlaying] = useState(false);

  const playSound = useCallback(() => {
    if (isPlaying) return;

    setIsPlaying(true);
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = "en-US";
    utterance.rate = 0.8;
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);
    speechSynthesis.speak(utterance);
  }, [word, isPlaying]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      playSound();
    }, 1000);
    return () => clearTimeout(timeout);
  }, [playSound]);

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

  const handleNext = () => {
    setShowPopup(false);
    setSelected("");
    setAnswered(false);
    setIsCorrect(null);
    onNext(isCorrect ? 2 : 0);
  };

  return (
    <div className="h-screen flex items-center justify-center p-4">
      <div className="max-w-4xl w-full h-full flex flex-col justify-center space-y-10">
        {/* Header with listening theme */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-3 mb-3">
            <FaHeadphones className="text-3xl text-purple-400 drop-shadow-lg" />
            <h2 className="text-3xl font-bold text-white drop-shadow-lg">
              Listen & Choose
            </h2>
            <FaHeadphones className="text-3xl text-purple-400 drop-shadow-lg" />
          </div>
          <p className="text-slate-300 text-base font-medium drop-shadow">
            Listen carefully and choose the correct word
          </p>
        </div>

        {/* Audio control card */}
        <div className="relative">
          <div className="absolute inset-0 bg-purple-600/20 rounded-2xl blur-xl"></div>
          <div className="relative bg-slate-800/95 backdrop-blur-sm border-2 border-slate-600/80 rounded-2xl p-8 shadow-2xl">
            <div className="text-center space-y-6">
              <div className="flex items-center justify-center gap-2 mb-4">
                <FaVolumeUp className="text-2xl text-purple-400 drop-shadow" />
                <span className="text-slate-300 text-lg font-medium drop-shadow">
                  Audio Word:
                </span>
              </div>

              <button
                onClick={playSound}
                disabled={isPlaying}
                className="group relative px-8 py-4 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 text-white text-xl font-bold rounded-2xl shadow-2xl transition-all duration-300 transform hover:scale-105 disabled:cursor-not-allowed disabled:transform-none border border-purple-500/30"
              >
                <div className="flex items-center gap-3">
                  {isPlaying ? (
                    <VolumeX className="w-6 h-6 animate-pulse" />
                  ) : (
                    <Volume2 className="w-6 h-6" />
                  )}
                  <span className="relative z-10 drop-shadow-lg">
                    {isPlaying ? "Playing..." : "Play Audio"}
                  </span>
                </div>
              </button>
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
                    ? opt === word
                      ? "bg-green-600/90 border-green-400 text-white shadow-green-500/30"
                      : opt === selected
                      ? "bg-red-600/90 border-red-400 text-white shadow-red-500/30"
                      : "bg-slate-700/60 border-slate-600 text-slate-400"
                    : "bg-slate-800/70 border-slate-600/70 text-white hover:border-purple-400 hover:bg-purple-600/20 hover:shadow-purple-500/20 active:scale-95"
                }`}
              >
                <span className="relative z-10 drop-shadow">{opt}</span>
                {answered && opt === word && (
                  <div className="absolute inset-0 bg-green-400/20 rounded-2xl animate-pulse"></div>
                )}
                {answered && opt === selected && opt !== word && (
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
