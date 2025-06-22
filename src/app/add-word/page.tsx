"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addWord, checkWordExists } from "./action";
import WordAddedPopup from "@/components/feedback/WordAddedPopup";
import DuplicateWordPopup from "@/components/feedback/DuplicateWordPopup";

const categoryOptions = [
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
  "others",
];

export default function AddWordPage() {
  const [english, setEnglish] = useState("");
  const [thai, setThai] = useState("");
  const [definition, setDefinition] = useState("");
  const [example1, setExample1] = useState("");
  const [example2, setExample2] = useState("");
  const [partOfSpeech, setPartOfSpeech] = useState("noun");
  const [category, setCategory] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const [loading, setLoading] = useState(false);

  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showDuplicatePopup, setShowDuplicatePopup] = useState(false);
  const router = useRouter();
  const [errors, setErrors] = useState({
    english: "",
    thai: "",
    definition: "",
    category: "",
    customCategory: "",
    example1: "",
    example2: "",
  });

  const isEnglish = (text: string) => /^[A-Za-z0-9\s.,'"!?;:()\-]+$/.test(text);
  const isThai = (text: string) => /^[\u0E00-\u0E7F\s,]+$/.test(text);
  const isValidCustomCategory = (text: string) =>
    /^[a-zA-Z]+$/.test(text.trim());

  const capitalizeFirstAndDot = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return "";
    const capitalized = trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
    return capitalized.endsWith(".") ? capitalized : capitalized + ".";
  };

  const validateField = (field: string, value: string) => {
    let message = "";
    if (
      ["english", "definition", "category", "example1", "example2"].includes(
        field
      )
    ) {
      if (value && !isEnglish(value))
        message = "Only English characters are allowed.";
    }
    if (field === "thai" && value && !isThai(value)) {
      message = "Only Thai characters are allowed.";
    }
    if (field === "customCategory" && category === "others") {
      if (!isValidCustomCategory(value)) {
        message = "Only one English word allowed.";
      }
    }
    setErrors((prev) => ({ ...prev, [field]: message }));
  };

  const resetForm = () => {
    setEnglish("");
    setThai("");
    setDefinition("");
    setExample1("");
    setExample2("");
    setPartOfSpeech("noun");
    setCategory("");
    setCustomCategory("");
    setErrors({
      english: "",
      thai: "",
      definition: "",
      category: "",
      customCategory: "",
      example1: "",
      example2: "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const cleanedEnglish = english.trim().toLowerCase();
    const wordExists = await checkWordExists(cleanedEnglish);
    if (wordExists.exists) {
      setShowDuplicatePopup(true);
      setLoading(false);
      return;
    }

    // validate
    validateField("english", english);
    validateField("thai", thai);
    validateField("definition", definition);
    validateField("category", category);
    validateField("customCategory", customCategory);
    validateField("example1", example1);
    validateField("example2", example2);

    const hasErrors =
      Object.values(errors).some((msg) => msg !== "") ||
      !english.trim() ||
      !thai.trim() ||
      !category;

    if (hasErrors) {
      setLoading(false);
      return;
    }

    const wordData = {
      english: cleanedEnglish,
      thai: thai.trim(),
      definition: capitalizeFirstAndDot(definition),
      example1: capitalizeFirstAndDot(example1),
      example2: example2 ? capitalizeFirstAndDot(example2) : "",
      partOfSpeech,
      category: category === "others" ? "others" : category,
      ...(category === "others" && customCategory
        ? { customCategory: customCategory.trim().toLowerCase() }
        : {}),
    };

    await addWord(wordData);
    setShowSuccessPopup(true);
    resetForm();
    setLoading(false);
  };

  const hasErrors =
    Object.values(errors).some((msg) => msg !== "") ||
    !english.trim() ||
    !thai.trim() ||
    !category;

  return (
    <div className="min-h-screen px-4 py-6 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-md mx-auto bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white shadow-2xl rounded-2xl p-6 border border-gray-700">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-white mb-2">
            📚 Add New Word
          </h1>
          <p className="text-gray-400 text-sm">
            Expand your vocabulary collection
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-300">
              🇺🇸 English Word
            </label>
            <input
              type="text"
              value={english}
              onChange={(e) => {
                setEnglish(e.target.value);
                validateField("english", e.target.value);
              }}
              required
              disabled={loading}
              className="w-full rounded-lg border border-gray-600 bg-gray-800/50 p-3 text-sm text-white"
              placeholder="Enter English word..."
            />
            {errors.english && (
              <p className="text-sm text-red-400 mt-1">{errors.english}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-300">
              🇹🇭 Thai Translation
            </label>
            <input
              type="text"
              value={thai}
              onChange={(e) => {
                setThai(e.target.value);
                validateField("thai", e.target.value);
              }}
              required
              disabled={loading}
              className="w-full rounded-lg border border-gray-600 bg-gray-800/50 p-3 text-sm text-white"
              placeholder="ใส่คำแปลภาษาไทย..."
            />
            {errors.thai && (
              <p className="text-sm text-red-400 mt-1">{errors.thai}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-300">
              📖 Definition (English)
            </label>
            <input
              type="text"
              value={definition}
              onChange={(e) => {
                setDefinition(e.target.value);
                validateField("definition", e.target.value);
              }}
              disabled={loading}
              placeholder="e.g. Showing courage in the face of danger."
              className="w-full rounded-lg border border-gray-600 bg-gray-800/50 p-3 text-sm text-white"
            />
            {errors.definition && (
              <p className="text-sm text-red-400 mt-1">{errors.definition}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-300">
              📝 Part of Speech
            </label>
            <select
              value={partOfSpeech}
              onChange={(e) => setPartOfSpeech(e.target.value)}
              disabled={loading}
              className="w-full rounded-lg border border-gray-600 bg-gray-800/50 p-3 text-sm text-white"
            >
              <option value="noun">Noun (คำนาม)</option>
              <option value="verb">Verb (คำกริยา)</option>
              <option value="adjective">Adjective (คำคุณศัพท์)</option>
              <option value="adverb">Adverb (คำกริยาวิเศษณ์)</option>
              <option value="preposition">Preposition (คำบุพบท)</option>
              <option value="conjunction">Conjunction (คำสันธาน)</option>
              <option value="interjection">Interjection (คำอุทาน)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-300">
              🏷️ Category
            </label>
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setErrors((prev) => ({ ...prev, category: "" }));
              }}
              required
              disabled={loading}
              className="w-full p-3 rounded-lg bg-gray-800 border border-gray-600 text-white"
            >
              <option value="">Select category...</option>
              {categoryOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt.charAt(0).toUpperCase() + opt.slice(1)}
                </option>
              ))}
            </select>
            {category === "others" && (
              <input
                type="text"
                placeholder="Enter custom category (one English word)"
                value={customCategory}
                onChange={(e) => {
                  setCustomCategory(e.target.value);
                  validateField("customCategory", e.target.value);
                }}
                className="w-full mt-2 p-3 rounded-lg bg-gray-800 border border-gray-600 text-white"
              />
            )}
            {(errors.category || errors.customCategory) && (
              <p className="text-sm text-red-400 mt-1">
                {errors.category || errors.customCategory}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-300">
              💬 Example Sentence 1
            </label>
            <input
              type="text"
              value={example1}
              onChange={(e) => {
                setExample1(e.target.value);
                validateField("example1", e.target.value);
              }}
              disabled={loading}
              className="w-full rounded-lg border border-gray-600 bg-gray-800/50 p-3 text-sm text-white"
              placeholder="First example sentence..."
            />
            {errors.example1 && (
              <p className="text-sm text-red-400 mt-1">{errors.example1}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-300">
              💭 Example Sentence 2
            </label>
            <input
              type="text"
              value={example2}
              onChange={(e) => {
                setExample2(e.target.value);
                validateField("example2", e.target.value);
              }}
              disabled={loading}
              className="w-full rounded-lg border border-gray-600 bg-gray-800/50 p-3 text-sm text-white"
              placeholder="Second example sentence..."
            />
            {errors.example2 && (
              <p className="text-sm text-red-400 mt-1">{errors.example2}</p>
            )}
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading || hasErrors}
              className={`flex-1 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 text-white rounded-lg py-3 font-semibold transition-all duration-300 shadow-lg ${
                loading || hasErrors
                  ? "opacity-60 cursor-not-allowed"
                  : "hover:scale-[1.02] hover:shadow-xl hover:from-blue-700 hover:via-purple-700 hover:to-blue-800"
              }`}
            >
              {loading ? "🔄 Adding word..." : "✨ Add Word to Collection"}
            </button>

            <button
              type="button"
              onClick={resetForm}
              disabled={loading}
              className="flex-1 bg-gray-700 text-white rounded-lg py-3 font-semibold hover:bg-gray-600 transition-all duration-300 shadow-md disabled:opacity-40"
            >
              ♻️ Reset
            </button>
          </div>
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => router.push("/add-word/upload")}
              className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg font-semibold shadow-md transition-all"
            >
              📤 Upload CSV Instead
            </button>
          </div>
        </form>
      </div>

      {showSuccessPopup && (
        <WordAddedPopup
          word={english}
          translation={thai}
          onClose={() => setShowSuccessPopup(false)}
        />
      )}

      {showDuplicatePopup && (
        <DuplicateWordPopup
          word={english}
          onClose={() => setShowDuplicatePopup(false)}
        />
      )}
    </div>
  );
}
