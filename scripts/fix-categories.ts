import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" }); // โหลดไฟล์ .env.local

// ✅ รายการ category ที่อนุญาตให้เก็บในระบบ
const allowedCategories = new Set([
  "personality",
  "emotion",
  "attitude",
  "work",
  "communication",
  "daily life",
  "learning",
  "behavior",
  "thinking",
  "appearance",
  "others"
]);

// ✅ mapping สำหรับคำที่สะกดผิด
const corrections: Record<string, string> = {
  attidute: "attitude",
  attitudes: "attitude",
  emotions: "emotion",
  emotional: "emotion",
  worklife: "work",
  comunication: "communication",
  communications: "communication",
  personalitys: "personality"
};

const normalizeCategory = (raw: string): string => {
  const val = raw.trim().toLowerCase();
  return corrections[val] || val;
};

const splitAndClean = (value: string): string[] => {
  return value
    .split(/[,/;|]/) // แยกคำด้วย , / ; |
    .map((v) => v.trim().toLowerCase())
    .filter((v) => v.length > 0);
};

const isValidCustom = (text: string) => /^[a-zA-Z]+$/.test(text);

const findFirstAllowedCategory = (raw: string): { category: string; custom?: string } => {
  const parts = splitAndClean(raw);
  const corrected = parts.map(normalizeCategory);

  for (const c of corrected) {
    if (allowedCategories.has(c)) return { category: c };
  }

  // ✅ ถ้าไม่มีตรงเลย ➜ เลือกคำแรกที่ valid
  const firstValidCustom = parts.find((p) => isValidCustom(p));
  return {
    category: "others",
    custom: firstValidCustom || "unspecified"
  };
};

const run = async () => {
  try {
    const MONGODB_URI = process.env.MONGODB_URI;
    if (!MONGODB_URI) {
      throw new Error("❌ MONGODB_URI not found in .env.local");
    }

    await mongoose.connect(MONGODB_URI);
    const db = mongoose.connection;
    const Word = db.collection("words");

    const all = await Word.find({}).toArray();
    let updatedCount = 0;

    for (const doc of all) {
      const original = doc.category || "";
      const { category, custom } = findFirstAllowedCategory(original);

      const updateData: any = { category };
      if (custom) updateData.customCategory = custom;

      if (doc.category !== category || custom) {
        await Word.updateOne({ _id: doc._id }, { $set: updateData });
        updatedCount++;
      }
    }

    console.log(`✅ Done. Updated ${updatedCount} documents.`);
    await mongoose.disconnect();
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
};

run();
