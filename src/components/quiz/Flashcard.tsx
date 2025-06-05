"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import ResultPopup from "./ResultPopup";
import { QUIZ_SCORE } from "@/utils/scoreMap";

interface FlashcardProps {
  wordId: string;
  word: string;
  translation: string;
  partOfSpeech?: string;
  definition?: string;
  examples?: string[];
  onNext: (score: number) => void;
}

export default function Flashcard({
  wordId,
  word,
  translation,
  partOfSpeech,
  definition,
  examples,
  onNext,
}: FlashcardProps) {
  const [flipped, setFlipped] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [speechInit, setSpeechInit] = useState(false);

  const handleNext = () => {
    setShowResult(false);
    setIsCorrect(false);
    setFlipped(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] relative">
      {/* Floating particles background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-30"
            initial={{
              x: Math.random() * 800,
              y: Math.random() * 600,
              scale: Math.random() * 0.5 + 0.5,
            }}
            animate={{
              y: [null, Math.random() * 600 + 100],
              x: [null, Math.random() * 800 + 100],
            }}
            transition={{
              duration: Math.random() * 8 + 8,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* Main card container */}
      <div className="w-96 h-64 mb-8 relative">
        {/* Glowing background effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-3xl blur-xl opacity-25 animate-pulse"></div>

        {/* Card with flip animation */}
        <motion.div
          className="relative w-full h-full rounded-3xl shadow-2xl cursor-pointer"
          onClick={() => {
            if (!speechInit && typeof window !== "undefined") {
              const dummy = new SpeechSynthesisUtterance(" ");
              dummy.volume = 0;
              dummy.lang = "en-US";
              window.speechSynthesis.speak(dummy);
              setSpeechInit(true);
            }
            setFlipped(!flipped);
          }}
          whileHover={{
            scale: 1.02,
            rotateX: 2,
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.4)",
          }}
          whileTap={{
            scale: 0.98,
            transition: { duration: 0.1 },
          }}
          animate={{
            rotateY: flipped ? 180 : 0,
            scale: flipped ? [1, 1.05, 1] : 1,
          }}
          transition={{
            duration: 0.8,
            ease: [0.25, 0.46, 0.45, 0.94],
            scale: { duration: 0.6 },
          }}
          style={{
            transformStyle: "preserve-3d",
            perspective: "1000px",
          }}
        >
          {/* Front of card */}
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center rounded-3xl overflow-hidden"
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
            }}
            animate={{
              opacity: flipped ? 0 : 1,
            }}
            transition={{
              duration: 0.3,
              ease: "easeOut",
            }}
          >
            {/* Animated gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 opacity-90"></div>
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/20"></div>

            {/* Geometric patterns */}
            <div className="absolute top-4 right-4 w-8 h-8 border-2 border-white/30 rounded-lg rotate-45"></div>
            <div className="absolute bottom-4 left-4 w-6 h-6 border-2 border-white/20 rounded-full"></div>
            <div className="absolute top-8 left-8 w-4 h-4 bg-white/20 rounded-full"></div>

            {/* Word display */}
            <motion.div
              className="relative z-10 text-center px-6"
              animate={{
                y: flipped ? -10 : 0,
                scale: flipped ? 0.95 : 1,
              }}
              transition={{
                duration: 0.4,
                ease: "easeOut",
              }}
            >
              <motion.div
                className="text-4xl font-black text-white mb-2 tracking-wide"
                animate={{
                  scale: flipped ? 0.9 : 1,
                }}
                transition={{
                  duration: 0.3,
                  ease: "easeOut",
                }}
              >
                {word}
              </motion.div>
              <motion.div
                className="text-white/80 text-sm font-medium tracking-widest uppercase"
                animate={{
                  opacity: flipped ? 0.5 : 1,
                }}
                transition={{
                  duration: 0.2,
                }}
              >
                Tap to reveal
              </motion.div>
            </motion.div>

            {/* Shine effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 400, opacity: [0, 1, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            />
          </motion.div>

          {/* Back of card */}
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center rounded-3xl overflow-hidden"
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
            animate={{
              opacity: flipped ? 1 : 0,
            }}
            transition={{
              duration: 0.3,
              ease: "easeOut",
              delay: flipped ? 0.2 : 0,
            }}
          >
            {/* Animated gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 opacity-90"></div>
            <div className="absolute inset-0 bg-gradient-to-tl from-transparent via-white/10 to-white/20"></div>

            {/* Geometric patterns */}
            <div className="absolute top-4 left-4 w-8 h-8 border-2 border-white/30 rounded-lg -rotate-45"></div>
            <div className="absolute bottom-4 right-4 w-6 h-6 border-2 border-white/20 rounded-full"></div>
            <div className="absolute top-8 right-8 w-4 h-4 bg-white/20 rounded-full"></div>

            {/* Translation display */}
            <motion.div
              className="relative z-10 text-center px-6"
              animate={{
                y: flipped ? 0 : 10,
                scale: flipped ? 1 : 0.95,
              }}
              transition={{
                duration: 0.4,
                ease: "easeOut",
                delay: flipped ? 0.2 : 0,
              }}
            >
              <motion.div
                className="text-4xl font-black text-white mb-2 tracking-wide"
                animate={{
                  scale: flipped ? 1 : 0.9,
                }}
                transition={{
                  duration: 0.3,
                  ease: "easeOut",
                  delay: flipped ? 0.25 : 0,
                }}
              >
                {translation}
              </motion.div>
              <motion.div
                className="text-white/80 text-sm font-medium tracking-widest uppercase"
                animate={{
                  opacity: flipped ? 1 : 0.5,
                }}
                transition={{
                  duration: 0.3,
                  delay: flipped ? 0.3 : 0,
                }}
              >
                Tap to flip back
              </motion.div>
            </motion.div>

            {/* Shine effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 400, opacity: [0, 1, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            />
          </motion.div>
        </motion.div>
      </div>

      {/* Action buttons */}
      {flipped && (
        <motion.div
          className="flex gap-6 mt-4"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, type: "spring" }}
        >
          <motion.button
            onClick={() => {
              setIsCorrect(true);
              setShowResult(true);
            }}
            disabled={showResult}
            className="group relative px-8 py-4 text-white font-bold text-lg rounded-2xl overflow-hidden shadow-lg transition-all duration-300 disabled:opacity-50"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-400 blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
            <div className="relative z-10 flex items-center gap-2">
              <span>✓</span>
              <span>Remembered</span>
            </div>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12"
              initial={{ x: -100, opacity: 0 }}
              whileHover={{ x: 200, opacity: [0, 1, 0] }}
              transition={{ duration: 0.6 }}
            />
          </motion.button>

          <motion.button
            onClick={() => {
              setIsCorrect(false);
              setShowResult(true);
            }}
            disabled={showResult}
            className="group relative px-8 py-4 text-white font-bold text-lg rounded-2xl overflow-hidden shadow-lg transition-all duration-300 disabled:opacity-50"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-pink-500"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-pink-400 blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
            <div className="relative z-10 flex items-center gap-2">
              <span>✗</span>
              <span>Forgot</span>
            </div>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12"
              initial={{ x: -100, opacity: 0 }}
              whileHover={{ x: 200, opacity: [0, 1, 0] }}
              transition={{ duration: 0.6 }}
            />
          </motion.button>
        </motion.div>
      )}

      {showResult && (
        <ResultPopup
          isCorrect={isCorrect}
          word={word}
          translation={translation}
          partOfSpeech={partOfSpeech}
          definition={definition}
          examples={examples}
          onNext={() => {
            handleNext();
            const score = QUIZ_SCORE.flashcard(isCorrect);
            onNext(score);
          }}
        />
      )}
    </div>
  );
}
