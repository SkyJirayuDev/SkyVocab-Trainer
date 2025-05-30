"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import LevelChart from "@/components/quiz/LevelChart";
import { useRouter } from "next/navigation";
import RewardPopup from "@/components/quiz/RewardPopup"; 

export default function Home() {
  const router = useRouter();
  const [levelData, setLevelData] = useState([
    { level: "1", count: 0 },
    { level: "2", count: 0 },
    { level: "3", count: 0 },
    { level: "4", count: 0 },
    { level: "5", count: 0 },
  ]);
  const [mounted, setMounted] = useState(false);
  const [unlockedLevel, setUnlockedLevel] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    async function fetchLevelStats() {
      try {
        const res = await axios.get("/api/stats");
        setLevelData(res.data);

        const unlocked = res.data.find(
          (entry: { level: string; count: number }) =>
            parseInt(entry.level) > 1 && entry.count > 0
        );

        if (unlocked) {
          setUnlockedLevel(unlocked.level);
        }
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

      {unlockedLevel && (
        <>
          <RewardPopup
            message={`🏅 Lv.${unlockedLevel} Unlocked!`}
            onClose={() => setUnlockedLevel(null)}
          />
          <div className="mt-6 px-4 py-2 bg-yellow-400 text-black text-sm font-semibold rounded shadow animate-bounce">
            🏅 Lv.{unlockedLevel} Unlocked!
          </div>
        </>
      )}

      <div className="mt-10 flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => router.push("/train")}
          className="px-8 py-3 text-lg font-extrabold text-white tracking-wide rounded-xl
         bg-gradient-to-br from-yellow-500 via-pink-500 to-purple-600
         shadow-[0_4px_25px_rgba(255,255,255,0.4)]
         hover:shadow-[0_6px_30px_rgba(255,255,255,0.5)]
         hover:scale-105 active:scale-95
         transition-all duration-300 ease-out
         animate-pulse border border-white/30"
        >
          Start Today's Review
        </button>

        <button
          onClick={() => router.push("/repeat-review")}
          className="px-8 py-3 text-lg font-bold text-white bg-orange-500 rounded-xl hover:bg-orange-600 transition"
        >
          🔁 Repeat Review
        </button>
      </div>
    </main>
  );
}
