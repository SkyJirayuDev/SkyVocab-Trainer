import WordProgressTable from "@/components/stats/WordProgressTable";

export default function StatsPage() {
  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold m-4 text-white text-center">📊 Your Vocabulary Stats</h1>

      {/* Section 2: Word Progress */}
      <WordProgressTable />
    </div>
  );
}
