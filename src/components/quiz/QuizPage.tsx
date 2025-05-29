'use client'

import { useEffect, useState } from 'react'
import Flashcard from './Flashcard'
import MultipleChoice from './MultipleChoice'
import FillInBlank from './FillInBlank'
import Typing from './Typing'
import Listening from './Listening'

interface Word {
  _id: string
  word: string
  translation: string
  examples: string[]
  partOfSpeech: string
  category: string
  level: number
  nextReviewDate: string
  lastReviewedDate: string
  incorrectCount: number
  definition?: string
}

const quizTypes = ['flashcard', 'multiple', 'fill', 'typing', 'listening']

export default function QuizPage() {
  const [words, setWords] = useState<Word[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [quizTypeIndex, setQuizTypeIndex] = useState(0)
  const [showScore, setShowScore] = useState(false)
  const [scores, setScores] = useState<Record<string, number>>({})

  useEffect(() => {
  fetch('/api/review')
    .then((res) => res.json())
    .then((data) => {
      if (Array.isArray(data)) {
        setWords(data)
        setCurrentIndex(0)
        setQuizTypeIndex(0)
      } else {
        setWords([])
      }
    })
  }, [])

  const handleNext = (score?: number) => {
    const word = words[currentIndex]
    if (score !== undefined && word) {
      setScores((prev) => ({
        ...prev,
        [word._id]: (prev[word._id] || 0) + score,
      }))
    }

    if (currentIndex + 1 >= words.length) {
      setShowScore(true)
      fetch('/api/review/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(scores),
      })
      return
    }

    setCurrentIndex((prev) => prev + 1)
    setQuizTypeIndex((prev) => (prev + 1) % quizTypes.length)
  }

  if (words.length === 0) {
    return <p className="text-center mt-10">Loading words...</p>
  }

  if (showScore) {
    return (
      <div className="text-center mt-10">
        <h2 className="text-xl font-semibold mb-2">Finished Training!</h2>
        <p>Total Words Trained: {Object.keys(scores).length}</p>
        <p>Good job! 🎉</p>
      </div>
    )
  }

  const word = words[currentIndex]
  const type = quizTypes[quizTypeIndex]

  const generateChoices = () => {
    const shuffled = [...words]
      .filter((w) => w.word !== word.word)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)
      .map((w) => w.word)
    return [...shuffled, word.word].sort(() => 0.5 - Math.random())
  }

  return (
    <div className="p-4">
      <p className="text-sm text-gray-500 text-right mb-2">
        {currentIndex + 1} / {words.length} · Mode: <span className="capitalize">{type}</span>
      </p>

      {type === 'flashcard' && (
        <Flashcard
          word={word.word}
          translation={word.translation}
          onNext={() => handleNext(1)}
        />
      )}

      {type === 'multiple' && (
        <MultipleChoice
          question={word.translation}
          options={generateChoices()}
          correct={word.word}
          onNext={() => handleNext(1)}
        />
      )}

      {type === 'fill' && (
        <FillInBlank
          sentenceTemplate={word.examples[0]?.replace(word.word, '___') || '___'}
          correctWord={word.word}
          onNext={() => handleNext(1)}
        />
      )}

      {type === 'typing' && (
        <Typing
          thai={word.translation}
          english={word.word}
          onNext={() => handleNext(1)}
        />
      )}

      {type === 'listening' && (
        <Listening
          word={word.word}
          choices={generateChoices()}
          onNext={() => handleNext(1)}
        />
      )}
    </div>
  )
}
