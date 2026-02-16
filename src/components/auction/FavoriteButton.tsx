"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { toggleFavorite } from "@/app/auction/favorites-actions";

export default function FavoriteButton({
  auctionItemId,
  initialFavorited,
}: {
  auctionItemId: string;
  initialFavorited: boolean;
}) {
  const [favorited, setFavorited] = useState(initialFavorited);
  const [loading, setLoading] = useState(false);

  async function handleToggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setLoading(true);
    const result = await toggleFavorite(auctionItemId);
    if ("favorited" in result && result.favorited !== undefined) {
      setFavorited(result.favorited);
    }
    setLoading(false);
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`p-2 rounded-full transition-colors ${
        favorited
          ? "text-red-500 bg-red-50 hover:bg-red-100"
          : "text-muted hover:text-red-500 hover:bg-red-50"
      }`}
      title={favorited ? "Remove from favorites" : "Add to favorites"}
    >
      <Heart size={18} fill={favorited ? "currentColor" : "none"} />
    </button>
  );
}
