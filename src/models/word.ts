import mongoose, { Schema, Document } from "mongoose";

export interface IWord extends Document {
  word: string;
  translation: string;
  examples: string[];
  partOfSpeech: string;
  category: string;
  level: number;
  nextReviewDate: Date;
  lastReviewedDate: Date;
  incorrectCount: number;
  definition?: string;
  score: number;
  customCategory?: string;
}

const wordSchema = new Schema<IWord>(
  {
    word: {
      type: String,
      required: true,
      trim: true,
    },
    translation: {
      type: String,
      required: true,
    },
    examples: {
      type: [String],
      required: true,
      validate: {
        validator: (arr: string[]) => arr.length === 2,
        message: "Exactly 2 example sentences are required.",
      },
    },
    partOfSpeech: {
      type: String,
      required: true,
      enum: [
        "noun",
        "verb",
        "adjective",
        "adverb",
        "preposition",
        "conjunction",
        "interjection",
        "pronoun",
        "determiner",
      ],
    },
    category: {
      type: String,
      required: true,
    },
    customCategory: {
      type: String,
      required: false,
    },
    level: {
      type: Number,
      required: true,
      default: 1,
      min: 1,
      max: 5,
    },
    score: {
      type: Number,
      required: true,
      default: 0,
    },
    nextReviewDate: {
      type: Date,
      required: true,
    },
    lastReviewedDate: {
      type: Date,
      required: true,
    },
    incorrectCount: {
      type: Number,
      required: true,
      default: 0,
    },
    definition: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Word ||
  mongoose.model<IWord>("Word", wordSchema);
