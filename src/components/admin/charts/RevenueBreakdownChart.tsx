"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

const COLORS = ["#2d6a2d", "#4a9e4a", "#d4a843", "#b8922e"];

interface DataPoint { name: string; value: number }

export default function RevenueBreakdownChart({ data }: { data: DataPoint[] }) {
  const hasData = data.some((d) => d.value > 0);
  if (!hasData) {
    return <p className="text-muted text-sm text-center py-8">No revenue data yet</p>;
  }

  const displayData = data.filter((d) => d.value > 0).map((d) => ({
    ...d,
    displayValue: d.value / 100,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={displayData}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={100}
          fill="#8884d8"
          dataKey="displayValue"
          nameKey="name"
          label={({ name, percent }) => `${name} (${((percent ?? 0) * 100).toFixed(0)}%)`}
        >
          {displayData.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => `$${Number(value).toLocaleString()}`} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
