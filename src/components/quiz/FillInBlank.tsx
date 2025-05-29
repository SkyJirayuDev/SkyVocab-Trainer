"use client"

import { useState, useEffect } from 'react'

interface FillInBlankProps {
  sentenceTemplate: string
  correctWord: string
  onNext: () => void
}

export default function FillInBlank({ sentenceTemplate, correctWord, onNext }: FillInBlankProps) {
  const [input, setInput] = useState("")
  const [showResult, setShowResult] = useState(false)

  const handleSubmit = () => {
    setShowResult(true)
    setTimeout(() => {
      setInput("")
      setShowResult(false)
      onNext()
    }, 1500)
  }

  const parts = sentenceTemplate.split("___")

  return (
    <div className="max-w-md mx-auto space-y-4">
      <p className="text-lg text-center">
        {parts[0]}
        <b className="text-blue-600">___</b>
        {parts[1]}
      </p>
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
        <p className={`text-center ${input === correctWord ? 'text-green-600' : 'text-red-600'}`}>
          {input === correctWord ? 'Correct!' : `Wrong. Answer: ${correctWord}`}
        </p>
      )}
    </div>
  )
}
