"use client"

import { useEffect, useState } from "react"
import Flashcard from "./Flashcard"
import MultipleChoice from "./MultipleChoice"
import FillInBlank from "./FillInBlank"
import Typing from "./Typing"
import Listening from "./Listening"

interface WordData {
  _id: string
  word: string
  translation: string
  examples: string[]
  partOfSpeech: string
  definition?: string
}

const quizTypes = ["flashcard", "multiple", "blank", "typing", "listening"]

export default function QuizWrapper({
  data,
  onNext,
}: {
  data: WordData
  onNext: (score: number) => void
}) {
  const [type, setType] = useState("flashcard")

  useEffect(() => {
    const random = quizTypes[Math.floor(Math.random() * quizTypes.length)]
    setType(random)
  }, [data.word])

  const commonProps = {
    wordId: data._id,
    partOfSpeech: data.partOfSpeech,
    definition: data.definition,
    examples: data.examples,
    onNext,
  }

  switch (type) {
    case "flashcard":
      return (
        <Flashcard
          {...commonProps}
          word={data.word}
          translation={data.translation}
        />
      )

    case "multiple":
      const choices = [data.word, "xxx", "yyy", "zzz"].sort(() => 0.5 - Math.random())
      return (
        <MultipleChoice
          {...commonProps}
          word={data.word}
          translation={data.translation}
          question={data.translation}
          choices={choices}
          correctAnswer={data.word}
        />
      )

    case "blank":
      return (
        <FillInBlank
          {...commonProps}
          correctWord={data.word}
          translation={data.translation}
          sentenceTemplate={data.examples[0]?.replace(data.word, "___") || "___"}
        />
      )

    case "typing":
      return (
        <Typing
          {...commonProps}
          correctWord={data.word}
          translation={data.translation}
        />
      )

    case "listening":
      const audioChoices = [data.word, "abc", "def", "ghi"].sort(() => 0.5 - Math.random())
      return (
        <Listening
          {...commonProps}
          word={data.word}
          translation={data.translation}
          choices={audioChoices}
        />
      )

    default:
      return null
  }
}
