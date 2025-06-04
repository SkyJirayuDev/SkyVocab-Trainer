"use client";
import {
  BarChart,
  Bar,
  XAxis,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface LevelChartProps {
  data: { level: string; count: number }[];
}

const LevelChart = ({ data }: LevelChartProps) => {
  // Color palette by level
  const getBarColor = (level: string) => {
    const colors = {
      "1": "#22c55e", // Green - Beginner
      "2": "#3b82f6", // Blue - Elementary
      "3": "#8b5cf6", // Purple - Intermediate
      "4": "#f59e0b", // Amber - Advanced
      "5": "#ef4444", // Red - Expert
      "6": "#06b6d4", // Cyan - Master
      "7": "#ec4899", // Pink - Native
      "8": "#f97316", // Orange - Academic
    };
    return colors[level as keyof typeof colors] || "#6b7280";
  };

  return (
    <div className="w-full max-w-4xl mt-4 border border-gray-700 rounded-xl shadow-2xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6">
      {/* Header */}
      <div className="mb-2">
        <h3 className="text-xl font-bold text-white mb-2">
          Vocabulary Distribution
        </h3>
        <p className="text-gray-400 text-sm">
          Total: {data.reduce((sum, item) => sum + item.count, 0)} words
        </p>
      </div>

      {/* Bar Chart */}
      <div style={{ width: "100%", height: 250 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 30, right: 30, left: 30, bottom: 30 }}
            barCategoryGap="18%"
          >
            <defs>
              {data.map((_, index) => (
                <linearGradient
                  key={index}
                  id={`gradient${index}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="0%"
                    stopColor={getBarColor(data[index].level)}
                    stopOpacity={1}
                  />
                  <stop
                    offset="100%"
                    stopColor={getBarColor(data[index].level)}
                    stopOpacity={0.7}
                  />
                </linearGradient>
              ))}
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#374151"
              strokeOpacity={0.6}
            />

            <XAxis
              dataKey="level"
              tick={{ fill: "#d1d5db", fontSize: 14, fontWeight: "500" }}
              tickFormatter={(value: string) => `Lv.${value}`}
              axisLine={false}
              tickLine={false}
            />

            <Bar
              dataKey="count"
              radius={[8, 8, 0, 0]}
              animationDuration={1000}
              animationEasing="ease-out"
              label={{
                position: "top",
                fill: "#f3f4f6",
                fontWeight: "600",
                fontSize: 14,
              }}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={`url(#gradient${index})`}
                  stroke={getBarColor(entry.level)}
                  strokeWidth={1}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Mini Progress Indicator */}
      <div className="mt-1 bg-gray-700/50 rounded-full h-1 overflow-hidden">
        <div className="h-full flex">
          {data.map((item, index) => {
            const total = data.reduce((sum, d) => sum + d.count, 0);
            return (
              <div
                key={index}
                className="h-full transition-all duration-700"
                style={{
                  width: `${(item.count / total) * 100}%`,
                  backgroundColor: getBarColor(item.level),
                }}
                title={`Level ${item.level}: ${item.count} words`}
              />
            );
          })}
        </div>
      </div>

      <p className="text-center text-gray-500 text-xs mt-2">
        Word distribution across difficulty levels
      </p>
    </div>
  );
};

export default LevelChart;
