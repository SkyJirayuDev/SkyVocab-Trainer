"use client";

import React, { useEffect, useState, useMemo, useRef } from "react";
import axios from "axios";
import { motion } from "framer-motion";

interface WordProgress {
  word: string;
  translation: string;
  level: number;
  score: number;
  partOfSpeech: string;
}

export default function WordProgressTable() {
  const [words, setWords] = useState<WordProgress[]>([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<keyof WordProgress | "">("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [showAll, setShowAll] = useState(false);
  const tableTopRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    axios.get("/api/stats/progress").then((res) => setWords(res.data));
  }, []);

  const filteredWords = useMemo(() => {
    let result = [...words];

    if (search.trim()) {
      const s = search.toLowerCase();
      result = result.filter(
        (w) =>
          w.word.toLowerCase().includes(s) ||
          w.translation.toLowerCase().includes(s)
      );
    }

    if (sortBy) {
      result.sort((a, b) => {
        if (a[sortBy] < b[sortBy]) return sortDirection === "asc" ? -1 : 1;
        if (a[sortBy] > b[sortBy]) return sortDirection === "asc" ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [words, search, sortBy, sortDirection]);

  const visibleWords = showAll ? filteredWords : filteredWords.slice(0, 10);

  const toggleSort = (field: keyof WordProgress) => {
    if (sortBy === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortDirection("asc");
    }
  };

  const handleToggle = () => {
    if (showAll && tableTopRef.current) {
      setTimeout(() => {
        tableTopRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
    setShowAll(!showAll);
  };

  return (
    <div className="mt-8" ref={tableTopRef}>
      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search word or translation"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-1/3 px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-700">
        <table className="min-w-full divide-y divide-gray-600 text-sm text-left">
          <thead className="bg-gray-900 text-gray-300">
            <tr>
              {["word", "translation", "partOfSpeech", "level", "score"].map(
                (key) => (
                  <th
                    key={key}
                    className="px-4 py-2 cursor-pointer hover:text-white"
                    onClick={() => toggleSort(key as keyof WordProgress)}
                  >
                    {key === "partOfSpeech"
                      ? "Part of Speech"
                      : key.charAt(0).toUpperCase() + key.slice(1)}
                    {sortBy === key && (sortDirection === "asc" ? " ▲" : " ▼")}
                  </th>
                )
              )}
            </tr>
          </thead>

          <motion.tbody
            className="divide-y divide-gray-700"
            animate={{ height: "auto" }}
            initial={false}
            transition={{ duration: 0.5 }}
          >
            {visibleWords.map((w) => (
              <tr key={w.word} className="hover:bg-gray-800">
                <td className="px-4 py-2">{w.word}</td>
                <td className="px-4 py-2">{w.translation}</td>
                <td className="px-4 py-2">{w.partOfSpeech}</td>
                <td className="px-4 py-2">Lv.{w.level}</td>
                <td className="px-4 py-2">{w.score}</td>
              </tr>
            ))}
          </motion.tbody>
        </table>
      </div>

      {/* Word Count Summary */}
      <div className="text-sm text-gray-400 mt-2 text-center">
        Showing {visibleWords.length} of {filteredWords.length} words
      </div>

      {/* Toggle Button */}
      {filteredWords.length > 10 && (
        <div className="text-center mt-4">
          <motion.button
            onClick={handleToggle}
            className="text-blue-400 hover:text-white underline"
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
          >
            {showAll ? "Show Less" : "Show All"}
          </motion.button>
        </div>
      )}
    </div>
  );
}
