import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Word from "@/models/word";

interface WordInput {
  english: string;
  thai: string;
  definition: string;
  example1?: string;
  example2?: string;
  partOfSpeech: string;
  category: string;
  customCategory?: string;
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const words: WordInput[] = await req.json();

    const existingWords = await Word.find({
      word: { $in: words.map((w) => w.english.toLowerCase()) },
    });

    const existingSet = new Set(
      existingWords.map((w: { word: string }) => w.word.toLowerCase())
    );

    const toInsert = words.filter((w) => !existingSet.has(w.english.toLowerCase()));
    const insertedWords = toInsert.map((w) => w.english);

    const now = new Date();
    const preparedDocs = toInsert.map((w) => ({
      word: w.english,
      translation: w.thai,
      definition: w.definition,
      examples: [w.example1, w.example2],
      partOfSpeech: w.partOfSpeech,
      category: w.category,
      customCategory: w.customCategory || undefined,
      level: 1,
      score: 0,
      nextReviewDate: now,
      lastReviewedDate: now,
      incorrectCount: 0,
    }));

    if (preparedDocs.length > 0) {
      await Word.insertMany(preparedDocs);
    }

    return NextResponse.json({
      added: preparedDocs.length,
      addedWords: insertedWords,
      skipped: [...existingSet],
    });
  } catch (err) {
    console.error("❌ Bulk insert error:", err);
    return NextResponse.json({ error: "Bulk insert failed" }, { status: 500 });
  }
}
