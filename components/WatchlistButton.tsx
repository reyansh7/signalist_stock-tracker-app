"use client";
import { Star } from "lucide-react";
import { useWatchlist } from "@/hooks/useWatchlist";
import { useEffect, useState } from "react";

interface Props {
  symbol: string;
  name?: string;
  price?: number;
}

export default function WatchlistButton({ symbol, name, price }: Props) {
  const { isInWatchlist, toggle, loaded } = useWatchlist();
  const [active, setActive] = useState(false);

  // Sync local state with watchlist state
  useEffect(() => {
    if (loaded) {
      setActive(isInWatchlist(symbol));
    }
  }, [symbol, isInWatchlist, loaded]);

  const handleClick = () => {
    toggle({ symbol, name: name || symbol, price });
    setActive(!active);
  };

  if (!loaded) {
    return (
      <button
        disabled
        className="w-full rounded-md px-4 py-3 text-center text-sm font-semibold bg-gray-600 text-gray-300 cursor-not-allowed"
      >
        Loading...
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      className={`w-full rounded-md px-4 py-3 text-center text-sm font-semibold transition-colors flex items-center justify-center gap-2 ${
        active ? "bg-red-500 hover:bg-red-600 text-white" : "bg-[#f2c94c] hover:bg-[#f6d767] text-black"
      }`}
    >
      <Star className={`h-4 w-4 ${active ? "fill-white" : "fill-black/30"}`} />
      {active ? "Remove from Watchlist" : "Add to Watchlist"}
    </button>
  );
}
