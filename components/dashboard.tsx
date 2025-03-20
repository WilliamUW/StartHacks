"use client"

import {
  AlertCircle,
  ArrowUpRight,
  BarChart3,
  FileIcon as FilePresentation,
  FileText,
  PieChart,
  TrendingUp,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import ExcelIntegration from "@/components/excel-integration"
import FinancialRoadmap from "@/components/financial-roadmap"
import Link from "next/link"
import NewsCard from "@/components/news-card"
import { NotificationSummary } from "@/components/notification-summary"
import PortfolioChart from "@/components/portfolio-chart"
import PortfolioGlobe from "@/components/portfolio-globe"
import PortfolioPieChart from "@/components/portfolio-pie-chart"
import PowerPointIntegration from "@/components/powerpoint-integration"
import { ScrollArea } from "@/components/ui/scroll-area"
import StockSearch from "@/components/stock-search"

// Mock stock data
const watchlistStocks = [
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    price: 187.68,
    change: 1.23,
    changePercent: 0.66,
    socialCauses: ["Environmental Sustainability", "Privacy & Data Security"],
    industry: "Technology",
    region: "North America",
  },
  {
    symbol: "MSFT",
    name: "Microsoft Corporation",
    price: 390.27,
    change: 2.56,
    changePercent: 0.66,
    socialCauses: ["Carbon Neutrality", "Digital Inclusion"],
    industry: "Technology",
    region: "North America",
  },
  {
    symbol: "GOOGL",
    name: "Alphabet Inc.",
    price: 142.89,
    change: -0.78,
    changePercent: -0.54,
    socialCauses: ["Digital Literacy", "AI Ethics"],
    industry: "Technology",
    region: "North America",
  },
  {
    symbol: "AMZN",
    name: "Amazon.com Inc.",
    price: 178.12,
    change: 0.45,
    changePercent: 0.25,
    socialCauses: ["Climate Pledge", "Economic Opportunity"],
    industry: "Consumer Cyclical",
    region: "North America",
  },
  {
    symbol: "TSLA",
    name: "Tesla, Inc.",
    price: 177.56,
    change: -2.34,
    changePercent: -1.3,
    socialCauses: ["Clean Energy", "Sustainable Transportation"],
    industry: "Automotive",
    region: "North America",
  },
]

// Client preferences
const clientPreferences = {
  socialCauses: ["Environmental Sustainability", "Clean Energy", "Education", "Healthcare Access"],
  industries: ["Technology", "Healthcare", "Renewable Energy", "Sustainable Agriculture"],
  regions: ["North America", "Europe", "Emerging Markets - Asia"],
}

// Portfolio geographical exposure
const portfolioExposure = [
  { region: "North America", percentage: 55 },
  { region: "Europe", percentage: 20 },
  { region: "Asia Pacific", percentage: 15 },
  { region: "Emerging Markets", percentage: 8 },
  { region: "Other", percentage: 2 },
]

