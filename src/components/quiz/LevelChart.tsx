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
  return (
    <div className="w-full max-w-4xl mt-8 border border-gray-700 rounded shadow bg-gray-900 p-6">
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 30, right: 30, left: 30, bottom: 30 }}
            barCategoryGap="20%"
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#2d2d2d" />

            <XAxis
              dataKey="level"
              tick={{ fill: '#d1d5db', fontSize: 14 }} 
              tickFormatter={(value: string) => `Lv.${value}`}
              axisLine={false}
              tickLine={false}
            />

            <Bar
              dataKey="count"
              radius={[8, 8, 0, 0]}
              animationDuration={800}
              label={{
                position: "top",
                fill: "#e5e7eb", 
                fontWeight: "bold",
                fontSize: 16,
              }}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    entry.level === "1"
                      ? "#6366f1" // Indigo
                      : entry.level === "2"
                      ? "#10b981" // Emerald
                      : entry.level === "3"
                      ? "#f59e0b" // Amber
                      : entry.level === "4"
                      ? "#ef4444" // Red
                      : "#8b5cf6" // Violet
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default LevelChart;
