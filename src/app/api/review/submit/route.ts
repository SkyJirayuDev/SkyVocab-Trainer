import { NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import Word from '@/models/word'

export async function POST(req: Request) {
  try {
    await connectDB()
    const body = await req.json()
    const updates = body.results as {
      _id: string
      score: number 
    }[]

    const today = new Date()

    const updatePromises = updates.map(async ({ _id, score }) => {
      const word = await Word.findById(_id)
      if (!word) return

      const currentLevel = word.level || 1
      let newLevel = currentLevel
      if (score >= 3) newLevel = Math.min(5, currentLevel + 1)
      else if (score <= 1) newLevel = Math.max(1, currentLevel - 1)

      const nextReviewDate = new Date()
      nextReviewDate.setDate(today.getDate() + newLevel)

      await Word.findByIdAndUpdate(_id, {
        level: newLevel,
        lastReviewedDate: today,
        nextReviewDate,
        incorrectCount: score < 3 ? (word.incorrectCount || 0) + 1 : word.incorrectCount || 0,
      })
    })

    await Promise.all(updatePromises)

    return NextResponse.json({ message: 'Review results saved' })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ message: 'Failed to submit results' }, { status: 500 })
  }
}