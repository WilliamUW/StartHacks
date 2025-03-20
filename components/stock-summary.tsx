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

interface CompanyMetrics {
  eps: string;
  dividend: string;
  marketCap: string;
  earnings: string;
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
  metrics?: CompanyMetrics;
}

interface MetricsResponse {
  "Fundamentals quarter 1 - Net Profit"?: string[];
  "Fundamentals annual 2 - Net Profit"?: string[];
  "Fundamentals quarter 2 - Net Profit"?: string[];
  "Fundamentals quarter 12 - Net Profit"?: string[];
}

// Add this function before the StockSummary component
async function fetchStockSummary(symbol: string): Promise<StockSummaryData | null> {
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
  return summaryData.object
    ? JSON.parse(JSON.parse(summaryData.object).data[0])[symbol] as StockSummaryData
    : null;
}

async function fetchCompanyMetrics(symbol: string): Promise<MetricsResponse> {
  const metricsQuery = {
    [symbol]: "eps|2025",
    [symbol]: "dividend|2025",
    [symbol]: "market cap|2025",
    [symbol]: "earnings|2025"
  };

  const metricsResponse = await fetch(`/api/companydatasearch?query=${encodeURIComponent(JSON.stringify(metricsQuery))}`, {
    method: "POST",
    headers: {
      accept: "application/json",
    },
  });

  if (!metricsResponse.ok) {
    throw new Error("Failed to fetch company metrics");
  }

  const metricsData = await metricsResponse.json();
  return JSON.parse(JSON.parse(metricsData.object).data[0]);
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
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        console.log("fetching data");
        const stockSummary = await fetchStockSummary(symbol);
        const parsedMetrics = await fetchCompanyMetrics(symbol);

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
            metrics: {
              eps: parsedMetrics["Fundamentals quarter 1 - Net Profit"]?.[0] || "N/A",
              dividend: parsedMetrics["Fundamentals annual 2 - Net Profit"]?.[0] || "N/A",
              marketCap: parsedMetrics["Fundamentals quarter 2 - Net Profit"]?.[0] || "N/A",
              earnings: parsedMetrics["Fundamentals quarter 12 - Net Profit"]?.[0] || "N/A"
            }
          }));
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error("Error fetching data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
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
              <div className="text-xs text-muted-foreground">EPS (2025)</div>
              <div className="text-sm font-medium">
                ${stock.metrics?.eps || "N/A"}
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Dividend (2025)</div>
              <div className="text-sm font-medium">
                ${stock.metrics?.dividend || "N/A"}
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Market Cap (2025)</div>
              <div className="text-sm font-medium">
                ${stock.metrics?.marketCap || "N/A"}
              </div>
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

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Future Earnings (2025)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ${stock.metrics?.earnings || "N/A"}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            Projected Net Profit
          </div>
        </CardContent>
      </Card>
    </>
  );
}
