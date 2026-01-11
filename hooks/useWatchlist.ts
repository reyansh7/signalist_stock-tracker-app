"use client";
import { useEffect, useState, useCallback } from "react";

type WatchlistEntry = {
  symbol: string;
  name?: string;
  price?: number;
};

const STORAGE_KEY = "watchlist";

export function useWatchlist() {
  const [watchlist, setWatchlist] = useState<WatchlistEntry[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setWatchlist(parsed);
      }
    } catch (e) {
      console.error("Failed to load watchlist", e);
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(watchlist));
    } catch (e) {
      console.error("Failed to save watchlist", e);
    }
  }, [watchlist, loaded]);

  const isInWatchlist = useCallback(
    (symbol: string | undefined | null) => {
      if (!symbol) return false;
      const upper = symbol.toUpperCase();
      return watchlist.some((item) => item.symbol.toUpperCase() === upper);
    },
    [watchlist]
  );

  const add = useCallback(
    (entry: WatchlistEntry) => {
      if (!entry.symbol) return;
      const upper = entry.symbol.toUpperCase();
      setWatchlist((prev) => {
        if (prev.some((i) => i.symbol.toUpperCase() === upper)) return prev;
        return [...prev, { ...entry, symbol: upper }];
      });
    },
    []
  );

  const remove = useCallback(
    (symbol: string) => {
      const upper = symbol.toUpperCase();
      setWatchlist((prev) => prev.filter((i) => i.symbol.toUpperCase() !== upper));
    },
    []
  );

  const toggle = useCallback(
    (entry: WatchlistEntry) => {
      const upper = entry.symbol.toUpperCase();
      setWatchlist((prev) => {
        const exists = prev.some((i) => i.symbol.toUpperCase() === upper);
        if (exists) return prev.filter((i) => i.symbol.toUpperCase() !== upper);
        return [...prev, { ...entry, symbol: upper }];
      });
    },
    []
  );

  return { watchlist, loaded, isInWatchlist, add, remove, toggle };
}
