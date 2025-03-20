"use client"

import { Loader2, Search, TrendingUp, X } from "lucide-react"
import { useEffect, useRef, useState } from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"

// Mock stock data
const stocksData = [
  { symbol: "AAPL", name: "Apple Inc.", price: 187.68, change: 1.23 },
  { symbol: "MSFT", name: "Microsoft Corporation", price: 390.27, change: 2.56 },
  { symbol: "GOOGL", name: "Alphabet Inc.", price: 142.89, change: -0.78 },
  { symbol: "AMZN", name: "Amazon.com Inc.", price: 178.12, change: 0.45 },
  { symbol: "TSLA", name: "Tesla, Inc.", price: 177.56, change: -2.34 },
  { symbol: "META", name: "Meta Platforms, Inc.", price: 474.99, change: 3.21 },
  { symbol: "NVDA", name: "NVIDIA Corporation", price: 950.02, change: 15.67 },
  { symbol: "JPM", name: "JPMorgan Chase & Co.", price: 198.47, change: 0.89 },
  { symbol: "V", name: "Visa Inc.", price: 275.31, change: 1.05 },
  { symbol: "JNJ", name: "Janeson & Janeson", price: 147.89, change: -0.32 },
]

export default function StockSearch() {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [results, setResults] = useState<typeof stocksData>([])
  const searchRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    // Handle clicks outside the search component
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  useEffect(() => {
    if (searchQuery.length > 0) {
      setIsSearching(true)
      // Simulate API call with timeout
      const timeoutId = setTimeout(() => {
        const filtered = stocksData.filter(
          (stock) =>
            stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
            stock.name.toLowerCase().includes(searchQuery.toLowerCase()),
        )
        setResults(filtered)
        setIsSearching(false)
        setIsOpen(true)
      }, 300)

      return () => clearTimeout(timeoutId)
    } else {
      setResults([])
      setIsOpen(false)
    }
  }, [searchQuery])

  const handleStockSelect = (symbol: string) => {
    router.push(`/stocks/${symbol}`)
    setIsOpen(false)
    setSearchQuery("")
  }

  return (
    <div className="relative" ref={searchRef}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search stocks..."
          className="pl-10 pr-10 bg-background"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => {
            if (searchQuery.length > 0) setIsOpen(true)
          }}
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2"
            onClick={() => setSearchQuery("")}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-full rounded-md border border-border bg-card shadow-lg">
          <div className="p-2">
            {isSearching ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            ) : results.length > 0 ? (
              <div className="max-h-[300px] overflow-auto">
                {results.map((stock) => (
                  <div
                    key={stock.symbol}
                    className="flex items-center justify-between p-2 hover:bg-muted rounded-md cursor-pointer"
                    onClick={() => handleStockSelect(stock.symbol)}
                  >
                    <div>
                      <div className="font-medium">{stock.symbol}</div>
                      <div className="text-sm text-muted-foreground">{stock.name}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <div className="font-medium">${stock.price.toFixed(2)}</div>
                        <Badge
                          variant="outline"
                          className={`${
                            stock.change >= 0 ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                          }`}
                        >
                          {stock.change >= 0 ? "+" : ""}
                          {stock.change.toFixed(2)}%
                        </Badge>
                      </div>
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-3 text-center text-sm text-muted-foreground">No results found</div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

