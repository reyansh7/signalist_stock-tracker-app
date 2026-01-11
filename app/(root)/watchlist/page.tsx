"use client";
import { useWatchlist } from "@/hooks/useWatchlist";
import { Star, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";

interface WatchlistWithPrice {
  symbol: string;
  name?: string;
  price?: number;
  change?: number;
  marketCap?: string;
  peRatio?: string;
}

export default function WatchlistPage() {
  const { watchlist, loaded, remove } = useWatchlist();
  const [items, setItems] = useState<WatchlistWithPrice[]>([]);

  useEffect(() => {
    if (loaded) {
      setItems(
        watchlist.map((item) => ({
          symbol: item.symbol,
          name: item.name || item.symbol,
          price: item.price || 0,
          change: Math.random() * 10 - 5, // Placeholder
          marketCap: "$3.5T",
          peRatio: "35.5",
        }))
      );
    }
  }, [watchlist, loaded]);

  if (!loaded) {
    return (
      <div className="min-h-screen bg-[#0b0b0b] px-4 py-10 text-gray-300">
        Loading watchlist...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0b0b] px-4 py-10 sm:px-6 lg:px-10">
      <div className="max-w-7xl w-full mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white">Watchlist</h1>
          <button className="rounded-md bg-[#f2c94c] px-6 py-2 text-sm font-semibold text-black hover:bg-[#f6d767] transition">
            Add Stock
          </button>
        </div>

        {items.length === 0 ? (
          <div className="rounded-xl border border-[#1f1f1f] bg-[#111] p-12 text-center">
            <p className="text-gray-400 mb-4">No stocks in watchlist yet</p>
            <button className="rounded-md bg-[#f2c94c] px-6 py-2 text-sm font-semibold text-black hover:bg-[#f6d767] transition">
              Add your first stock
            </button>
          </div>
        ) : (
          <div className="rounded-xl border border-[#1f1f1f] bg-[#111] overflow-hidden shadow-md">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#1f1f1f] bg-[#0f0f0f]">
                    <th className="px-6 py-4 text-left font-semibold text-gray-300">Company</th>
                    <th className="px-6 py-4 text-left font-semibold text-gray-300">Symbol</th>
                    <th className="px-6 py-4 text-left font-semibold text-gray-300">Price</th>
                    <th className="px-6 py-4 text-left font-semibold text-gray-300">Change</th>
                    <th className="px-6 py-4 text-left font-semibold text-gray-300">Market Cap</th>
                    <th className="px-6 py-4 text-left font-semibold text-gray-300">P/E Ratio</th>
                    <th className="px-6 py-4 text-center font-semibold text-gray-300">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr
                      key={item.symbol}
                      className="border-b border-[#1f1f1f] hover:bg-[#1a1a1a] transition"
                    >
                      <td className="px-6 py-4 flex items-center gap-3">
                        <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                        <span className="text-white font-medium">{item.name}</span>
                      </td>
                      <td className="px-6 py-4 text-gray-300">{item.symbol}</td>
                      <td className="px-6 py-4 text-white font-medium">${item.price?.toFixed(2) || "0.00"}</td>
                      <td className={`px-6 py-4 font-medium ${item.change && item.change >= 0 ? "text-green-400" : "text-red-400"}`}>
                        {item.change ? `${item.change >= 0 ? "+" : ""}${item.change.toFixed(2)}%` : "0.00%"}
                      </td>
                      <td className="px-6 py-4 text-gray-300">{item.marketCap}</td>
                      <td className="px-6 py-4 text-gray-300">{item.peRatio}</td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => remove(item.symbol)}
                          className="inline-flex items-center justify-center p-2 rounded hover:bg-[#2a2a2a] transition text-red-500 hover:text-red-400"
                          title="Remove from watchlist"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
