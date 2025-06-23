"use client";

import { useEffect, useState } from "react";
import { Trash, Save, Search } from "lucide-react";

interface Word {
  _id: string;
  word: string;
  translation: string;
  definition?: string;
  examples: string[];
  partOfSpeech: string;
  category: string;
  customCategory?: string;
  createdAt: string;
}

const partOfSpeechOptions = [
  "noun",
  "verb",
  "adjective",
  "adverb",
  "preposition",
  "conjunction",
  "interjection",
  "pronoun",
  "determiner",
];

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

export default function ManageWordsPage() {
  const [words, setWords] = useState<Word[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/words/list")
      .then((res) => res.json())
      .then((data) => setWords(data));
  }, []);

  type WordValue = string | number | boolean | undefined;
  const handleChange = (id: string, field: keyof Word, value: WordValue) => {
    setWords((prev) =>
      prev.map((w) => (w._id === id ? { ...w, [field]: value } : w))
    );
  };

  const handleExampleChange = (id: string, index: number, value: string) => {
    setWords((prev) =>
      prev.map((w) =>
        w._id === id
          ? {
              ...w,
              examples: w.examples.map((ex, i) => (i === index ? value : ex)),
            }
          : w
      )
    );
  };

  const handleSave = async (w: Word) => {
    const cleaned = {
      ...w,
      definition: capitalizeAndDot(w.definition || ""),
      examples: w.examples.map(capitalizeAndDot),
    };
    await fetch(`/api/words/${w._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cleaned),
    });
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/words/${id}`, { method: "DELETE" });
    setWords((prev) => prev.filter((w) => w._id !== id));
  };

  const capitalizeAndDot = (text: string) => {
    const trimmed = text.trim();
    const capital = trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
    return capital.endsWith(".") ? capital : capital + ".";
  };

  const filtered = words.filter(
    (w) =>
      w.word.toLowerCase().includes(search.toLowerCase()) ||
      w.translation.includes(search)
  );

  return (
    <div className="p-6 text-white bg-gray-900 min-h-screen">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">🛠️ Manage Words</h1>
        <div className="flex items-center gap-2">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by word or translation"
            className="bg-gray-800 border border-gray-600 p-2 rounded text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-800">
            <tr>
              <th className="p-2">Word</th>
              <th className="p-2">Translation</th>
              <th className="p-2">Definition</th>
              <th className="p-2">Example 1</th>
              <th className="p-2">Example 2</th>
              <th className="p-2">POS</th>
              <th className="p-2">Category</th>
              <th className="p-2">Custom</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((w) => (
              <tr key={w._id} className="border-t border-gray-700">
                <td className="p-2">
                  <input
                    className="bg-gray-800 p-1 rounded w-full"
                    value={w.word}
                    onChange={(e) =>
                      handleChange(w._id, "word", e.target.value)
                    }
                  />
                </td>
                <td className="p-2">
                  <input
                    className="bg-gray-800 p-1 rounded w-full"
                    value={w.translation}
                    onChange={(e) =>
                      handleChange(w._id, "translation", e.target.value)
                    }
                  />
                </td>
                <td className="p-2">
                  <input
                    className="bg-gray-800 p-1 rounded w-full"
                    value={w.definition || ""}
                    onChange={(e) =>
                      handleChange(w._id, "definition", e.target.value)
                    }
                  />
                </td>
                <td className="p-2">
                  <input
                    className="bg-gray-800 p-1 rounded w-full"
                    value={w.examples[0] || ""}
                    onChange={(e) =>
                      handleExampleChange(w._id, 0, e.target.value)
                    }
                  />
                </td>
                <td className="p-2">
                  <input
                    className="bg-gray-800 p-1 rounded w-full"
                    value={w.examples[1] || ""}
                    onChange={(e) =>
                      handleExampleChange(w._id, 1, e.target.value)
                    }
                  />
                </td>
                <td className="p-2">
                  <select
                    className="bg-gray-800 p-1 rounded w-full"
                    value={w.partOfSpeech}
                    onChange={(e) =>
                      handleChange(w._id, "partOfSpeech", e.target.value)
                    }
                  >
                    {partOfSpeechOptions.map((opt) => (
                      <option key={opt}>{opt}</option>
                    ))}
                  </select>
                </td>
                <td className="p-2">
                  <select
                    className="bg-gray-800 p-1 rounded w-full"
                    value={w.category}
                    onChange={(e) =>
                      handleChange(w._id, "category", e.target.value)
                    }
                  >
                    {categoryOptions.map((opt) => (
                      <option key={opt}>{opt}</option>
                    ))}
                  </select>
                </td>
                <td className="p-2">
                  <input
                    className="bg-gray-800 p-1 rounded w-full"
                    value={w.customCategory || ""}
                    onChange={(e) =>
                      handleChange(w._id, "customCategory", e.target.value)
                    }
                  />
                </td>
                <td className="p-2 flex gap-2">
                  <button
                    onClick={() => handleSave(w)}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-2 py-1 rounded"
                  >
                    <Save className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(w._id)}
                    className="bg-red-600 hover:bg-red-500 text-white px-2 py-1 rounded"
                  >
                    <Trash className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
