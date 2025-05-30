import { NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import Word from '@/models/word'

export async function GET() {
  try {
    await connectDB()

    const allWords = await Word.find({})

    const levelGroups = {
      low: allWords.filter(w => w.level === 1 || w.level === 2),
      mid: allWords.filter(w => w.level === 3),
      high: allWords.filter(w => w.level === 4 || w.level === 5),
    }

    function pick(group: any[], count: number) {
      const shuffled = group.sort(() => 0.5 - Math.random())
      return shuffled.slice(0, count)
    }

    const low = pick(levelGroups.low, 6)
    const mid = pick(levelGroups.mid, 2)
    const high = pick(levelGroups.high, 2)

    let combined = [...low, ...mid, ...high]

    if (combined.length < 10) {
      const remaining = allWords.filter(w => !combined.includes(w))
      combined = [...combined, ...pick(remaining, 10 - combined.length)]
    }

    combined = combined.sort(() => 0.5 - Math.random())

    return NextResponse.json(combined)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ message: 'Failed to fetch repeat words' }, { status: 500 })
  }
}
