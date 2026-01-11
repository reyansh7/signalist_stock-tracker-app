"use client"

import { useEffect, useState } from "react"
import { CommandDialog, CommandEmpty, CommandInput, CommandList } from "@/components/ui/command"
import {Button} from "@/components/ui/button";
import {Loader2,  Star,  TrendingUp} from "lucide-react";
import Link from "next/link";
import {searchStocks} from "@/lib/actions/finnhub.actions";
import {useDebounce} from "@/hooks/useDebounce";

export default function SearchCommand({ renderAs = 'button', label = 'Add stock', initialStocks }: SearchCommandProps) {
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(false)
  const [stocks, setStocks] = useState<StockWithWatchlistStatus[]>(initialStocks);

  const isSearchMode = !!searchTerm.trim();
  const displayStocks = isSearchMode ? stocks : stocks?.slice(0, 10);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        setOpen(v => !v)
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [])

  const handleSearch = async () => {
    if(!isSearchMode) return setStocks(initialStocks);

    setLoading(true)
    try {
        const results = await searchStocks(searchTerm.trim());
        setStocks(results);
    } catch {
      setStocks([])
    } finally {
      setLoading(false)
    }
  }

  const debouncedSearch = useDebounce(handleSearch, 300);

  useEffect(() => {
    debouncedSearch();
  }, [searchTerm]);

  const handleSelectStock = () => {
    setOpen(false);
    setSearchTerm("");
    setStocks(initialStocks);
  }

  return (
    <>
      {renderAs === 'text' ? (
          <span 
            onClick={() => setOpen(true)} 
            className="cursor-pointer hover:text-yellow-400 transition-colors"
          >
            {label}
          </span>
      ): (
          <Button onClick={() => setOpen(true)} className="bg-yellow-400 hover:bg-yellow-500 text-black font-medium">
            {label}
          </Button>
      )}
      <CommandDialog open={open} onOpenChange={setOpen} className="search-dialog">
        <div className="relative">
          <CommandInput 
            value={searchTerm} 
            onValueChange={setSearchTerm} 
            placeholder="Search stocks..." 
            className="h-12 px-4 text-base border-none bg-transparent focus:ring-0" 
          />
          {loading && <Loader2 className="absolute right-4 top-3.5 h-5 w-5 animate-spin text-gray-400" />}
        </div>
        <CommandList className="max-h-100 overflow-y-auto px-2 pb-2">
          {loading ? (
              <CommandEmpty className="py-8 text-center text-sm text-gray-400">Loading stocks...</CommandEmpty>
          ) : displayStocks?.length === 0 ? (
              <div className="py-8 text-center text-sm text-gray-400">
                {isSearchMode ? 'No results found' : 'No stocks available'}
              </div>
            ) : (
            <div>
              <div className="px-3 py-2 text-xs font-medium text-gray-400">
                {isSearchMode ? 'Search results' : 'Popular stocks'} ({displayStocks?.length || 0})
              </div>
              <div className="space-y-0.5">
                {displayStocks?.map((stock) => (
                  <Link
                    key={stock.symbol}
                    href={`/stocks/${stock.symbol}`}
                    onClick={handleSelectStock}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-[#2a2a2a] transition-colors cursor-pointer group"
                  >
                    <TrendingUp className="h-4 w-4 text-gray-500 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-white text-sm truncate group-hover:text-white">
                        {stock.name}
                      </div>
                      <div className="text-xs text-gray-400 mt-0.5">
                        {stock.symbol} | {stock.exchange} | {stock.type}
                      </div>
                    </div>
                    <Star />
                  </Link>
                  
                ))}
              </div>
            </div>
          )
          }
        </CommandList>
      </CommandDialog>
    </>
  )
}