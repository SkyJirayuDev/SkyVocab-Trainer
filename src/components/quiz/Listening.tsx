"use client"

import { useState, useEffect } from 'react'

interface ListeningProps {
  word: string
  choices: string[]
  onNext: () => void
}

export default function Listening({ word, choices, onNext }: ListeningProps) {
  const [selected, setSelected] = useState("")
  const [answered, setAnswered] = useState(false)

  useEffect(() => {
    const utterance = new SpeechSynthesisUtterance(word)
    utterance.lang = "en-US"
    speechSynthesis.speak(utterance)
  }, [word])

  const handleSelect = (option: string) => {
    if (!answered) {
      setSelected(option)
      setAnswered(true)
      setTimeout(() => {
        setSelected("")
        setAnswered(false)
        onNext()
      }, 1500)
    }
  }

  return (
    <div className="max-w-md mx-auto space-y-4">
      <p className="text-center">Listen and choose the correct word</p>
      <button
        onClick={() => {
          const u = new SpeechSynthesisUtterance(word)
          u.lang = "en-US"
          speechSynthesis.speak(u)
        }}
        className="w-full bg-gray-200 py-2 rounded-lg hover:bg-gray-300"
      >🔊 Replay Sound</button>
      <div className="grid grid-cols-1 gap-3">
        {choices.map((opt, i) => (
          <button
            key={i}
            onClick={() => handleSelect(opt)}
            className={`w-full py-2 px-4 rounded-lg text-left border transition-all
              ${answered && opt === word ? 'bg-green-100 border-green-600' : ''}
              ${answered && opt === selected && opt !== word ? 'bg-red-100 border-red-600' : ''}
              ${!answered ? 'hover:bg-gray-100' : ''}`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  )
}