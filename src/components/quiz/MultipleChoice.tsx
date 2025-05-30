'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

interface MultipleChoiceProps {
  question: string
  options: string[]
  correct: string
  onNext: () => void
}

export default function MultipleChoice({
  question,
  options,
  correct,
  onNext,
}: MultipleChoiceProps) {
  const [selected, setSelected] = useState<string | null>(null)

  const handleSelect = (choice: string) => {
    if (selected) return
    setSelected(choice)
    setTimeout(() => {
      onNext()
    }, 1200)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-6">
      <div className="space-y-3">
        <p className="text-lg text-gray-300">What is the English word for:</p>
        <p className="text-3xl font-bold text-white bg-indigo-700 px-6 py-3 rounded-xl shadow">
          {question}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 w-full max-w-md mt-6">
        {options.map((option) => {
          const isCorrect = selected && option === correct
          const isWrong = selected && option === selected && option !== correct

          return (
            <motion.button
              key={option}
              onClick={() => handleSelect(option)}
              whileTap={{ scale: 0.95 }}
              className={`py-3 px-4 rounded-xl font-semibold transition-colors duration-300
                ${
                  isCorrect
                    ? 'bg-green-500 text-white'
                    : isWrong
                    ? 'bg-red-500 text-white'
                    : selected
                    ? 'bg-gray-700 text-white opacity-50'
                    : 'bg-white text-gray-800 hover:bg-blue-100'
                }`}
              disabled={!!selected}
            >
              {option}
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
