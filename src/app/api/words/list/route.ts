import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Word from "@/models/word";

export async function GET() {
  try {
    await connectDB();
    const words = await Word.find().sort({ createdAt: -1 });
    return NextResponse.json(words);
  } catch (err) {
    console.error("❌ Error fetching word list:", err);
    return NextResponse.json({ error: "Failed to fetch words" }, { status: 500 });
  }
}