import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'
import connectDB from '../src/lib/db'
import Word from '../src/models/word'

dotenv.config({ path: '.env.local' }) 

console.log('🔍 MONGODB_URI =', process.env.MONGODB_URI)

async function importWords() {
  try {
    await connectDB()
    console.log('✅ Connected to MongoDB')

    const filePath = path.join(__dirname, 'personality_adjectives_30_unique.json')
    const fileContent = fs.readFileSync(filePath, 'utf-8')
    const words = JSON.parse(fileContent)

    let count = 0

    for (const word of words) {
      const exists = await Word.findOne({ word: word.word })

      if (!exists) {
        await Word.create({
          ...word,
          nextReviewDate: new Date(word.nextReviewDate),
          lastReviewedDate: word.lastReviewedDate ? new Date(word.lastReviewedDate) : new Date(),
        })
        count++
      }
    }

    console.log(`✅ Imported ${count} new words`)
    process.exit(0)
  } catch (error) {
    console.error('❌ Failed to import words:', error)
    process.exit(1)
  }
}

importWords()
