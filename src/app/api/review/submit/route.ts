import { NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import Word from '@/models/word'

export async function POST(req: Request) {
  try {
    await connectDB()
    const body = await req.json()
    const updates = body.results as { _id: string; score: number }[]

    const today = new Date()

    const updatePromises = updates.map(async ({ _id, score }) => {
      const word = await Word.findById(_id)
      if (!word) return

      const currentLevel = word.level || 1
      const currentScore = word.score || 0
      const incorrectCount = word.incorrectCount || 0

      // Accumulate score for this word
      const newScore = currentScore + score
      let newLevel = currentLevel
      let resetScore = false
      let newIncorrectCount = incorrectCount

      // Increase level if score threshold is reached
      if (newScore >= 6 && currentLevel < 5) {
        newLevel += 1
        resetScore = true
        newIncorrectCount = 0
      }
      // Decrease level if score is too low and user struggles repeatedly
      else if (newScore <= 1 && incorrectCount >= 2 && currentLevel > 1) {
        newLevel -= 1
        resetScore = true
        newIncorrectCount = 0
      }

      // Spaced Interval Mapping: Set review delay based on level
      const intervalMap: Record<number, number> = {
        1: 1,   // 1 day
        2: 3,   // 3 days
        3: 7,   // 7 days
        4: 14,  // 14 days
        5: 30,  // 30 days
      }
      const nextReviewDate = new Date()
      nextReviewDate.setDate(today.getDate() + intervalMap[newLevel])

      // Increment incorrectCount if the score is too low this round
      if (score < 3) {
        newIncorrectCount += 1
      }

      // Update the word record in the database
      await Word.findByIdAndUpdate(_id, {
        level: newLevel,
        score: resetScore ? 0 : newScore,
        incorrectCount: newIncorrectCount,
        lastReviewedDate: today,
        nextReviewDate,
      })
    })

    await Promise.all(updatePromises)

    return NextResponse.json({ message: 'Review results saved' })
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { message: 'Failed to submit results' },
      { status: 500 }
    )
  }
}
