"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface DataPoint { date: string; count: number }

export default function RegistrationTrendChart({ data }: { data: DataPoint[] }) {
  if (data.length === 0) {
    return <p className="text-muted text-sm text-center py-8">No registration data yet</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#d4e8d4" />
        <XAxis dataKey="date" fontSize={12} tick={{ fill: "#6b8f6b" }} />
        <YAxis allowDecimals={false} fontSize={12} tick={{ fill: "#6b8f6b" }} />
        <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #d4e8d4" }} />
        <Line type="monotone" dataKey="count" stroke="#2d6a2d" strokeWidth={2} dot={{ fill: "#2d6a2d" }} name="Registrations" />
      </LineChart>
    </ResponsiveContainer>
  );
}
