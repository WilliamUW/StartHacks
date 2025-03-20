"use client"

import { ArrowLeft, Clock, Download, Globe, Leaf, Share2, TrendingDown, TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useEffect, useState } from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import NewsCard from "@/components/news-card"
import StockChart from "@/components/stock-chart"

interface StockData {
  name: string
  price: number
  change: number
  changePercent: number
  open: number
  high: number
  low: number
  volume: number
  marketCap: string
  peRatio: number
  dividend: number
  eps: number
  sector: string
  industry: string
  socialCauses: string[]
  regions: string[]
  esgRating: string
  carbonFootprint: string
  // Time series data
  dates: string[]
  prices: number[]
  volumes: number[]
}

// Mock stock data
const stocksData = {
  AAPL: {
    name: "Apple Inc.",
    price: 187.68,
    change: 1.23,
    changePercent: 0.66,
    open: 186.12,
    high: 188.45,
    low: 185.89,
    volume: 58432100,
    marketCap: "2.94T",
    peRatio: 31.2,
    dividend: 0.92,
    eps: 6.02,
    sector: "Technology",
    industry: "Consumer Electronics",
    socialCauses: ["Environmental Sustainability", "Privacy & Data Security", "Education"],
    regions: ["North America", "Europe", "Asia Pacific"],
    esgRating: "A-",
    carbonFootprint: "32% below industry average",
    dates: [],
    prices: [],
    volumes: [],
  },
  MSFT: {
    name: "Microsoft Corporation",
    price: 390.27,
    change: 2.56,
    changePercent: 0.66,
    open: 388.45,
    high: 391.79,
    low: 387.12,
    volume: 22145600,
    marketCap: "2.9T",
    peRatio: 33.8,
    dividend: 2.72,
    eps: 11.55,
    sector: "Technology",
    industry: "Software",
    socialCauses: ["Carbon Neutrality", "Digital Inclusion", "AI Ethics"],
    regions: ["North America", "Europe", "Asia Pacific", "Latin America"],
    esgRating: "A",
    carbonFootprint: "45% below industry average",
    dates: [],
    prices: [],
    volumes: [],
  },
  GOOGL: {
    name: "Alphabet Inc.",
    price: 142.89,
    change: -0.78,
    changePercent: -0.54,
    open: 143.67,
    high: 144.12,
    low: 142.01,
    volume: 25678900,
    marketCap: "1.8T",
    peRatio: 24.5,
    dividend: 0,
    eps: 5.83,
    sector: "Technology",
    industry: "Internet Content & Information",
    socialCauses: ["Digital Literacy", "AI Ethics", "Climate Action"],
    regions: ["North America", "Europe", "Asia Pacific"],
    esgRating: "B+",
    carbonFootprint: "18% below industry average",
    dates: [],
    prices: [],
    volumes: [],
  },
  AMZN: {
    name: "Amazon.com Inc.",
    price: 178.12,
    change: 0.45,
    changePercent: 0.25,
    open: 177.89,
    high: 179.34,
    low: 177.01,
    volume: 31245700,
    marketCap: "1.85T",
    peRatio: 60.7,
    dividend: 0,
    eps: 2.93,
    sector: "Consumer Cyclical",
    industry: "Internet Retail",
    socialCauses: ["Climate Pledge", "Economic Opportunity", "Community Engagement"],
    regions: ["North America", "Europe", "Asia Pacific", "Latin America"],
    esgRating: "B",
    carbonFootprint: "5% below industry average",
    dates: [],
    prices: [],
    volumes: [],
  },
  TSLA: {
    name: "Tesla, Inc.",
    price: 177.56,
    change: -2.34,
    changePercent: -1.3,
    open: 180.12,
    high: 181.45,
    low: 176.89,
    volume: 98765400,
    marketCap: "564.2B",
    peRatio: 50.8,
    dividend: 0,
    eps: 3.49,
    sector: "Consumer Cyclical",
    industry: "Auto Manufacturers",
    socialCauses: ["Clean Energy", "Sustainable Transportation", "Carbon Reduction"],
    regions: ["North America", "Europe", "Asia Pacific", "China"],
    esgRating: "A-",
    carbonFootprint: "65% below industry average",
    dates: [],
    prices: [],
    volumes: [],
  },
  META: {
    name: "Meta Platforms, Inc.",
    price: 474.99,
    change: 3.21,
    changePercent: 0.68,
    open: 472.45,
    high: 476.89,
    low: 471.23,
    volume: 15678900,
    marketCap: "1.21T",
    peRatio: 32.1,
    dividend: 0,
    eps: 14.8,
    sector: "Technology",
    industry: "Internet Content & Information",
    socialCauses: ["Digital Literacy", "Privacy", "Community Development"],
    regions: ["North America", "Europe", "Asia Pacific", "Africa"],
    esgRating: "B",
    carbonFootprint: "10% below industry average",
    dates: [],
    prices: [],
    volumes: [],
  },
  NVDA: {
    name: "NVIDIA Corporation",
    price: 950.02,
    change: 15.67,
    changePercent: 1.68,
    open: 935.78,
    high: 953.12,
    low: 934.56,
    volume: 45678900,
    marketCap: "2.34T",
    peRatio: 88.5,
    dividend: 0.16,
    eps: 10.73,
    sector: "Technology",
    industry: "Semiconductors",
    socialCauses: ["AI Ethics", "Energy Efficiency", "STEM Education"],
    regions: ["North America", "Europe", "Asia Pacific", "Taiwan"],
    esgRating: "B+",
    carbonFootprint: "22% below industry average",
    dates: [],
    prices: [],
    volumes: [],
  },
}

