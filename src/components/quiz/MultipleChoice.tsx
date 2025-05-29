'use client'

import { useState, useEffect } from 'react'

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
    setSelected(choice)
    setTimeout(() => {
      onNext()
    }, 1000)
  }

  return (
    <div className="max-w-md mx-auto space-y-4">
      <p className="text-lg text-center mb-4">What is the English word for:</p>
      <p className="text-xl text-center font-semibold text-blue-700">{question}</p>
      <div className="grid grid-cols-2 gap-4">
        {options.map((option) => (
          <button
            key={option}
            onClick={() => handleSelect(option)}
            className={`p-2 border rounded-lg ${
              selected
                ? option === correct
                  ? 'bg-green-200'
                  : option === selected
                  ? 'bg-red-200'
                  : 'bg-gray-100'
                : 'bg-white hover:bg-blue-100'
            }`}
            disabled={!!selected}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  )
}
