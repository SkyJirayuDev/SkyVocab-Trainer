'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface TypingProps {
  thai: string
  english: string
  onNext: () => void
}

export default function Typing({ thai, english, onNext }: TypingProps) {
  const [input, setInput] = useState('')
  const [showResult, setShowResult] = useState(false)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)

  const handleSubmit = () => {
    const isCorrectAnswer = input.trim().toLowerCase() === english.toLowerCase()
    setIsCorrect(isCorrectAnswer)
    setShowResult(true)

    setTimeout(() => {
      setInput('')
      setShowResult(false)
      setIsCorrect(null)
      onNext()
    }, 1800)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-6 text-center">
      <p className="text-lg font-semibold text-white bg-indigo-600 px-6 py-3 rounded-xl shadow">
        Translate this word to English:
      </p>

      <p className="text-2xl font-bold text-yellow-300">{thai}</p>

      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type in English..."
        className="w-full max-w-sm px-4 py-2 text-lg border border-gray-300 rounded-xl shadow-md text-white"
      />

      <button
        onClick={handleSubmit}
        className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-3 rounded-xl text-lg font-semibold transition duration-300"
      >
        Submit
      </button>

      <AnimatePresence>
        {showResult && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`text-lg font-semibold ${
              isCorrect ? 'text-green-400' : 'text-red-400'
            }`}
          >
            {isCorrect ? 'Correct!' : `Wrong. Answer: ${english}`}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