// Client preferences
const clientPreferences = {
  socialCauses: ["Environmental Sustainability", "Clean Energy", "Education", "Healthcare Access"],
  industries: ["Technology", "Healthcare", "Renewable Energy", "Sustainable Agriculture"],
  regions: ["North America", "Europe", "Emerging Markets - Asia"],
}

// Function to fetch real stock data
async function fetchCompanyData(companyName: string): Promise<StockData | null> {
  const today = new Date()
  const threeMonthsAgo = new Date(today)
  threeMonthsAgo.setMonth(today.getMonth() - 3)
  const baseURL = "https://idchat-api-containerapp01-dev.orangepebble-16234c4b.switzerlandnorth.azurecontainerapps.io";

  // Update URL to match the API structure
  const url = `${baseURL}/api/stock-prices`

  console.log('Fetching data from:', url)
  console.log('Request body:', {
    company: companyName,
    startDate: threeMonthsAgo.toISOString(),
    endDate: today.toISOString(),
  })

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        company: companyName,
        startDate: threeMonthsAgo.toISOString(),
        endDate: today.toISOString(),
      }),
      cache: 'no-store', // Disable caching
    })

    if (!response.ok) {
      console.error('API response not ok:', response.status, response.statusText)
      const errorText = await response.text()
      console.error('Error response:', errorText)
      throw new Error('Network response was not ok')
    }

    const data = await response.json()
    console.log('API Response:', data)
    
    // Transform API response into StockData format
    if (data && data.stockData) {
      console.log('Stock data found:', {
        dates: data.stockData.dates?.length || 0,
        prices: data.stockData.prices?.length || 0,
        volumes: data.stockData.volumes?.length || 0
      })

      // Format the data to match the expected structure
      const stockPrices = data.stockData.prices || []
      const stockDates = data.stockData.dates || []
      const stockVolumes = data.stockData.volumes || []

      const latestPrice = stockPrices[stockPrices.length - 1]
      const previousPrice = stockPrices[stockPrices.length - 2] || latestPrice
      const priceChange = latestPrice - previousPrice
      const priceChangePercent = (priceChange / previousPrice) * 100

      const transformedData = {
        name: data.stockData.companyName || companyName,
        price: latestPrice,
        change: priceChange,
        changePercent: priceChangePercent,
        open: data.stockData.open || latestPrice,
        high: Math.max(...stockPrices),
        low: Math.min(...stockPrices),
        volume: stockVolumes[stockVolumes.length - 1] || 0,
        marketCap: data.stockData.marketCap || "N/A",
        peRatio: data.stockData.peRatio || 0,
        dividend: data.stockData.dividend || 0,
        eps: data.stockData.eps || 0,
        sector: data.stockData.sector || "Unknown",
        industry: data.stockData.industry || "Unknown",
        socialCauses: data.stockData.socialCauses || [],
        regions: data.stockData.regions || [],
        esgRating: data.stockData.esgRating || "N/A",
        carbonFootprint: data.stockData.carbonFootprint || "N/A",
        dates: stockDates,
        prices: stockPrices,
        volumes: stockVolumes,
      }

      console.log('Transformed data:', transformedData)
      return transformedData
    }

    console.log('No stock data found in response')
    return null
  } catch (error) {
    console.error('Error fetching company data:', error)
    return null
  }
}