export default function Dashboard() {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="border-b border-border p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center">
          <Avatar className="h-12 w-12 mr-4">
            <AvatarImage src="/clients/client1.png" alt="Jane Appleseed" />
            <AvatarFallback>JS</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">Jane Appleseed</h1>
            <div className="flex items-center text-sm text-muted-foreground">
              <span className="mr-3">Portfolio: $2,437,890</span>
              <Badge variant="outline" className="bg-green-500/10 text-green-500 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +13.2% YTD
              </Badge>
              <span className="mx-3 hidden md:inline">|</span>
              <span className="hidden md:inline">Last meeting: March 5, 2025</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <div className="flex-1 md:w-64">
            <StockSearch />
          </div>
          <div className="hidden md:flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-1"
              onClick={() => document.querySelector('[data-value="excel"]')?.click()}
            >
              <FileText className="h-4 w-4" />
              Excel
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-1"
              onClick={() => document.querySelector('[data-value="powerpoint"]')?.click()}
            >
              <FilePresentation className="h-4 w-4" />
              PowerPoint
            </Button>
            <Button size="sm">Schedule Meeting</Button>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-6">
          <Tabs defaultValue="overview">
            <TabsList className="mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
              <TabsTrigger value="roadmap">Financial Roadmap</TabsTrigger>
              <TabsTrigger value="stocks">Stocks</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
              <TabsTrigger value="excel">Excel</TabsTrigger>
              <TabsTrigger value="powerpoint">PowerPoint</TabsTrigger>
              <TabsTrigger value="tax">Tax Planning</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Portfolio Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">$2,437,890</div>
                    <div className="flex items-center mt-1 text-sm">
                      <Badge variant="outline" className="bg-green-500/10 text-green-500 flex items-center mr-2">
                        <ArrowUpRight className="h-3 w-3 mr-1" />
                        +$287,890
                      </Badge>
                      <span className="text-muted-foreground">since last year</span>
                    </div>
                    <div className="mt-4">
                      <div className="h-[150px] w-full">
                        <PortfolioPieChart />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Recent Changes</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                      <div className="flex-1">
                        <div className="text-sm font-medium">Cash position increased</div>
                        <div className="text-xs text-muted-foreground">+$50,000 (50%)</div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        2 days ago
                      </Badge>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                      <div className="flex-1">
                        <div className="text-sm font-medium">Portfolio rebalanced</div>
                        <div className="text-xs text-muted-foreground">Tech sector reduced by 5%</div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        1 week ago
                      </Badge>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-amber-500 mr-2"></div>
                      <div className="flex-1">
                        <div className="text-sm font-medium">Investment goal updated</div>
                        <div className="text-xs text-muted-foreground">House purchase added</div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        2 weeks ago
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <NotificationSummary onViewAll={() => {}} />
              </div>

              <div className="grid grid-cols-1 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle>Portfolio Performance</CardTitle>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          1M
                        </Button>
                        <Button variant="outline" size="sm">
                          3M
                        </Button>
                        <Button variant="outline" size="sm" className="bg-primary/10">
                          YTD
                        </Button>
                        <Button variant="outline" size="sm">
                          1Y
                        </Button>
                        <Button variant="outline" size="sm">
                          5Y
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px] w-full">
                      <PortfolioChart />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Suggested Actions</CardTitle>
                    <CardDescription>Based on client goals and market conditions</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start p-3 rounded-lg border border-border bg-card">
                      <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5 mr-3 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium">Rebalance for House Purchase</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Client needs $50K more for house down payment. Consider selling some growth stocks to increase
                          cash position.
                        </p>
                        <div className="flex gap-2 mt-3">
                          <Button size="sm">View Details</Button>
                          <Button variant="outline" size="sm">
                            Dismiss
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start p-3 rounded-lg border border-border bg-card">
                      <TrendingUp className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium">Opportunity in Clean Energy</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Based on client's interest in sustainable investments, consider allocating 5% to clean energy
                          ETFs.
                        </p>
                        <div className="flex gap-2 mt-3">
                          <Button size="sm">View Details</Button>
                          <Button variant="outline" size="sm">
                            Dismiss
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Recent News</CardTitle>
                    <CardDescription>Relevant to client's portfolio</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <NewsCard
                      title="Fed Signals Rate Cut in Coming Months"
                      source="Financial Times"
                      time="2 hours ago"
                      impact="Positive for bond holdings (23% of portfolio)"
                    />
                    <NewsCard
                      title="Apple Announces New Product Line"
                      source="Bloomberg"
                      time="1 day ago"
                      impact="Potential upside for tech allocation (15% of portfolio)"
                    />
                    <NewsCard
                      title="Housing Market Shows Signs of Cooling"
                      source="Wall Street Journal"
                      time="3 days ago"
                      impact="Relevant to client's house purchase goal"
                    />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="roadmap" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Financial Roadmap</CardTitle>
                  <CardDescription>Jane's journey to financial goals</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[600px]">
                    <FinancialRoadmap />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="portfolio">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle>Asset Allocation</CardTitle>
                    <CardDescription>Current portfolio distribution</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex items-center justify-center">
                        <div className="h-[250px] w-[250px]">
                          <PortfolioPieChart />
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-lg font-medium mb-2">Allocation Details</h3>
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center">
                                <div className="w-3 h-3 bg-[#3b82f6] rounded-full mr-2"></div>
                                <span>Stocks</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium">45%</span>
                                <span className="text-muted-foreground">$1,097,050</span>
                              </div>
                            </div>
                            <div className="flex justify-between items-center">
                              <div className="flex items-center">
                                <div className="w-3 h-3 bg-[#64748b] rounded-full mr-2"></div>
                                <span>Bonds</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium">25%</span>
                                <span className="text-muted-foreground">$609,472</span>
                              </div>
                            </div>
                            <div className="flex justify-between items-center">
                              <div className="flex items-center">
                                <div className="w-3 h-3 bg-[#10b981] rounded-full mr-2"></div>
                                <span>ETFs</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium">15%</span>
                                <span className="text-muted-foreground">$365,683</span>
                              </div>
                            </div>
                            <div className="flex justify-between items-center">
                              <div className="flex items-center">
                                <div className="w-3 h-3 bg-[#f59e0b] rounded-full mr-2"></div>
                                <span>Cash</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium">10%</span>
                                <span className="text-muted-foreground">$243,789</span>
                              </div>
                            </div>
                            <div className="flex justify-between items-center">
                              <div className="flex items-center">
                                <div className="w-3 h-3 bg-[#8b5cf6] rounded-full mr-2"></div>
                                <span>Alternatives</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium">5%</span>
                                <span className="text-muted-foreground">$121,894</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="pt-4">
                          <Button variant="outline" className="w-full">
                            <PieChart className="h-4 w-4 mr-2" />
                            Rebalance Portfolio
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Portfolio Metrics</CardTitle>
                    <CardDescription>Key performance indicators</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-3 border border-border rounded-lg">
                      <div className="text-sm text-muted-foreground">Total Return (YTD)</div>
                      <div className="text-2xl font-bold text-green-500">+13.2%</div>
                      <div className="text-xs text-muted-foreground">vs. S&P 500: +11.1%</div>
                    </div>

                    <div className="p-3 border border-border rounded-lg">
                      <div className="text-sm text-muted-foreground">Volatility (1Y)</div>
                      <div className="text-2xl font-bold">12.4%</div>
                      <div className="text-xs text-muted-foreground">vs. Benchmark: 14.2%</div>
                    </div>

                    <div className="p-3 border border-border rounded-lg">
                      <div className="text-sm text-muted-foreground">Sharpe Ratio</div>
                      <div className="text-2xl font-bold">1.8</div>
                      <div className="text-xs text-muted-foreground">Above average risk-adjusted return</div>
                    </div>

                    <div className="p-3 border border-border rounded-lg">
                      <div className="text-sm text-muted-foreground">Dividend Yield</div>
                      <div className="text-2xl font-bold">2.3%</div>
                      <div className="text-xs text-muted-foreground">$56,071 annual income</div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Geographical Exposure</CardTitle>
                    <CardDescription>Portfolio allocation by region</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="h-[400px] flex items-center justify-center">
                        <PortfolioGlobe />
                      </div>
                      <div>
                        <div className="space-y-4">
                          <h3 className="text-lg font-medium mb-2">Regional Breakdown</h3>
                          {portfolioExposure.map((region, index) => (
                            <div key={index} className="space-y-1">
                              <div className="flex justify-between items-center">
                                <span className="text-sm">{region.region}</span>
                                <span className="text-sm font-medium">{region.percentage}%</span>
                              </div>
                              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                                <div className="h-full bg-primary" style={{ width: `${region.percentage}%` }}></div>
                              </div>
                              <div className="text-xs text-muted-foreground">
                                ${((region.percentage / 100) * 2437890).toLocaleString()}
                              </div>
                            </div>
                          ))}

                          <div className="pt-4">
                            <div className="text-sm text-muted-foreground mb-2">
                              <span className="font-medium">Regional Alignment:</span> 85% match with preferences
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {clientPreferences.regions.map((region, index) => (
                                <Badge key={index} variant="outline" className="bg-muted/50">
                                  {region}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="stocks">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle>Watchlist</CardTitle>
                      <Button size="sm">Add Stock</Button>
                    </div>
                    <CardDescription>Stocks you're monitoring</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-md border">
                      <div className="grid grid-cols-12 gap-4 p-4 text-sm font-medium text-muted-foreground border-b">
                        <div className="col-span-5 md:col-span-4">Symbol / Company</div>
                        <div className="col-span-3 md:col-span-2 text-right">Price</div>
                        <div className="col-span-4 md:col-span-2 text-right">Change</div>
                        <div className="hidden md:block md:col-span-4 text-right">Social Alignment</div>
                      </div>
                      {watchlistStocks.map((stock) => (
                        <Link
                          href={`/stocks/${stock.symbol}`}
                          key={stock.symbol}
                          className="grid grid-cols-12 gap-4 p-4 text-sm border-b hover:bg-muted/50 transition-colors"
                        >
                          <div className="col-span-5 md:col-span-4">
                            <div className="font-medium">{stock.symbol}</div>
                            <div className="text-muted-foreground text-xs truncate">{stock.name}</div>
                            <div className="flex items-center mt-1">
                              <Badge variant="outline" className="text-xs mr-1">
                                {stock.industry}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {stock.region}
                              </Badge>
                            </div>
                          </div>
                          <div className="col-span-3 md:col-span-2 text-right font-medium">
                            ${stock.price.toFixed(2)}
                          </div>
                          <div className="col-span-4 md:col-span-2 text-right">
                            <Badge
                              variant="outline"
                              className={`${
                                stock.change >= 0 ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                              }`}
                            >
                              {stock.change >= 0 ? "+" : ""}
                              {stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
                            </Badge>
                          </div>
                          <div className="hidden md:block md:col-span-4 text-right">
                            <div className="flex flex-wrap justify-end gap-1 mb-1">
                              {stock.socialCauses.slice(0, 2).map((cause, index) => (
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
                            <div className="text-xs text-muted-foreground">
                              {(() => {
                                const matchCount = stock.socialCauses.filter((cause) =>
                                  clientPreferences.socialCauses.includes(cause),
                                ).length
                                const matchPercentage = Math.round(
                                  (matchCount / clientPreferences.socialCauses.length) * 100,
                                )
                                return `${matchPercentage}% match with preferences`
                              })()}
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Market Movers</CardTitle>
                    <CardDescription>Today's biggest gainers and losers</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-medium mb-3">Top Gainers</h3>
                        <div className="space-y-2">
                          {[
                            {
                              symbol: "NVDA",
                              name: "NVIDIA Corporation",
                              change: 5.67,
                              socialCauses: ["AI Ethics", "Energy Efficiency"],
                              industry: "Technology",
                            },
                            {
                              symbol: "META",
                              name: "Meta Platforms, Inc.",
                              change: 3.21,
                              socialCauses: ["Digital Literacy", "Privacy"],
                              industry: "Technology",
                            },
                            {
                              symbol: "MSFT",
                              name: "Microsoft Corporation",
                              change: 2.56,
                              socialCauses: ["Carbon Neutrality", "Digital Inclusion"],
                              industry: "Technology",
                            },
                          ].map((stock) => (
                            <Link
                              href={`/stocks/${stock.symbol}`}
                              key={stock.symbol}
                              className="flex justify-between items-center p-2 rounded-md hover:bg-muted/50 transition-colors"
                            >
                              <div>
                                <div className="font-medium">{stock.symbol}</div>
                                <div className="text-xs text-muted-foreground">{stock.name}</div>
                                <div className="flex items-center mt-1">
                                  <Badge variant="outline" className="text-xs mr-1">
                                    {stock.industry}
                                  </Badge>
                                  {stock.socialCauses.some((cause) =>
                                    clientPreferences.socialCauses.includes(cause),
                                  ) && (
                                    <Badge variant="outline" className="text-xs bg-green-500/10 text-green-500">
                                      Social Match
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              <Badge variant="outline" className="bg-green-500/10 text-green-500">
                                +{stock.change.toFixed(2)}%
                              </Badge>
                            </Link>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h3 className="font-medium mb-3">Top Losers</h3>
                        <div className="space-y-2">
                          {[
                            {
                              symbol: "TSLA",
                              name: "Tesla, Inc.",
                              change: -2.34,
                              socialCauses: ["Clean Energy", "Sustainable Transportation"],
                              industry: "Automotive",
                            },
                            {
                              symbol: "GOOGL",
                              name: "Alphabet Inc.",
                              change: -0.78,
                              socialCauses: ["Digital Literacy", "AI Ethics"],
                              industry: "Technology",
                            },
                            {
                              symbol: "NFLX",
                              name: "Netflix, Inc.",
                              change: -0.45,
                              socialCauses: ["Content Diversity", "Digital Access"],
                              industry: "Entertainment",
                            },
                          ].map((stock) => (
                            <Link
                              href={`/stocks/${stock.symbol}`}
                              key={stock.symbol}
                              className="flex justify-between items-center p-2 rounded-md hover:bg-muted/50 transition-colors"
                            >
                              <div>
                                <div className="font-medium">{stock.symbol}</div>
                                <div className="text-xs text-muted-foreground">{stock.name}</div>
                                <div className="flex items-center mt-1">
                                  <Badge variant="outline" className="text-xs mr-1">
                                    {stock.industry}
                                  </Badge>
                                  {stock.socialCauses.some((cause) =>
                                    clientPreferences.socialCauses.includes(cause),
                                  ) && (
                                    <Badge variant="outline" className="text-xs bg-green-500/10 text-green-500">
                                      Social Match
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              <Badge variant="outline" className="bg-red-500/10 text-red-500">
                                {stock.change.toFixed(2)}%
                              </Badge>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="preferences">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Social Causes</CardTitle>
                    <CardDescription>Client's preferred social impact areas</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {clientPreferences.socialCauses.map((cause, index) => (
                        <div key={index} className="p-3 border border-border rounded-lg">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium">{cause}</h3>
                            <Badge variant="outline" className="bg-green-500/10 text-green-500">
                              Priority {index + 1}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-2">
                            {cause === "Environmental Sustainability" &&
                              "Focus on companies with strong environmental practices and carbon reduction goals."}
                            {cause === "Clean Energy" &&
                              "Invest in renewable energy and companies transitioning to sustainable power sources."}
                            {cause === "Education" &&
                              "Support organizations improving access to quality education and learning resources."}
                            {cause === "Healthcare Access" &&
                              "Prioritize investments in companies expanding healthcare accessibility and affordability."}
                          </p>
                          <div className="mt-3 text-sm">
                            <span className="font-medium">Portfolio Alignment: </span>
                            {cause === "Environmental Sustainability"
                              ? "72%"
                              : cause === "Clean Energy"
                                ? "65%"
                                : cause === "Education"
                                  ? "43%"
                                  : "38%"}
                          </div>
                        </div>
                      ))}
                      <Button variant="outline" className="w-full">
                        Edit Social Preferences
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Industry & Geographic Preferences</CardTitle>
                    <CardDescription>Sectors and regions of interest</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-sm font-medium mb-3">Preferred Industries</h3>
                        <div className="flex flex-wrap gap-2">
                          {clientPreferences.industries.map((industry, index) => (
                            <Badge key={index} variant="secondary" className="text-sm py-1 px-3">
                              {industry}
                            </Badge>
                          ))}
                        </div>
                        <div className="mt-3">
                          <div className="text-sm text-muted-foreground mb-1">Industry Alignment</div>
                          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-primary" style={{ width: "68%" }}></div>
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            68% of portfolio aligned with preferred industries
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium mb-3">Geographic Focus</h3>
                        <div className="flex flex-wrap gap-2">
                          {clientPreferences.regions.map((region, index) => (
                            <Badge key={index} variant="secondary" className="text-sm py-1 px-3">
                              {region}
                            </Badge>
                          ))}
                        </div>
                        <div className="mt-3">
                          <div className="text-sm text-muted-foreground mb-1">Geographic Alignment</div>
                          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-primary" style={{ width: "85%" }}></div>
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            85% of portfolio aligned with preferred regions
                          </div>
                        </div>
                      </div>

                      <div className="pt-2">
                        <Button variant="outline" className="w-full">
                          Edit Industry & Geographic Preferences
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle>ESG Impact Analysis</CardTitle>
                    <CardDescription>Environmental, Social, and Governance metrics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="p-4 border border-border rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-medium">Environmental</h3>
                          <Badge variant="outline" className="bg-green-500/10 text-green-500">
                            A-
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          <div>
                            <div className="text-sm text-muted-foreground">Carbon Footprint</div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">32% below benchmark</span>
                              <Badge variant="outline" className="bg-green-500/10 text-green-500">
                                Good
                              </Badge>
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">Renewable Energy</div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">18% of holdings</span>
                              <Badge variant="outline" className="bg-amber-500/10 text-amber-500">
                                Average
                              </Badge>
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">Water Usage</div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">28% below benchmark</span>
                              <Badge variant="outline" className="bg-green-500/10 text-green-500">
                                Good
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 border border-border rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-medium">Social</h3>
                          <Badge variant="outline" className="bg-amber-500/10 text-amber-500">
                            B+
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          <div>
                            <div className="text-sm text-muted-foreground">Diversity & Inclusion</div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">12% above benchmark</span>
                              <Badge variant="outline" className="bg-green-500/10 text-green-500">
                                Good
                              </Badge>
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">Labor Practices</div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">5% above benchmark</span>
                              <Badge variant="outline" className="bg-amber-500/10 text-amber-500">
                                Average
                              </Badge>
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">Community Impact</div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">8% below benchmark</span>
                              <Badge variant="outline" className="bg-amber-500/10 text-amber-500">
                                Average
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 border border-border rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-medium">Governance</h3>
                          <Badge variant="outline" className="bg-green-500/10 text-green-500">
                            A
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          <div>
                            <div className="text-sm text-muted-foreground">Board Independence</div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">22% above benchmark</span>
                              <Badge variant="outline" className="bg-green-500/10 text-green-500">
                                Good
                              </Badge>
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">Executive Compensation</div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">15% above benchmark</span>
                              <Badge variant="outline" className="bg-green-500/10 text-green-500">
                                Good
                              </Badge>
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">Transparency</div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">18% above benchmark</span>
                              <Badge variant="outline" className="bg-green-500/10 text-green-500">
                                Good
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6">
                      <Button className="w-full">Generate Detailed ESG Report</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="excel" className="space-y-6">
              <ExcelIntegration />
            </TabsContent>

            <TabsContent value="powerpoint" className="space-y-6">
              <PowerPointIntegration />
            </TabsContent>

            <TabsContent value="tax">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Tax Planning</CardTitle>
                    <CardDescription>Optimize tax efficiency</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-3 border border-border rounded-lg">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">Tax-Loss Harvesting Opportunities</h3>
                        <Badge>High Priority</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">
                        Potential tax savings of $12,450 by harvesting losses in underperforming technology stocks.
                      </p>
                      <Button size="sm" className="mt-3">
                        View Details
                      </Button>
                    </div>

                    <div className="p-3 border border-border rounded-lg">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">Capital Gains Projection</h3>
                        <Badge variant="outline">Medium Priority</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">
                        Estimated capital gains of $87,500 for current tax year. Consider deferring additional gains.
                      </p>
                      <Button size="sm" className="mt-3">
                        View Details
                      </Button>
                    </div>

                    <div className="p-3 border border-border rounded-lg">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">Retirement Account Contributions</h3>
                        <Badge variant="outline">Medium Priority</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">
                        Client has $12,000 remaining contribution room for tax-advantaged accounts.
                      </p>
                      <Button size="sm" className="mt-3">
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Tax Efficiency Analysis</CardTitle>
                    <CardDescription>Current portfolio tax metrics</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 border border-border rounded-lg">
                        <div className="text-sm text-muted-foreground">Tax Drag</div>
                        <div className="text-2xl font-bold">0.8%</div>
                        <div className="text-xs text-muted-foreground">Annual return reduction due to taxes</div>
                      </div>

                      <div className="p-3 border border-border rounded-lg">
                        <div className="text-sm text-muted-foreground">Tax-Advantaged %</div>
                        <div className="text-2xl font-bold">42%</div>
                        <div className="text-xs text-muted-foreground">Assets in tax-advantaged accounts</div>
                      </div>

                      <div className="p-3 border border-border rounded-lg">
                        <div className="text-sm text-muted-foreground">Turnover Ratio</div>
                        <div className="text-2xl font-bold">18%</div>
                        <div className="text-xs text-muted-foreground">Annual portfolio turnover</div>
                      </div>

                      <div className="p-3 border border-border rounded-lg">
                        <div className="text-sm text-muted-foreground">Tax Alpha</div>
                        <div className="text-2xl font-bold">1.2%</div>
                        <div className="text-xs text-muted-foreground">Added return from tax strategies</div>
                      </div>
                    </div>

                    <div className="pt-2">
                      <Button variant="outline" className="w-full">
                        <BarChart3 className="h-4 w-4 mr-2" />
                        Generate Tax Optimization Report
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </ScrollArea>
    </div>
  )
}

