"use client";

import { useState, useEffect } from "react";
import { Clock } from "lucide-react";

function computeTimeLeft(endTime: string | null) {
  if (!endTime) return "No end time set";
  const diff = new Date(endTime).getTime() - Date.now();
  if (diff <= 0) return "Ended";
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const mins = Math.floor((diff / (1000 * 60)) % 60);
  const secs = Math.floor((diff / 1000) % 60);
  return hours > 0 ? `${hours}h ${mins}m ${secs}s` : `${mins}m ${secs}s`;
}

function computeIsEnding(endTime: string | null) {
  if (!endTime) return false;
  return new Date(endTime).getTime() - Date.now() < 300000;
}

export default function AuctionCountdown({ endTime }: { endTime: string | null }) {
  const [timeLeft, setTimeLeft] = useState(() => computeTimeLeft(endTime));
  const [isEnding, setIsEnding] = useState(() => computeIsEnding(endTime));

  useEffect(() => {
    if (!endTime) return;
    const interval = setInterval(() => {
      setTimeLeft(computeTimeLeft(endTime));
      setIsEnding(computeIsEnding(endTime));
    }, 1000);
    return () => clearInterval(interval);
  }, [endTime]);

  return (
    <span
      className={`inline-flex items-center gap-1 text-sm font-medium ${
        isEnding ? "text-red-600" : "text-muted"
      }`}
    >
      <Clock size={14} />
      {timeLeft}
    </span>
  );
}
