"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface FillInBlankProps {
  sentenceTemplate: string
  correctWord: string
  onNext: () => void
}

export default function FillInBlank({ sentenceTemplate, correctWord, onNext }: FillInBlankProps) {
  const [input, setInput] = useState("")
  const [showResult, setShowResult] = useState(false)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)

  const handleSubmit = () => {
    const isCorrectAnswer = input.trim().toLowerCase() === correctWord.toLowerCase()
    setIsCorrect(isCorrectAnswer)
    setShowResult(true)

    setTimeout(() => {
      setInput("")
      setShowResult(false)
      setIsCorrect(null)
      onNext()
    }, 1800)
  }

  const parts = sentenceTemplate.split("___")

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-6 text-center">
      <p className="text-xl text-white bg-indigo-600 px-6 py-4 rounded-xl shadow max-w-lg">
        {parts[0]}
        <b className="text-red-500 underline px-2">___</b>
        {parts[1]}
      </p>

      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type the missing word"
        className="w-full max-w-sm px-4 py-2 rounded-xl border border-gray-300 text-lg text-white shadow-md"
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`text-lg font-semibold ${
              isCorrect ? "text-green-400" : "text-red-400"
            }`}
          >
            {isCorrect ? "Correct!" : `Wrong. Answer: ${correctWord}`}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
