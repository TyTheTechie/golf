"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface DataPoint { name: string; bids: number; revenue: number }

export default function AuctionPerformanceChart({ data }: { data: DataPoint[] }) {
  if (data.length === 0) {
    return <p className="text-muted text-sm text-center py-8">No auction data yet</p>;
  }

  const displayData = data.map((d) => ({ ...d, revenueDisplay: d.revenue / 100 }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={displayData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#d4e8d4" />
        <XAxis dataKey="name" fontSize={11} tick={{ fill: "#6b8f6b" }} angle={-20} textAnchor="end" height={60} />
        <YAxis yAxisId="left" fontSize={12} tick={{ fill: "#6b8f6b" }} />
        <YAxis yAxisId="right" orientation="right" fontSize={12} tick={{ fill: "#d4a843" }} />
        <Tooltip formatter={(value, name) => name === "revenueDisplay" ? `$${Number(value).toLocaleString()}` : value} />
        <Bar yAxisId="left" dataKey="bids" fill="#2d6a2d" name="Bids" radius={[4, 4, 0, 0]} />
        <Bar yAxisId="right" dataKey="revenueDisplay" fill="#d4a843" name="Current Bid ($)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
