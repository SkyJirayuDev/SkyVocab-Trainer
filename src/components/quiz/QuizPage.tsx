"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Flashcard from "./Flashcard";
import MultipleChoice from "./MultipleChoice";
import FillInBlank from "./FillInBlank";
import Typing from "./Typing";
import Listening from "./Listening";

interface Word {
  _id: string;
  word: string;
  translation: string;
  examples: string[];
  partOfSpeech: string;
  category: string;
  level: number;
  nextReviewDate: string;
  lastReviewedDate: string;
  incorrectCount: number;
  definition?: string;
}

const quizTypes = ["flashcard", "multiple", "fill", "typing", "listening"];

interface Props {
  mode?: "repeat" | "today";
}

export default function QuizPage({ mode = "today" }: Props) {
  const router = useRouter();
  const [words, setWords] = useState<Word[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [quizTypeIndex, setQuizTypeIndex] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const endpoint = mode === "repeat" ? "/api/review/repeat" : "/api/review";

    fetch(endpoint)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setWords(data);
          setCurrentIndex(0);
          setQuizTypeIndex(0);
        } else {
          setWords([]);
        }
      })
      .catch(() => setError("Failed to load words. Please try again."));
  }, [mode]);

  const handleNext = (score: number) => {
    const word = words[currentIndex];

    if (word) {
      setScores((prev) => ({
        ...prev,
        [word._id]: (prev[word._id] || 0) + score,
      }));
    }

    if (currentIndex + 1 >= words.length) {
      setShowScore(true);

      const results = Object.entries({
        ...scores,
        ...(word ? { [word._id]: (scores[word._id] || 0) + score } : {}),
      }).map(([id, score]) => ({
        _id: id,
        score,
      }));

      try {
        fetch("/api/review/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ results }),
        }).catch(() => {
          setError("Failed to submit scores. Please check your connection.");
        });
      } catch {
        setError("An unexpected error occurred.");
      }
      return;
    }

    setCurrentIndex((prev) => prev + 1);
    setQuizTypeIndex((prev) => (prev + 1) % quizTypes.length);
  };

  const generateChoices = () => {
    const shuffled = [...words]
      .filter((w) => w._id !== word._id)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)
      .map((w) => w.word);
    return [...shuffled, word.word].sort(() => 0.5 - Math.random());
  };

  if (error) {
    return <p className="text-center mt-10 text-red-500">{error}</p>;
  }

  if (words.length === 0) {
    return <p className="text-center mt-10">Loading words...</p>;
  }

  if (showScore) {
    const detailedResults = words
      .filter((w) => scores[w._id] !== undefined)
      .map((w) => ({
        word: w.word,
        translation: w.translation,
        score: scores[w._id],
      }));

    return (
      <div className="text-center mt-10">
        <h2 className="text-xl font-semibold mb-2">Finished Training!</h2>
        <p>Total Words Trained: {detailedResults.length}</p>

        <div className="mt-4 text-left inline-block">
          {detailedResults.map((item, idx) => (
            <p key={idx} className="text-sm mb-1">
              {item.score >= 3 ? "✅" : item.score === 0 ? "❌" : "⚠️"}{" "}
              <strong>{item.word}</strong> ({item.translation}): +{item.score}
            </p>
          ))}
        </div>

        <p className="mt-4">Good job! 🎉</p>

        <button
          onClick={() => router.push("/")}
          className="mt-6 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow transition"
        >
          Go Back to Home
        </button>
      </div>
    );
  }

  const word = words[currentIndex];
  const type = quizTypes[quizTypeIndex];

  return (
    <div className="p-4">
      <p className="text-sm text-gray-500 text-right mb-2">
        {currentIndex + 1} / {words.length} · Mode:{" "}
        <span className="capitalize">{mode}</span> · Quiz:{" "}
        <span className="capitalize">{type}</span>
      </p>

      {type === "flashcard" && (
        <Flashcard
          wordId={word._id}
          word={word.word}
          translation={word.translation}
          partOfSpeech={word.partOfSpeech}
          definition={word.definition}
          examples={word.examples}
          onNext={handleNext}
        />
      )}

      {type === "multiple" && (
        <MultipleChoice
          wordId={word._id}
          word={word.word}
          translation={word.translation}
          question={word.translation}
          choices={generateChoices()}
          correctAnswer={word.word}
          partOfSpeech={word.partOfSpeech}
          definition={word.definition}
          examples={word.examples}
          onNext={handleNext}
        />
      )}

      {type === "fill" && (
        <FillInBlank
          wordId={word._id}
          correctWord={word.word}
          translation={word.translation}
          sentenceTemplate={
            word.examples[0]?.replace(word.word, "___") || "___"
          }
          partOfSpeech={word.partOfSpeech}
          definition={word.definition}
          examples={word.examples}
          onNext={handleNext}
        />
      )}

      {type === "typing" && (
        <Typing
          wordId={word._id}
          correctWord={word.word}
          translation={word.translation}
          partOfSpeech={word.partOfSpeech}
          definition={word.definition}
          examples={word.examples}
          onNext={handleNext}
        />
      )}

      {type === "listening" && (
        <Listening
          wordId={word._id}
          word={word.word}
          translation={word.translation}
          choices={generateChoices()}
          partOfSpeech={word.partOfSpeech}
          definition={word.definition}
          examples={word.examples}
          onNext={handleNext}
        />
      )}
    </div>
  );
}
