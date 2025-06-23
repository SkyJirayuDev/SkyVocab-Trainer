import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Word from "@/models/word";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const id = params.id;
    const body = await req.json();

    await Word.findByIdAndUpdate(id, body, { new: true });
    return NextResponse.json({ message: "✅ Word updated" });
  } catch (err) {
    console.error("❌ Error updating word:", err);
    return NextResponse.json({ error: "Failed to update word" }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const id = params.id;
    await Word.findByIdAndDelete(id);
    return NextResponse.json({ message: "🗑️ Word deleted" });
  } catch (err) {
    console.error("❌ Error deleting word:", err);
    return NextResponse.json({ error: "Failed to delete word" }, { status: 500 });
  }
}
