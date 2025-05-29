'use client'

import { useState } from 'react'

interface TypingProps {
  thai: string
  english: string
  onNext: () => void
}

export default function Typing({ thai, english, onNext }: TypingProps) {
  const [input, setInput] = useState('')
  const [showResult, setShowResult] = useState(false)

  const handleSubmit = () => {
    setShowResult(true)
    setTimeout(() => {
      setInput('')
      setShowResult(false)
      onNext()
    }, 1500)
  }

  return (
    <div className="max-w-md mx-auto space-y-4">
      <p className="text-lg text-center mb-4">Translate to English:</p>
      <p className="text-xl text-center text-blue-700 font-semibold">{thai}</p>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="w-full p-2 border rounded-lg"
      />
      <button
        onClick={handleSubmit}
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
      >
        Submit
      </button>
      {showResult && (
        <p className={`text-center ${input === english ? 'text-green-600' : 'text-red-600'}`}>
          {input === english ? 'Correct!' : `Wrong. Answer: ${english}`}
        </p>
      )}
    </div>
  )
}
