"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface StockSummaryData {
  Name: string;
  open: string;
  high: string;
  low: string;
  vol: string;
  close: number;
  "Outstanding Securities": string;
}

interface StockData {
  name: string;
  price: number;
  change: number;
  changePercent: number;
  open: number;
  high: number;
  low: number;
  volume: number;
  marketCap: string;
  peRatio: number;
  dividend: number;
  eps: number;
  sector: string;
  industry: string;
  socialCauses: string[];
  regions: string[];
  esgRating: string;
  carbonFootprint: string;
}

export default function StockSummary({
  symbol,
  initialData,
}: {
  symbol: string;
  initialData: StockData;
}) {
  const [stock, setStock] = useState<StockData>(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSummaryData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const summaryResponse = await fetch(`/api/summary?query=${symbol}`, {
          method: "POST",
          headers: {
            accept: "application/json",
          },
        });

        if (!summaryResponse.ok) {
          throw new Error("Failed to fetch summary data");
        }

        const summaryData = await summaryResponse.json();
        const stockSummary = summaryData.object
          ? (JSON.parse(JSON.parse(summaryData.object).data[0])[
              symbol
            ] as StockSummaryData)
          : null;
        console.log(stockSummary);

        if (stockSummary) {
          setStock((prevStock) => ({
            ...prevStock,
            name: stockSummary.Name,
            open: parseFloat(stockSummary.open),
            high: parseFloat(stockSummary.high),
            low: parseFloat(stockSummary.low),
            volume: parseInt(stockSummary.vol),
            price: stockSummary.close,
            marketCap:
              (
                (parseFloat(stockSummary["Outstanding Securities"]) *
                  stockSummary.close) /
                1e12
              ).toFixed(2) + "T",
          }));
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error("Error fetching summary data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSummaryData();
  }, [symbol]);

  const isPositive = stock.change >= 0;

  if (error) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="text-red-500">Error loading stock data: {error}</div>
        </CardContent>
      </Card>
    );
  }
  return (
    <>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Key Metrics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <div className="text-xs text-muted-foreground">P/E Ratio</div>
              <div className="text-sm font-medium">
                {stock.peRatio.toFixed(2)}
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">EPS</div>
              <div className="text-sm font-medium">${stock.eps.toFixed(2)}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Dividend</div>
              <div className="text-sm font-medium">
                ${stock.dividend.toFixed(2)}
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Market Cap</div>
              <div className="text-sm font-medium">{stock.marketCap}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Today's Trading
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <div className="text-xs text-muted-foreground">Open</div>
              <div className="text-sm font-medium">
                ${stock.open.toFixed(2)}
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">High</div>
              <div className="text-sm font-medium">
                ${stock.high.toFixed(2)}
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Low</div>
              <div className="text-sm font-medium">${stock.low.toFixed(2)}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Volume</div>
              <div className="text-sm font-medium">
                {(stock.volume / 1000000).toFixed(1)}M
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
