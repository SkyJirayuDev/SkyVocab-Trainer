import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Word from "@/models/word";

export async function GET() {
  try {
    await connectDB();

    const words = await Word.find({});

    const result = words.map((word) => ({
      word: word.word,
      translation: word.translation,
      partOfSpeech: word.partOfSpeech || "",
      level: word.level,
      score: word.score || 0,
      lastReviewedDate: word.lastReviewedDate?.toISOString() || null,
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error("[STATS_PROGRESS_ERROR]", error);
    return NextResponse.json(
      { message: "Failed to fetch word progress data" },
      { status: 500 }
    );
  }
}
