'use server'

import connectDB from '@/lib/db'
import Word from '@/models/word'

export async function addWord({
  english,
  thai,
  definition,
  example1,
  example2,
  partOfSpeech,
  category,
}: {
  english: string
  thai: string
  definition: string
  example1: string
  example2: string
  partOfSpeech: string
  category: string
}) {
  try {
    await connectDB()

    const now = new Date()

    await Word.create({
      word: english,
      translation: thai,
      definition,
      examples: [example1, example2],
      partOfSpeech,
      category,
      level: 1,
      nextReviewDate: now,
      lastReviewedDate: now,
      incorrectCount: 0,
    })

    return { message: 'Word added successfully' }
  } catch (error) {
    console.error('Failed to add word:', error)
    return { message: 'Failed to add word' }
  }
}
