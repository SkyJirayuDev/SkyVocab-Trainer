import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const isValidCustom = (text: string) => /^[a-zA-Z]+$/.test(text);

const splitAndClean = (value: string): string[] => {
  return value
    .split(/[,/;|]/)
    .map((v) => v.trim().toLowerCase())
    .filter((v) => v.length > 0);
};

const run = async () => {
  try {
    const MONGODB_URI = process.env.MONGODB_URI;
    if (!MONGODB_URI) throw new Error("❌ Missing MONGODB_URI");

    await mongoose.connect(MONGODB_URI);
    const db = mongoose.connection;
    const Word = db.collection("words");

    const affected = await Word.find({
      category: "others",
      customCategory: { $regex: /[,/;|]/ } // มี , หรือ / หรือ ; หรือ |
    }).toArray();

    let updated = 0;

    for (const doc of affected) {
      const original = doc.customCategory || "";
      const parts = splitAndClean(original);
      const firstValid = parts.find((p) => isValidCustom(p));

      if (firstValid) {
        await Word.updateOne(
          { _id: doc._id },
          { $set: { customCategory: firstValid } }
        );
        updated++;
      }
    }

    console.log(`✅ Fixed ${updated} customCategory fields.`);
    await mongoose.disconnect();
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
};

run();
