"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import LevelChart from "@/components/quiz/LevelChart";
import { useRouter } from "next/navigation";
import RewardPopup from "@/components/quiz/RewardPopup";
import { FaRocket, FaTrophy, FaStar } from "react-icons/fa";

interface LevelData {
  level: string;
  count: number;
}

export default function Home() {
  const router = useRouter();
  const [levelData, setLevelData] = useState<LevelData[]>([
    { level: "1", count: 0 },
    { level: "2", count: 0 },
    { level: "3", count: 0 },
    { level: "4", count: 0 },
    { level: "5", count: 0 },
  ]);
  const [mounted, setMounted] = useState(false);
  const [unlockedLevel, setUnlockedLevel] = useState<string | null>(null);
  const [todayHasWords, setTodayHasWords] = useState<boolean | null>(null);

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
          const lastUnlocked = localStorage.getItem("lastUnlockedLevel");
          if (lastUnlocked !== unlocked.level) {
            setUnlockedLevel(unlocked.level);
            localStorage.setItem("lastUnlockedLevel", unlocked.level);
          }
        }
      } catch (err) {
        console.error("Error fetching stats:", err);
      }
    }

    async function checkTodayWords() {
      try {
        const res = await axios.get("/api/review");
        const words = res.data;
        setTodayHasWords(Array.isArray(words) && words.length > 0);
      } catch (error) {
        console.error("Error checking today's review words:", error);
        setTodayHasWords(false);
      }
    }

    fetchLevelStats();
    checkTodayWords();
  }, []);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-950 text-white p-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-4 mb-2 mt-2">
          <FaRocket className="text-5xl text-blue-400 animate-pulse" />
          <div>
            <h1 className="text-5xl font-extrabold bg-gradient-to-r from-blue-400 via-purple-400 to-green-400 bg-clip-text text-transparent">
              SkyVocab
            </h1>
            <div className="flex items-center justify-center gap-2 mt-2">
              <FaStar className="text-yellow-400 text-sm" />
              <p className="text-slate-300 text-lg font-medium">
                Train your words like a hero!
              </p>
              <FaStar className="text-yellow-400 text-sm" />
            </div>
          </div>
          <FaTrophy className="text-5xl text-yellow-400 animate-pulse" />
        </div>
      </div>

      {/* Chart */}
      <div className="w-full flex justify-center mb-8">
        {mounted && <LevelChart data={levelData} />}
      </div>

      {/* Reward Popup */}
      {unlockedLevel && (
        <>
          <RewardPopup
            message={`🏅 Lv.${unlockedLevel} Unlocked!`}
            onClose={() => setUnlockedLevel(null)}
          />
          <div className="mb-6 px-6 py-3 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl text-white animate-bounce text-sm font-semibold">
            <span className="text-yellow-400">🏅</span> Lv.{unlockedLevel} Unlocked!
          </div>
        </>
      )}

      {/* Buttons */}
      <div className="flex flex-col items-center gap-6 w-full max-w-md">
        {/* Review Button */}
        <div className="w-full flex justify-center">
          {todayHasWords === null ? (
            <div className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl">
              <p className="text-gray-400 text-sm">
                Checking today&apos;s words...
              </p>
            </div>
          ) : todayHasWords === false ? (
            <div className="px-6 py-4 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl text-center">
              <p className="text-green-400 text-lg font-semibold">
                🎉 You&apos;re all caught up today!
              </p>
            </div>
          ) : (
            <button
              onClick={() => {
                localStorage.setItem("allowSound", "true");
                router.push("/train");
              }}
              className="w-full px-8 py-4 text-xl font-extrabold text-white rounded-xl
                bg-gradient-to-br from-yellow-400 via-pink-500 to-purple-600
                shadow-2xl hover:shadow-[0_8px_32px_rgba(255,255,255,0.25)]
                hover:scale-105 active:scale-95
                transition-all duration-300 ease-out border border-white/20 animate-pulse"
            >
              🏅 Start Today&apos;s Review
            </button>
          )}
        </div>

        {/* Other Buttons */}
        <div className="flex flex-col gap-4 w-full">
          <button
            onClick={() => {
              localStorage.setItem("allowSound", "true");
              router.push("/repeat-review");
            }}
            className="w-full px-6 py-3 text-lg font-bold text-white 
              bg-gray-800 border border-gray-700 rounded-xl shadow-2xl
              hover:bg-orange-600 hover:border-orange-400 
              hover:shadow-[0_6px_24px_rgba(249,115,22,0.3)]
              transition-all duration-300 hover:scale-105 active:scale-95"
          >
            🔁 Repeat Review
          </button>

          <button
            onClick={() => router.push("/add-word")}
            className="w-full px-6 py-3 text-lg font-bold text-white 
              bg-gray-800 border border-gray-700 rounded-xl shadow-2xl
              hover:bg-green-600 hover:border-green-400 
              hover:shadow-[0_6px_24px_rgba(34,197,94,0.3)]
              transition-all duration-300 hover:scale-105 active:scale-95"
          >
            ➕ Add Word
          </button>
        </div>
      </div>
    </main>
  );
}
