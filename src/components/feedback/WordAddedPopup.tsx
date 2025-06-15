"use client"
import { useEffect } from "react"

interface WordAddedPopupProps {
  word: string
  translation: string
  onClose: () => void
}

export default function WordAddedPopup({
  word,
  translation,
  onClose,
}: WordAddedPopupProps) {
  useEffect(() => {
    const sound = new Audio("/sounds/correct.mp3")
    sound.play()

    const timer = setTimeout(() => {
      onClose()
    }, 3000)

    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="rounded-xl shadow-2xl p-8 w-[90%] max-w-md text-center transition-all duration-300 
        bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-green-500/50 shadow-[0_0_30px_rgba(34,197,94,0.2)]"
      >
        <h2 className="text-3xl font-bold text-green-400 mb-4">✅ Word Added!</h2>

        <div className="space-y-2">
          <p className="text-xl font-extrabold text-white">{word}</p>
          <p className="text-gray-300 italic text-lg">{translation}</p>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-6 px-6 py-3 rounded-xl font-bold text-white
            bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 
            border border-gray-700 shadow-2xl
            hover:bg-gradient-to-br hover:from-green-600 hover:to-green-700 
            hover:border-green-500/50 hover:shadow-[0_6px_24px_rgba(34,197,94,0.3)]
            active:scale-95 transition-all duration-300 ease-out"
        >
          Close
        </button>
      </div>
    </div>
  )
}
