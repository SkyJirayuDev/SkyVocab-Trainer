import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Word from "@/models/word";

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { wordId, scoreToAdd } = body;

    if (!wordId || typeof scoreToAdd !== "number") {
      return NextResponse.json({ message: "Invalid input" }, { status: 400 });
    }

    const word = await Word.findById(wordId);
    if (!word) {
      return NextResponse.json({ message: "Word not found" }, { status: 404 });
    }

    word.score = (word.score || 0) + scoreToAdd;
    word.lastReviewedDate = new Date();

    const thresholds = {
      1: 5,
      2: 6,
      3: 7,
      4: 8,
    } as const;

    const currentLevel = word.level;

    if (currentLevel in thresholds) {
      const threshold = thresholds[currentLevel as keyof typeof thresholds];
      if (word.score >= threshold && currentLevel < 5) {
        word.level += 1;
        word.score = 0;
      }
    }

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    word.nextReviewDate = tomorrow;

    await word.save();

    return NextResponse.json({ message: "Score updated and level checked." });
  } catch (error) {
    console.error("Error updating score:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
