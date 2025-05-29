"use client"

import { useEffect, useState } from "react"

interface FlashcardProps {
  word: string
  translation: string
  onNext: () => void
}

export default function Flashcard({ word, translation, onNext }: FlashcardProps) {
  const [flipped, setFlipped] = useState(false)

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div
        className="w-80 h-48 bg-white rounded-xl shadow-md flex items-center justify-center text-2xl font-bold cursor-pointer border border-gray-300"
        onClick={() => setFlipped(!flipped)}
      >
        {flipped ? translation : word}
      </div>
      <button
        onClick={onNext}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
      >
        Next
      </button>
    </div>
  )
}