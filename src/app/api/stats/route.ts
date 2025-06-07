import connectDB from '@/lib/db'
import Word from '@/models/word'
import { NextResponse } from 'next/server'

export async function GET() {
  await connectDB()

  const levels = [1, 2, 3, 4, 5]
  const result = await Promise.all(
    levels.map(async (level) => {
      const count = await Word.countDocuments({ level })
      return { level: String(level), count }
    })
  )

  return NextResponse.json(result)
}