export default function StockPage({ params }: { params: { symbol: string } }) {
  const [stockData, setStockData] = useState<StockData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const symbol = params.symbol.toUpperCase()
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const data = await fetchCompanyData(symbol)
        if (data) {
          setStockData(data)
        } else {
          setError('Failed to fetch stock data')
        }
      } catch (err) {
        console.error('Error fetching data:', err)
        setError('Failed to fetch stock data')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [symbol])

  // Use mock data as fallback if API fails
  const stock = stockData || stocksData[symbol as keyof typeof stocksData] || {
    name: "Unknown Stock",
    price: 0,
    change: 0,
    changePercent: 0,
    open: 0,
    high: 0,
    low: 0,
    volume: 0,
    marketCap: "0",
    peRatio: 0,
    dividend: 0,
    eps: 0,
    sector: "Unknown",
    industry: "Unknown",
    socialCauses: [],
    regions: [],
    esgRating: "N/A",
    carbonFootprint: "N/A",
    dates: [],
    prices: [],
    volumes: [],
  }

  const isPositive = stock.change >= 0

  // Calculate social cause alignment with client preferences
  const matchingSocialCauses =
    stock.socialCauses?.filter((cause) => clientPreferences.socialCauses.includes(cause)) || []

  const socialAlignmentPercentage = Math.round(
    (matchingSocialCauses.length / clientPreferences.socialCauses.length) * 100,
  )

  // Calculate region alignment with client preferences
  const matchingRegions = stock.regions?.filter((region) => clientPreferences.regions.includes(region)) || []

  const regionAlignmentPercentage = Math.round((matchingRegions.length / clientPreferences.regions.length) * 100)

  return (
    <main className="flex h-screen bg-background text-foreground overflow-hidden">
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="border-b border-border p-4 flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/" className="mr-4">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold">{symbol}</h1>
                <Badge variant="outline" className="text-sm font-normal">
                  {stock.sector}
                </Badge>
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <span className="mr-3">{stock.name}</span>
                <span className="mr-3">|</span>
                <span>{stock.industry}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-1">
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button variant="outline" size="sm" className="gap-1">
              <Share2 className="h-4 w-4" />
              Share
            </Button>
            <Button size="sm">Add to Portfolio</Button>
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          <div className="p-6">
            <div className="grid grid-cols-1 gap-6 mb-6">
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div>
                  <div className="text-3xl font-bold">${stock.price.toFixed(2)}</div>
                  <div className="flex items-center mt-1">
                    <Badge
                      variant="outline"
                      className={`${
                        isPositive ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                      } flex items-center mr-2`}
                    >
                      {isPositive ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                      {isPositive ? "+" : ""}
                      ${Math.abs(stock.change).toFixed(2)} ({Math.abs(stock.changePercent).toFixed(2)}%)
                    </Badge>
                    <span className="text-sm text-muted-foreground flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      Last updated: {new Date().toLocaleTimeString()}
                    </span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" className="bg-primary/10">
                    1D
                  </Button>
                  <Button variant="outline" size="sm">
                    1W
                  </Button>
                  <Button variant="outline" size="sm">
                    1M
                  </Button>
                  <Button variant="outline" size="sm">
                    3M
                  </Button>
                  <Button variant="outline" size="sm">
                    1Y
                  </Button>
                  <Button variant="outline" size="sm">
                    5Y
                  </Button>
                </div>
              </div>

              <Card>
                <CardHeader className="pb-4">
                  <CardTitle>Price History</CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="3M">
                    <TabsList className="mb-4">
                      <TabsTrigger value="1D">1D</TabsTrigger>
                      <TabsTrigger value="1W">1W</TabsTrigger>
                      <TabsTrigger value="1M">1M</TabsTrigger>
                      <TabsTrigger value="3M">3M</TabsTrigger>
                      <TabsTrigger value="1Y">1Y</TabsTrigger>
                      <TabsTrigger value="5Y">5Y</TabsTrigger>
                    </TabsList>
                    <TabsContent value="1D">
                      <StockChart symbol={symbol} timeframe="1D" />
                    </TabsContent>
                    <TabsContent value="1W">
                      <StockChart symbol={symbol} timeframe="1W" />
                    </TabsContent>
                    <TabsContent value="1M">
                      <StockChart symbol={symbol} timeframe="1M" />
                    </TabsContent>
                    <TabsContent value="3M">
                      {isLoading ? (
                        <div className="flex items-center justify-center h-[300px]">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </div>
                      ) : error ? (
                        <div className="flex items-center justify-center h-[300px] text-red-500">
                          {error}
                        </div>
                      ) : (
                        <StockChart 
                          symbol={symbol} 
                          timeframe="3M" 
                          data={stockData ? {
                            dates: stockData.dates,
                            prices: stockData.prices,
                            volumes: stockData.volumes
                          } : undefined}
                        />
                      )}
                    </TabsContent>
                    <TabsContent value="1Y">
                      <StockChart symbol={symbol} timeframe="1Y" />
                    </TabsContent>
                    <TabsContent value="5Y">
                      <StockChart symbol={symbol} timeframe="5Y" />
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Key Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <div className="text-xs text-muted-foreground">Open</div>
                      <div className="text-sm font-medium">${stock.open.toFixed(2)}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">High</div>
                      <div className="text-sm font-medium">${stock.high.toFixed(2)}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Low</div>
                      <div className="text-sm font-medium">${stock.low.toFixed(2)}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Volume</div>
                      <div className="text-sm font-medium">{(stock.volume / 1000000).toFixed(1)}M</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Market Cap</div>
                      <div className="text-sm font-medium">${stock.marketCap}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">P/E Ratio</div>
                      <div className="text-sm font-medium">{stock.peRatio.toFixed(2)}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Dividend</div>
                      <div className="text-sm font-medium">${stock.dividend.toFixed(2)}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">EPS</div>
                      <div className="text-sm font-medium">${stock.eps.toFixed(2)}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Performance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="text-xs text-muted-foreground">Today</div>
                      <div className="flex items-center">
                        <div className={`text-sm font-medium ${isPositive ? "text-green-500" : "text-red-500"}`}>
                          {isPositive ? "+" : ""}
                          {stock.changePercent.toFixed(2)}%
                        </div>
                        <div className="w-24 h-2 bg-muted ml-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${isPositive ? "bg-green-500" : "bg-red-500"}`}
                            style={{ width: `${Math.min(Math.abs(stock.changePercent) * 5, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="text-xs text-muted-foreground">1 Week</div>
                      <div className="flex items-center">
                        <div className="text-sm font-medium text-green-500">+2.45%</div>
                        <div className="w-24 h-2 bg-muted ml-2 rounded-full overflow-hidden">
                          <div className="h-full bg-green-500" style={{ width: "12%" }}></div>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="text-xs text-muted-foreground">1 Month</div>
                      <div className="flex items-center">
                        <div className="text-sm font-medium text-green-500">+8.32%</div>
                        <div className="w-24 h-2 bg-muted ml-2 rounded-full overflow-hidden">
                          <div className="h-full bg-green-500" style={{ width: "42%" }}></div>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="text-xs text-muted-foreground">3 Months</div>
                      <div className="flex items-center">
                        <div className="text-sm font-medium text-red-500">-3.18%</div>
                        <div className="w-24 h-2 bg-muted ml-2 rounded-full overflow-hidden">
                          <div className="h-full bg-red-500" style={{ width: "16%" }}></div>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="text-xs text-muted-foreground">1 Year</div>
                      <div className="flex items-center">
                        <div className="text-sm font-medium text-green-500">+24.67%</div>
                        <div className="w-24 h-2 bg-muted ml-2 rounded-full overflow-hidden">
                          <div className="h-full bg-green-500" style={{ width: "80%" }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Social & Geographic</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <div className="text-xs text-muted-foreground">Social Causes</div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {stock.socialCauses?.map((cause, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className={
                            clientPreferences.socialCauses.includes(cause)
                              ? "bg-green-500/10 text-green-500"
                              : "bg-muted/50"
                          }
                        >
                          {cause}
                        </Badge>
                      ))}
                    </div>
                    <div className="text-xs text-muted-foreground mt-2">
                      <span className="font-medium">Alignment:</span> {socialAlignmentPercentage}% match with
                      preferences
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-muted-foreground">Geographic Presence</div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {stock.regions?.map((region, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className={
                            clientPreferences.regions.includes(region)
                              ? "bg-green-500/10 text-green-500"
                              : "bg-muted/50"
                          }
                        >
                          {region}
                        </Badge>
                      ))}
                    </div>
                    <div className="text-xs text-muted-foreground mt-2">
                      <span className="font-medium">Alignment:</span> {regionAlignmentPercentage}% match with
                      preferences
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-muted-foreground">ESG Rating</div>
                    <div className="flex items-center mt-1">
                      <Badge
                        variant="outline"
                        className={
                          stock.esgRating === "A" || stock.esgRating === "A-"
                            ? "bg-green-500/10 text-green-500"
                            : stock.esgRating?.startsWith("B")
                              ? "bg-amber-500/10 text-amber-500"
                              : "bg-red-500/10 text-red-500"
                        }
                      >
                        {stock.esgRating}
                      </Badge>
                      <span className="text-xs text-muted-foreground ml-2">Carbon: {stock.carbonFootprint}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="news">
              <TabsList className="mb-6">
                <TabsTrigger value="news">News</TabsTrigger>
                <TabsTrigger value="financials">Financials</TabsTrigger>
                <TabsTrigger value="esg">ESG Profile</TabsTrigger>
                <TabsTrigger value="analysis">Analysis</TabsTrigger>
              </TabsList>

              <TabsContent value="news" className="space-y-4">
                <NewsCard
                  title={`${stock.name} Reports Strong Quarterly Earnings`}
                  source="Financial Times"
                  time="2 hours ago"
                  impact={`Positive for ${symbol} (Beat EPS by $0.12)`}
                />
                <NewsCard
                  title={`${stock.industry} Sector Sees Increased Investment`}
                  source="Bloomberg"
                  time="1 day ago"
                  impact={`Potential upside for ${symbol} and peers`}
                />
                <NewsCard
                  title={`Analysts Raise Price Target for ${symbol}`}
                  source="Wall Street Journal"
                  time="3 days ago"
                  impact={`New average price target: $${(stock.price * 1.15).toFixed(2)}`}
                />
              </TabsContent>

              <TabsContent value="financials">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Revenue Growth</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm">Q1 2025</span>
                            <span className="text-sm font-medium">$32.5B</span>
                          </div>
                          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-primary" style={{ width: "85%" }}></div>
                          </div>
                          <div className="text-xs text-muted-foreground">+12.3% YoY</div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm">Q4 2024</span>
                            <span className="text-sm font-medium">$30.1B</span>
                          </div>
                          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-primary" style={{ width: "78%" }}></div>
                          </div>
                          <div className="text-xs text-muted-foreground">+8.7% YoY</div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm">Q3 2024</span>
                            <span className="text-sm font-medium">$28.9B</span>
                          </div>
                          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-primary" style={{ width: "75%" }}></div>
                          </div>
                          <div className="text-xs text-muted-foreground">+7.2% YoY</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Profit Margins</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm">Gross Margin</span>
                            <span className="text-sm font-medium">43.2%</span>
                          </div>
                          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-green-500" style={{ width: "43.2%" }}></div>
                          </div>
                          <div className="text-xs text-muted-foreground">+1.5% YoY</div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm">Operating Margin</span>
                            <span className="text-sm font-medium">28.7%</span>
                          </div>
                          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-green-500" style={{ width: "28.7%" }}></div>
                          </div>
                          <div className="text-xs text-muted-foreground">+0.8% YoY</div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm">Net Margin</span>
                            <span className="text-sm font-medium">21.5%</span>
                          </div>
                          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-green-500" style={{ width: "21.5%" }}></div>
                          </div>
                          <div className="text-xs text-muted-foreground">+0.3% YoY</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="esg">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center">
                        <Leaf className="h-5 w-5 text-green-500 mr-2" />
                        <CardTitle>Environmental</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Carbon Emissions</span>
                          <Badge variant="outline" className="bg-green-500/10 text-green-500">
                            {stock.carbonFootprint}
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Company has committed to carbon neutrality by 2030
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Renewable Energy</span>
                          <Badge variant="outline" className="bg-green-500/10 text-green-500">
                            78% of operations
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground">Increased from 65% last year</div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Water Usage</span>
                          <Badge variant="outline" className="bg-amber-500/10 text-amber-500">
                            12% reduction YoY
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground">Working toward 30% reduction by 2027</div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <div className="flex items-center">
                        <Globe className="h-5 w-5 text-blue-500 mr-2" />
                        <CardTitle>Social</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Diversity & Inclusion</span>
                          <Badge variant="outline" className="bg-green-500/10 text-green-500">
                            Top quartile
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground">45% women in workforce, 38% in leadership</div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Community Investment</span>
                          <Badge variant="outline" className="bg-green-500/10 text-green-500">
                            $125M annually
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground">Focus on education and digital literacy</div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Supply Chain</span>
                          <Badge variant="outline" className="bg-amber-500/10 text-amber-500">
                            85% audited
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground">Working toward 100% ethical sourcing</div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <div className="flex items-center">
                        <TrendingUp className="h-5 w-5 text-purple-500 mr-2" />
                        <CardTitle>Governance</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Board Independence</span>
                          <Badge variant="outline" className="bg-green-500/10 text-green-500">
                            85% independent
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground">Above industry average of 72%</div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Executive Compensation</span>
                          <Badge variant="outline" className="bg-green-500/10 text-green-500">
                            Performance-linked
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground">Includes ESG metrics in executive pay</div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Transparency</span>
                          <Badge variant="outline" className="bg-green-500/10 text-green-500">
                            High disclosure
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground">Comprehensive sustainability reporting</div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="analysis">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Analyst Ratings</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between mb-6">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-green-500">Buy</div>
                          <div className="text-sm text-muted-foreground">Consensus</div>
                        </div>
                        <div className="text-center">
                          <div className="text-3xl font-bold">${(stock.price * 1.15).toFixed(2)}</div>
                          <div className="text-sm text-muted-foreground">Price Target</div>
                        </div>
                        <div className="text-center">
                          <div className="text-3xl font-bold">32</div>
                          <div className="text-sm text-muted-foreground">Analysts</div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center">
                          <div className="w-16 text-sm">Strong Buy</div>
                          <div className="flex-1 mx-2">
                            <div className="h-4 bg-green-500 rounded-full" style={{ width: "45%" }}></div>
                          </div>
                          <div className="w-8 text-sm text-right">45%</div>
                        </div>

                        <div className="flex items-center">
                          <div className="w-16 text-sm">Buy</div>
                          <div className="flex-1 mx-2">
                            <div className="h-4 bg-green-300 rounded-full" style={{ width: "30%" }}></div>
                          </div>
                          <div className="w-8 text-sm text-right">30%</div>
                        </div>

                        <div className="flex items-center">
                          <div className="w-16 text-sm">Hold</div>
                          <div className="flex-1 mx-2">
                            <div className="h-4 bg-amber-300 rounded-full" style={{ width: "20%" }}></div>
                          </div>
                          <div className="w-8 text-sm text-right">20%</div>
                        </div>

                        <div className="flex items-center">
                          <div className="w-16 text-sm">Sell</div>
                          <div className="flex-1 mx-2">
                            <div className="h-4 bg-red-300 rounded-full" style={{ width: "5%" }}></div>
                          </div>
                          <div className="w-8 text-sm text-right">5%</div>
                        </div>

                        <div className="flex items-center">
                          <div className="w-16 text-sm">Strong Sell</div>
                          <div className="flex-1 mx-2">
                            <div className="h-4 bg-red-500 rounded-full" style={{ width: "0%" }}></div>
                          </div>
                          <div className="w-8 text-sm text-right">0%</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Reports</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="p-3 border border-border rounded-lg">
                          <div className="flex justify-between">
                            <h3 className="font-medium">Morgan Stanley</h3>
                            <Badge variant="outline" className="bg-green-500/10 text-green-500">
                              Buy
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground mt-1">
                            Price Target: ${(stock.price * 1.2).toFixed(2)}
                          </div>
                          <div className="text-sm mt-2">
                            "Strong growth potential in emerging markets and continued innovation in product lineup."
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">March 12, 2025</div>
                        </div>

                        <div className="p-3 border border-border rounded-lg">
                          <div className="flex justify-between">
                            <h3 className="font-medium">Goldman Sachs</h3>
                            <Badge variant="outline" className="bg-green-500/10 text-green-500">
                              Buy
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground mt-1">
                            Price Target: ${(stock.price * 1.18).toFixed(2)}
                          </div>
                          <div className="text-sm mt-2">
                            "Expect margin expansion and revenue growth acceleration in the next fiscal year."
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">March 5, 2025</div>
                        </div>

                        <div className="p-3 border border-border rounded-lg">
                          <div className="flex justify-between">
                            <h3 className="font-medium">JP Morgan</h3>
                            <Badge variant="outline" className="bg-amber-500/10 text-amber-500">
                              Hold
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground mt-1">
                            Price Target: ${(stock.price * 1.05).toFixed(2)}
                          </div>
                          <div className="text-sm mt-2">
                            "Valuation appears full at current levels despite solid fundamentals."
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">February 28, 2025</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </main>
  )
}

