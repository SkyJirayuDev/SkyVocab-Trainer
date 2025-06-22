"use client";

import { useState } from "react";
import Papa from "papaparse";
import { Download } from "lucide-react";

interface WordRow {
  english: string;
  thai: string;
  definition: string;
  example1: string;
  example2: string;
  partOfSpeech: string;
  category: string;
  customCategory?: string;
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

export default function UploadPage() {
  const [fileName, setFileName] = useState("");
  const [parsedRows, setParsedRows] = useState<WordRow[]>([]);
  const [results, setResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [successCount, setSuccessCount] = useState(0);
  const [skippedCount, setSkippedCount] = useState(0);

  const capitalizeAndDot = (text: string) => {
    const trimmed = text.trim();
    const capital = trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
    return capital.endsWith(".") ? capital : capital + ".";
  };

  const handleCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setParsedRows([]);
    setResults([]);
    setProgress(0);
    setCurrentIndex(0);
    setSuccessCount(0);
    setSkippedCount(0);

    Papa.parse<WordRow>(file, {
      header: true,
      skipEmptyLines: true,
      complete: ({ data }) => {
        const cleaned = data.map((row) => ({
          ...row,
          english: row.english?.trim().toLowerCase() || "",
          thai: row.thai?.trim() || "",
          definition: capitalizeAndDot(row.definition || ""),
          example1: capitalizeAndDot(row.example1 || ""),
          example2: row.example2 ? capitalizeAndDot(row.example2) : "",
          partOfSpeech: row.partOfSpeech?.trim().toLowerCase(),
          category: row.category?.trim().toLowerCase(),
          customCategory: row.customCategory?.trim().toLowerCase() || "",
        }));
        setParsedRows(cleaned);
      },
    });
  };

  const handleUpload = async () => {
    setLoading(true);
    const validRows = parsedRows
      .filter((row) => {
        if (
          !row.english ||
          !row.thai ||
          !row.definition ||
          !row.example1 ||
          !row.partOfSpeech ||
          !row.category
        )
          return false;
        if (
          row.category === "others" &&
          !/^[a-zA-Z]+$/.test(row.customCategory || "")
        )
          return false;
        if (!/^[A-Za-z0-9\s.,'"!?;:()\-]+$/.test(row.definition)) return false;
        if (!/^[A-Za-z0-9\s.,'"!?;:()\-]+$/.test(row.example1)) return false;
        if (row.example2 && !/^[A-Za-z0-9\s.,'"!?;:()\-]+$/.test(row.example2))
          return false;
        return true;
      })
      .map((row) => ({
        ...row,
        definition: capitalizeAndDot(row.definition),
        example1: capitalizeAndDot(row.example1),
        example2: row.example2 ? capitalizeAndDot(row.example2) : "",
      }));

    const chunkSize = 5;
    const resultMessages: string[] = [];

    for (let i = 0; i < validRows.length; i += chunkSize) {
      const chunk = validRows.slice(i, i + chunkSize);
      const res = await fetch("/api/words/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(chunk),
      });

      const json = await res.json();
      if (json.addedWords?.length) {
        json.addedWords.forEach((w: string) => {
          resultMessages.push(`✅ Added "${w}"`);
        });
      }
      setSuccessCount((prev) => prev + json.added);
      setSkippedCount((prev) => prev + (json.skipped?.length || 0));

      if (json.skipped?.length) {
        json.skipped.forEach((w: string) => {
          resultMessages.push(`⚠️ Skipped "${w}": Already exists`);
        });
      }

      setCurrentIndex(i + chunk.length);
      setProgress(Math.floor(((i + chunk.length) / validRows.length) * 100));
    }

    setResults(resultMessages);
    setLoading(false);
  };

  const handleReset = () => {
    setFileName("");
    setParsedRows([]);
    setResults([]);
    setProgress(0);
    setCurrentIndex(0);
    setSuccessCount(0);
    setSkippedCount(0);
  };

  const downloadTemplate = () => {
    const csvHeader =
      "english,thai,definition,example1,example2,partOfSpeech,category,customCategory\n";
    const example =
      "brave,กล้าหาร,Showing courage in danger.,He was brave.,She stayed calm.,adjective,attitude,\n";
    const blob = new Blob([csvHeader + example], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "skyvocab-template.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">📥 Upload CSV File</h1>
        <button
          onClick={downloadTemplate}
          className="flex gap-1 items-center bg-green-700 hover:bg-green-600 px-3 py-2 rounded text-sm font-semibold"
        >
          <Download className="w-4 h-4" />
          Download Template
        </button>
      </div>

      {!parsedRows.length && (
        <input
          type="file"
          accept=".csv"
          onChange={handleCSV}
          className="bg-gray-800 p-3 rounded border border-gray-600"
          disabled={loading}
        />
      )}

      {parsedRows.length > 0 && (
        <>
          <p className="mt-2 text-green-400">✅ File loaded: {fileName}</p>

          <div className="mt-6 overflow-x-auto max-h-80 border border-gray-600 rounded text-sm">
            <table className="min-w-full table-auto">
              <thead className="bg-gray-800 sticky top-0">
                <tr>
                  {Object.keys(parsedRows[0]).map((key) => (
                    <th
                      key={key}
                      className="px-3 py-2 border text-left font-semibold"
                    >
                      {key}
                      {key === "category" && (
                        <span
                          title="Use from list or 'others' + customCategory"
                          className="ml-1 text-yellow-400"
                        >
                          ℹ️
                        </span>
                      )}
                      {key === "example1" && (
                        <span
                          title="Start with capital and end with '.'"
                          className="ml-1 text-yellow-400"
                        >
                          ℹ️
                        </span>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {parsedRows.map((row, idx) => (
                  <tr key={idx} className="bg-gray-700 border-t">
                    {Object.entries(row).map(([key, val], i) => {
                      const isInvalid =
                        (key === "english" && !/^[a-zA-Z\s]+$/.test(val)) ||
                        (key === "thai" &&
                          !/^[\u0E00-\u0E7F\s,]+$/.test(val)) ||
                        (key === "definition" &&
                          !/^[A-Za-z0-9\s.,'"!?;:()\-]+$/.test(val)) ||
                        (key === "example1" &&
                          (!/^[A-Za-z0-9\s.,'"!?;:()\-]+$/.test(val) ||
                            val[0] !== val[0].toUpperCase() ||
                            !val.endsWith("."))) ||
                        (key === "example2" &&
                          val &&
                          (!/^[A-Za-z0-9\s.,'"!?;:()\-]+$/.test(val) ||
                            val[0] !== val[0].toUpperCase() ||
                            !val.endsWith("."))) ||
                        (key === "customCategory" &&
                          row.category === "others" &&
                          !/^[a-zA-Z]+$/.test(val));

                      if (key === "partOfSpeech") {
                        return (
                          <td key={i} className="px-3 py-1 border">
                            <select
                              value={val}
                              onChange={(e) => {
                                const updated = [...parsedRows];
                                updated[idx] = {
                                  ...updated[idx],
                                  [key]: e.target.value,
                                };
                                setParsedRows(updated);
                              }}
                              className="w-full bg-transparent text-white outline-none px-1 py-0.5 border rounded-sm text-sm border-gray-600"
                            >
                              {partOfSpeechOptions.map((opt) => (
                                <option key={opt} value={opt}>
                                  {opt}
                                </option>
                              ))}
                            </select>
                          </td>
                        );
                      }

                      if (key === "category") {
                        return (
                          <td key={i} className="px-3 py-1 border">
                            <select
                              value={val}
                              onChange={(e) => {
                                const updated = [...parsedRows];
                                updated[idx] = {
                                  ...updated[idx],
                                  [key]: e.target.value,
                                };
                                setParsedRows(updated);
                              }}
                              className="w-full bg-transparent text-white outline-none px-1 py-0.5 border rounded-sm text-sm border-gray-600"
                            >
                              {categoryOptions.map((opt) => (
                                <option key={opt} value={opt}>
                                  {opt}
                                </option>
                              ))}
                            </select>
                          </td>
                        );
                      }

                      return (
                        <td key={i} className="px-3 py-1 border">
                          <input
                            type="text"
                            value={val || ""}
                            onChange={(e) => {
                              const updated = [...parsedRows];
                              updated[idx] = {
                                ...updated[idx],
                                [key]: e.target.value,
                              };
                              setParsedRows(updated);
                            }}
                            className={`w-full bg-transparent text-white outline-none px-1 py-0.5 border rounded-sm text-sm ${
                              isInvalid
                                ? "border-red-500 bg-red-900/40"
                                : "border-gray-600"
                            }`}
                            title={isInvalid ? `⚠️ Invalid ${key}` : key}
                          />
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex gap-4 mt-6">
            <button
              onClick={handleUpload}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded font-semibold"
            >
              {loading ? "🔄 Uploading..." : "📤 Validate & Upload"}
            </button>
            <button
              onClick={handleReset}
              disabled={loading}
              className="bg-gray-600 hover:bg-gray-500 px-4 py-2 rounded font-semibold"
            >
              🔄 Upload Again
            </button>
          </div>

          {loading && (
            <>
              <div className="w-full bg-gray-700 rounded h-4 mt-4 overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    progress < 40
                      ? "bg-yellow-500"
                      : progress < 80
                      ? "bg-yellow-400"
                      : "bg-green-500"
                  }`}
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-300 mt-2">
                Progress: {progress}% ({currentIndex}/{parsedRows.length})
              </p>
            </>
          )}
        </>
      )}

      {results.length > 0 && (
        <div className="mt-8 space-y-1">
          <h2 className="text-lg font-semibold mb-2">📊 Upload Results:</h2>
          {results.map((msg, idx) => (
            <p
              key={idx}
              className={
                msg.startsWith("✅")
                  ? "text-green-400"
                  : msg.startsWith("⚠️")
                  ? "text-yellow-400"
                  : "text-red-400"
              }
            >
              {msg}
            </p>
          ))}
          {!loading && (
            <div className="mt-4 text-sm text-white">
              🧠 <strong>Summary:</strong> Success:{" "}
              <span className="text-green-400">{successCount}</span> | Skipped:{" "}
              <span className="text-yellow-400">{skippedCount}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
