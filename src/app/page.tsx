"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import LevelChart from "@/components/quiz/LevelChart";

export default function Home() {
  const [levelData, setLevelData] = useState([
    { level: "1", count: 0 },
    { level: "2", count: 0 },
    { level: "3", count: 0 },
    { level: "4", count: 0 },
    { level: "5", count: 0 },
  ]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    async function fetchLevelStats() {
      try {
        const res = await axios.get("/api/stats");
        setLevelData(res.data);
      } catch (err) {
        console.error("Error fetching stats:", err);
      }
    }
    fetchLevelStats();
  }, []);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-950 text-white p-6">
      <h1 className="text-4xl font-extrabold mb-2 text-indigo-400 drop-shadow">
        Welcome to SkyVocab
      </h1>
      <p className="text-gray-400 mb-8 text-lg">
        Train your words like a hero! 💥
      </p>

      {mounted && <LevelChart data={levelData} />}
    </main>
  );
}
