"use client"
import { useEffect } from "react"

interface DuplicateWordPopupProps {
  word: string
  onClose: () => void
}

export default function DuplicateWordPopup({
  word,
  onClose,
}: DuplicateWordPopupProps) {
  useEffect(() => {
    const sound = new Audio("/sounds/incorrect.mp3") 
    sound.play()

    const timer = setTimeout(() => {
      onClose()
    }, 3000)

    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="rounded-xl p-8 w-[90%] max-w-md text-center transition-all duration-300 
        bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-yellow-500/50 shadow-[0_0_30px_rgba(253,224,71,0.2)]"
      >
        <h2 className="text-3xl font-bold text-yellow-400 mb-4">⚠️ Word Exists</h2>

        <p className="text-lg text-gray-300">
          คำว่า <span className="font-semibold text-white">{word}</span> มีอยู่ในระบบแล้ว
        </p>

        <button
          onClick={onClose}
          className="w-full mt-6 px-6 py-3 rounded-xl font-bold text-white
            bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 
            border border-gray-700 shadow-2xl
            hover:bg-gradient-to-br hover:from-yellow-500 hover:to-yellow-600 
            hover:border-yellow-400/50 hover:shadow-[0_6px_24px_rgba(253,224,71,0.3)]
            active:scale-95 transition-all duration-300 ease-out"
        >
          Close
        </button>
      </div>
    </div>
  )
}
