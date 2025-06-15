"use client";

import { useState } from "react";
import { addWord, checkWordExists } from "./action";
import WordAddedPopup from "@/components/feedback/WordAddedPopup";
import DuplicateWordPopup from "@/components/feedback/DuplicateWordPopup";

export default function AddWordPage() {
  const [english, setEnglish] = useState("");
  const [thai, setThai] = useState("");
  const [definition, setDefinition] = useState("");
  const [example1, setExample1] = useState("");
  const [example2, setExample2] = useState("");
  const [partOfSpeech, setPartOfSpeech] = useState("noun");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);

  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showDuplicatePopup, setShowDuplicatePopup] = useState(false);

  const [errors, setErrors] = useState({
    english: "",
    thai: "",
    definition: "",
    category: "",
    example1: "",
    example2: "",
  });

  const isEnglish = (text: string) => /^[A-Za-z0-9\s.,'"!?;:()\-]+$/.test(text);
  const isThai = (text: string) => /^[\u0E00-\u0E7F\s]+$/.test(text);
  const capitalizeFirst = (text: string) =>
    text.trim().charAt(0).toUpperCase() + text.trim().slice(1);

  const validateField = (field: string, value: string) => {
    let message = "";
    if (
      field === "english" ||
      field === "definition" ||
      field === "category" ||
      field === "example1" ||
      field === "example2"
    ) {
      if (value && !isEnglish(value))
        message = "Only English characters are allowed.";
    }
    if (field === "thai" && value && !isThai(value)) {
      message = "Only Thai characters are allowed.";
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
    setErrors({
      english: "",
      thai: "",
      definition: "",
      category: "",
      example1: "",
      example2: "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { exists } = await checkWordExists(english.trim().toLowerCase());
    if (exists) {
      setShowDuplicatePopup(true);
      setLoading(false);
      return;
    }

    // Validate all again before final submission
    validateField("english", english);
    validateField("thai", thai);
    validateField("definition", definition);
    validateField("category", category);
    validateField("example1", example1);
    validateField("example2", example2);

    const hasErrors =
      Object.values(errors).some((msg) => msg !== "") ||
      !english.trim() ||
      !thai.trim() ||
      !category.trim();
    if (hasErrors) {
      setLoading(false);
      return;
    }

    await addWord({
      english: english.trim().toLowerCase(),
      thai: thai.trim(),
      definition: capitalizeFirst(definition.trim()),
      example1: capitalizeFirst(example1.trim()),
      example2: capitalizeFirst(example2.trim()),
      partOfSpeech,
      category: category.trim().toLowerCase(),
    });

    setShowSuccessPopup(true);
    resetForm();
    setLoading(false);
  };

  const hasErrors =
    Object.values(errors).some((msg) => msg !== "") ||
    !english.trim() ||
    !thai.trim() ||
    !category.trim();

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
              className="w-full rounded-lg border border-gray-600 bg-gray-800/50 p-3 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 disabled:opacity-50"
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
              className="w-full rounded-lg border border-gray-600 bg-gray-800/50 p-3 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 disabled:opacity-50"
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
              placeholder="e.g. Showing courage in the face of danger"
              className="w-full rounded-lg border border-gray-600 bg-gray-800/50 p-3 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 disabled:opacity-50"
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
              className="w-full rounded-lg border border-gray-600 bg-gray-800/50 p-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300 disabled:opacity-50"
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
            <input
              type="text"
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                validateField("category", e.target.value);
              }}
              required
              disabled={loading}
              placeholder="e.g. emotion, travel, business"
              className="w-full rounded-lg border border-gray-600 bg-gray-800/50 p-3 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300 disabled:opacity-50"
            />
            {errors.category && (
              <p className="text-sm text-red-400 mt-1">{errors.category}</p>
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
              className="w-full rounded-lg border border-gray-600 bg-gray-800/50 p-3 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300 disabled:opacity-50"
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
              className="w-full rounded-lg border border-gray-600 bg-gray-800/50 p-3 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 disabled:opacity-50"
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
              className={`flex-1 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 text-white rounded-lg py-3 font-semibold transform transition-all duration-300 shadow-lg 
                hover:scale-[1.02] hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900
                ${
                  loading || hasErrors
                    ? "opacity-60 cursor-not-allowed"
                    : "hover:from-blue-700 hover:via-purple-700 hover:to-blue-800"
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
