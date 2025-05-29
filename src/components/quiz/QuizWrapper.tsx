"use client"

import { useEffect, useState } from "react"
import Flashcard from "./Flashcard"
import MultipleChoice from "./MultipleChoice"
import FillInBlank from "./FillInBlank"
import Typing from "./Typing"
import Listening from "./Listening"

interface WordData {
  word: string
  translation: string
  examples: string[]
  partOfSpeech: string
}

const quizTypes = ["flashcard", "multiple", "blank", "typing", "listening"]

export default function QuizWrapper({
  data,
  onNext,
}: {
  data: WordData
  onNext: () => void
}) {
  const [type, setType] = useState("flashcard")

  useEffect(() => {
    const random = quizTypes[Math.floor(Math.random() * quizTypes.length)]
    setType(random)
  }, [data.word]) 

  switch (type) {
    case "flashcard":
      return <Flashcard word={data.word} translation={data.translation} onNext={onNext} />
    case "multiple":
      return <MultipleChoice question={data.word} options={[data.translation, "xxx", "yyy", "zzz"]} correct={data.translation} onNext={onNext} />
    case "blank":
      return <FillInBlank sentenceTemplate={data.examples[0].replace(data.word, "___")} correctWord={data.word} onNext={onNext} />
    case "typing":
      return <Typing thai={data.translation} english={data.word} onNext={onNext} />
    case "listening":
      return <Listening word={data.word} choices={[data.word, "abc", "def", "ghi"]} onNext={onNext} />
    default:
      return null
  }
}
