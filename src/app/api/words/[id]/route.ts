import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Word from "@/models/word";

export async function PUT(req: NextRequest) {
  try {
    await connectDB();

    const url = new URL(req.url);
    const id = url.pathname.split("/").pop(); // ดึง ID จาก path

    const body = await req.json();
    await Word.findByIdAndUpdate(id, body, { new: true });

    return NextResponse.json({ message: "✅ Word updated" });
  } catch (err) {
    console.error("❌ Error updating word:", err);
    return NextResponse.json({ error: "Failed to update word" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectDB();

    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();

    await Word.findByIdAndDelete(id);
    return NextResponse.json({ message: "🗑️ Word deleted" });
  } catch (err) {
    console.error("❌ Error deleting word:", err);
    return NextResponse.json({ error: "Failed to delete word" }, { status: 500 });
  }
}
