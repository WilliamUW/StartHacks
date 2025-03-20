import React from "react"
import {
    Loader2,
    Check,
    X,
    AlertTriangle,
    TrendingUp,
    Clock,
    FileSpreadsheet,
    BarChart4,
    PieChart,
    AlertCircle,
    ChevronRight,
    FileText,
    CheckCircle2,
    XCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import StockChart from "@/components/stock-chart"
import PortfolioChart from "@/components/portfolio-chart"
import { Message, ThinkingStep } from "@/app/types"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

interface MessageContentProps {
    message: Message
}

interface Goal {
    title: string
    amount: string
    deadline: string
    progress: number
}

interface News {
    title: string
    source: string
    time: string
}

export function MessageContent({ message }: MessageContentProps) {
    switch (message.type) {
        case "thinking":
            return (
                <div className="space-y-2">
                    {message.thinking?.map((step: ThinkingStep, stepIndex: number) => (
                        <div
                            key={`${message.id}-${stepIndex}-${message.timestamp?.getTime()}`}
                            className="flex items-center gap-2"
                        >
                            {step.status === "loading" ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : step.status === "complete" ? (
                                <Check className="h-4 w-4 text-green-500" />
                            ) : (
                                <X className="h-4 w-4 text-red-500" />
                            )}
                            <span className="text-sm text-muted-foreground">{step.content}</span>
                            {step.result && (
                                <span className="text-sm text-muted-foreground">: {step.result}</span>
                            )}
                        </div>
                    ))}
                </div>
            )

        case "error":
            return (
                <div className="text-red-500 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    <span>{message.content}</span>
                </div>
            )

        case "client-info":
            return (
                <div className="space-y-4">
                    <p className="text-sm">{message.content}</p>

                    <Card className="overflow-hidden">
                        <div className="p-4 flex items-start gap-4">
                            <Avatar className="h-16 w-16">
                                <AvatarImage src="/clients/client1.png" alt={message.data?.name} />
                                <AvatarFallback>JS</AvatarFallback>
                            </Avatar>

                            <div className="flex-1">
                                <h3 className="text-xl font-bold">{message.data?.name}</h3>
                                <div className="flex flex-wrap gap-2 mt-1">
                                    <Badge variant="outline" className="bg-primary/10">
                                        Portfolio: {message.data?.portfolioValue}
                                    </Badge>
                                    <Badge variant="outline" className="bg-green-500/10 text-green-500 flex items-center">
                                        <TrendingUp className="h-3 w-3 mr-1" />
                                        {message.data?.ytdReturn} YTD
                                    </Badge>
                                    <Badge variant="outline" className="bg-muted/50">
                                        Last Contact: {message.data?.lastContact}
                                    </Badge>
                                </div>
                            </div>
                        </div>

                        <div className="border-t p-4">
                            <h4 className="font-medium mb-3">Financial Goals</h4>
                            <div className="space-y-3">
                                {message.data?.goals?.map((goal: Goal, index: number) => (
                                    <div key={index} className="space-y-1">
                                        <div className="flex justify-between">
                                            <span className="text-sm font-medium">{goal.title}</span>
                                            <span className="text-sm text-[#3B82F6]">
                                                {goal.amount} by {goal.deadline}
                                            </span>
                                        </div>
                                        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                                            <div className="h-full bg-[#3B82F6] rounded-full" style={{ width: `${goal.progress}%` }}></div>
                                        </div>
                                        <div className="text-xs text-muted-foreground text-right">{goal.progress}% complete</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="border-t p-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-xl font-bold">Portfolio Value</h3>
                                    <p className="text-3xl font-bold mt-1">{message.data?.totalValue}</p>
                                </div>
                                <div className="text-right">
                                    <h3 className="text-xl font-bold">YTD Return</h3>
                                    <Badge variant="outline" className="bg-green-500/10 text-green-500 text-lg mt-1 px-2 py-1">
                                        {message.data?.ytdReturn}
                                    </Badge>
                                    <p className="text-xs text-muted-foreground mt-1">{message.data?.benchmarkComparison}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {message.data?.allocation && (
                                    <div>
                                        <h4 className="font-medium mb-3">Asset Allocation</h4>
                                        <div className="mt-2 space-y-1 text-sm">
                                            {message.data.allocation.map((item: any, index: number) => (
                                                <div key={index} className="flex justify-between">
                                                    <span>{item.category}</span>
                                                    <span>
                                                        {item.percentage}% ({item.value})
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {message.data?.metrics && (
                                    <div>
                                        <h4 className="font-medium mb-3">Performance Metrics</h4>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="p-3 border rounded-lg text-center">
                                                <div className="text-xs text-muted-foreground">Volatility</div>
                                                <div className="text-lg font-bold">{message.data.metrics.volatility}</div>
                                            </div>
                                            <div className="p-3 border rounded-lg text-center">
                                                <div className="text-xs text-muted-foreground">Sharpe Ratio</div>
                                                <div className="text-lg font-bold">{message.data.metrics.sharpeRatio}</div>
                                            </div>
                                            <div className="p-3 border rounded-lg text-center">
                                                <div className="text-xs text-muted-foreground">Dividend Yield</div>
                                                <div className="text-lg font-bold">{message.data.metrics.dividendYield}</div>
                                            </div>
                                            <div className="p-3 border rounded-lg text-center">
                                                <div className="text-xs text-muted-foreground">Annual Income</div>
                                                <div className="text-lg font-bold">{message.data.metrics.annualIncome}</div>
                                            </div>
                                        </div>

                                        {message.data.topHoldings && (
                                            <>
                                                <h4 className="font-medium mt-4 mb-2">Top Holdings</h4>
                                                <div className="space-y-1 text-sm">
                                                    {message.data.topHoldings.map((holding: any, index: number) => (
                                                        <div key={index} className="flex justify-between">
                                                            <span>
                                                                {holding.symbol} ({holding.name})
                                                            </span>
                                                            <span>
                                                                {holding.value} ({holding.weight})
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="border-t p-4 bg-muted/30">
                            <h4 className="font-medium mb-2">Recent Activity</h4>
                            <p className="text-sm">{message.data.recentActivity}</p>
                        </div>

                        <div className="flex gap-2 mt-4">
                            <Button size="sm" className="bg-[#3B82F6] hover:bg-[#3B82F6]/90">
                                <FileSpreadsheet className="h-4 w-4 mr-1" />
                                Generate Report
                            </Button>
                            <Button variant="outline" size="sm">
                                <BarChart4 className="h-4 w-4 mr-1" />
                                Portfolio Analysis
                            </Button>
                        </div>
                    </Card>
                </div>
            )

        case "stock-info":
            return (
                <div className="space-y-4">
                    <p className="text-sm">{message.content}</p>

                    <Card className="overflow-hidden">
                        <div className="p-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-xl font-bold">{message.data?.symbol}</h3>
                                    <p className="text-sm text-muted-foreground">{message.data?.name}</p>
                                </div>
                                <div className="text-right">
                                    <div className="text-xl font-bold">${message.data?.price?.toFixed(2)}</div>
                                    <Badge
                                        variant="outline"
                                        className={
                                            message.data?.change >= 0 ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                                        }
                                    >
                                        {message.data?.change >= 0 ? "+" : ""}
                                        {message.data?.change?.toFixed(2)} ({message.data?.changePercent?.toFixed(2)}%)
                                    </Badge>
                                </div>
                            </div>

                            <div className="mt-4 h-[200px]">
                                <StockChart symbol={message.data?.symbol} height={200} />
                            </div>
                        </div>

                        <div className="border-t p-4 grid grid-cols-2 gap-4">
                            {message.data && (
                                <div>
                                    <h4 className="font-medium mb-3">Key Metrics</h4>
                                    <div className="grid grid-cols-2 gap-y-2 text-sm">
                                        <div className="text-muted-foreground">Market Cap</div>
                                        <div className="text-right">{message.data.marketCap}</div>
                                        <div className="text-muted-foreground">P/E Ratio</div>
                                        <div className="text-right">{message.data.peRatio}</div>
                                        <div className="text-muted-foreground">Dividend</div>
                                        <div className="text-right">${message.data.dividend}</div>
                                        <div className="text-muted-foreground">EPS</div>
                                        <div className="text-right">${message.data.eps}</div>
                                    </div>
                                </div>
                            )}

                            {message.data && (
                                <div>
                                    <h4 className="font-medium mb-3">Analyst Consensus</h4>
                                    <div className="text-center p-3 bg-muted/30 rounded-lg">
                                        <div className="text-2xl font-bold">{message.data.analystRating}</div>
                                        <div className="text-sm text-muted-foreground">Price Target: ${message.data.priceTarget}</div>
                                    </div>

                                    <div className="mt-3">
                                        <div className="text-sm mb-1">Client Preference Match</div>
                                        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-[#3B82F6] rounded-full"
                                                style={{ width: `${message.data.clientMatch}%` }}
                                            ></div>
                                        </div>
                                        <div className="text-xs text-muted-foreground text-right mt-1">
                                            {message.data.clientMatch}% match
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="border-t p-4">
                            <h4 className="font-medium mb-2">Recent News</h4>
                            <div className="space-y-2">
                                {message.data?.recentNews?.map((news: News, index: number) => (
                                    <div key={index} className="flex justify-between text-sm p-2 hover:bg-muted/30 rounded-md">
                                        <div>{news.title}</div>
                                        <div className="text-muted-foreground text-xs flex items-center">
                                            <Clock className="h-3 w-3 mr-1" />
                                            {news.time}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex gap-2 mt-4">
                            <Button size="sm" className="bg-[#3B82F6] hover:bg-[#3B82F6]/90">Add to Watchlist</Button>
                            <Button variant="outline" size="sm">
                                <TrendingUp className="h-4 w-4 mr-1" />
                                Technical Analysis
                            </Button>
                        </div>
                    </Card>
                </div>
            )

        case "portfolio-info":
            return (
                <div className="space-y-4">
                    <p className="text-sm">{message.content}</p>

                    <Card className="overflow-hidden">
                        <div className="p-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-xl font-bold text-blue-500">Portfolio Value</h3>
                                    <p className="text-3xl font-bold text-blue-500 mt-1">{message.data.totalValue}</p>
                                </div>
                                <div className="text-right">
                                    <h3 className="text-xl font-bold text-blue-500">YTD Return</h3>
                                    <Badge variant="outline" className="bg-green-500/10 text-green-500 text-lg mt-1 px-2 py-1">
                                        {message.data.ytdReturn}
                                    </Badge>
                                    <p className="text-xs text-muted-foreground mt-1">{message.data.benchmarkComparison}</p>
                                </div>
                            </div>

                            <div className="mt-4 h-[250px]">
                                <PortfolioChart />
                            </div>
                        </div>

                        <div className="border-t p-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {message.data && message.data.allocation && (
                                    <div>
                                        <h4 className="font-medium mb-3 text-blue-500">Asset Allocation</h4>
                                        <div className="mt-2 space-y-1 text-sm">
                                            {message.data.allocation.map((item: any, index: number) => (
                                                <div key={index} className="flex justify-between">
                                                    <span className="text-blue-500">{item.category}</span>
                                                    <span>
                                                        {item.percentage}% ({item.value})
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {message.data && message.data.metrics && (
                                    <div>
                                        <h4 className="font-medium mb-3 text-blue-500">Performance Metrics</h4>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="p-3 border rounded-lg text-center">
                                                <div className="text-xs text-muted-foreground">Volatility</div>
                                                <div className="text-lg font-bold text-blue-500">{message.data.metrics.volatility}</div>
                                            </div>
                                            <div className="p-3 border rounded-lg text-center">
                                                <div className="text-xs text-muted-foreground">Sharpe Ratio</div>
                                                <div className="text-lg font-bold text-blue-500">{message.data.metrics.sharpeRatio}</div>
                                            </div>
                                            <div className="p-3 border rounded-lg text-center">
                                                <div className="text-xs text-muted-foreground">Dividend Yield</div>
                                                <div className="text-lg font-bold text-blue-500">{message.data.metrics.dividendYield}</div>
                                            </div>
                                            <div className="p-3 border rounded-lg text-center">
                                                <div className="text-xs text-muted-foreground">Annual Income</div>
                                                <div className="text-lg font-bold text-blue-500">{message.data.metrics.annualIncome}</div>
                                            </div>
                                        </div>

                                        {message.data.topHoldings && (
                                            <>
                                                <h4 className="font-medium mt-4 mb-2 text-blue-500">Top Holdings</h4>
                                                <div className="space-y-1 text-sm">
                                                    {message.data.topHoldings.map((holding: any, index: number) => (
                                                        <div key={index} className="flex justify-between">
                                                            <span className="text-blue-500">
                                                                {holding.symbol} ({holding.name})
                                                            </span>
                                                            <span>
                                                                {holding.value} ({holding.weight})
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <Button size="sm">
                                <FileSpreadsheet className="h-4 w-4 mr-1" />
                                Export Report
                            </Button>
                            <Button variant="outline" size="sm">
                                <PieChart className="h-4 w-4 mr-1" />
                                Rebalance Portfolio
                            </Button>
                        </div>
                    </Card>
                </div>
            )

        case "excel-preview":
            return (
                <div className="space-y-4">
                    <p className="text-sm">{message.content}</p>

                    <Card className="overflow-hidden">
                        <div className="p-4 border-b bg-[#217346] text-white flex justify-between items-center">
                            <div className="flex items-center">
                                <FileSpreadsheet className="h-5 w-5 mr-2" />
                                <h3 className="font-medium">{message.data.fileName}</h3>
                            </div>
                        </div>

                        <div className="p-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h4 className="font-medium mb-2">Sheets</h4>
                                    <div className="space-y-1">
                                        {message.data.sheets.map((sheet: string, index: number) => (
                                            <div key={index} className="flex items-center p-2 hover:bg-muted/30 rounded-md text-sm">
                                                <div
                                                    className={`w-3 h-3 rounded-sm mr-2 ${index === 0
                                                        ? "bg-green-500"
                                                        : index === 1
                                                            ? "bg-blue-500"
                                                            : index === 2
                                                                ? "bg-purple-500"
                                                                : "bg-amber-500"
                                                        }`}
                                                ></div>
                                                {sheet}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h4 className="font-medium mb-2">Report Details</h4>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Total Rows:</span>
                                            <span>{message.data.totalRows}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Total Columns:</span>
                                            <span>{message.data.totalColumns}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">File Size:</span>
                                            <span>2.4 MB</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Created:</span>
                                            <span>{new Date().toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4">
                                <h4 className="font-medium mb-2">Features</h4>
                                <div className="space-y-1">
                                    {message.data.features.map((feature: string, index: number) => (
                                        <div key={index} className="flex items-center text-sm">
                                            <Check className="h-4 w-4 text-green-500 mr-2" />
                                            {feature}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </Card>

                    <div className="flex gap-2">
                        <Button size="sm">Download Excel File</Button>
                        <Button variant="outline" size="sm">
                            <FileSpreadsheet className="h-4 w-4 mr-1" />
                            Open in Excel Online
                        </Button>
                    </div>
                </div>
            )

        case "powerpoint-preview":
            return (
                <div className="space-y-4">
                    <p className="text-sm">{message.content}</p>

                    <Card className="overflow-hidden">
                        <div className="p-4 border-b bg-[#B7472A] text-white flex justify-between items-center">
                            <div className="flex items-center">
                                <FileText className="h-5 w-5 mr-2" />
                                <h3 className="font-medium">{message.data.fileName}</h3>
                            </div>
                        </div>

                        <div className="p-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h4 className="font-medium mb-2">Slides</h4>
                                    <div className="space-y-1">
                                        {message.data.slides.map((slide: string, index: number) => (
                                            <div key={index} className="flex items-center p-2 hover:bg-muted/30 rounded-md text-sm">
                                                <div className="w-5 h-5 rounded-sm bg-[#B7472A]/10 text-[#B7472A] flex items-center justify-center mr-2 text-xs">
                                                    {index + 1}
                                                </div>
                                                {slide}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h4 className="font-medium mb-2">Presentation Details</h4>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Total Slides:</span>
                                            <span>{message.data.totalSlides}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Aspect Ratio:</span>
                                            <span>16:9 Widescreen</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">File Size:</span>
                                            <span>3.8 MB</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Created:</span>
                                            <span>{new Date().toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4">
                                <h4 className="font-medium mb-2">Features</h4>
                                <div className="space-y-1">
                                    {message.data.features.map((feature: string, index: number) => (
                                        <div key={index} className="flex items-center text-sm">
                                            <Check className="h-4 w-4 text-green-500 mr-2" />
                                            {feature}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </Card>

                    <div className="flex gap-2">
                        <Button size="sm">Download PowerPoint</Button>
                        <Button variant="outline" size="sm">
                            <FileText className="h-4 w-4 mr-1" />
                            Open in PowerPoint Online
                        </Button>
                    </div>
                </div>
            )

        case "financial-advice":
            return (
                <div className="space-y-4">
                    <p className="text-sm">{message.content}</p>

                    <Card className="overflow-hidden">
                        <div className="p-4 border-b bg-primary text-primary-foreground flex justify-between items-center">
                            <div className="flex items-center">
                                <AlertCircle className="h-5 w-5 mr-2" />
                                <h3 className="font-medium">Investment Recommendation</h3>
                            </div>
                            <Badge variant="outline" className="bg-white/20 text-white">
                                {message.data.confidence} Confidence
                            </Badge>
                        </div>

                        <div className="p-4 flex items-center justify-center border-b">
                            <div className="text-center">
                                <div className="text-4xl font-bold mb-1 text-blue-500">{message.data.recommendation}</div>
                                <div className="text-sm text-muted-foreground">Recommended Action</div>
                            </div>
                        </div>

                        <div className="p-4">
                            <h4 className="font-medium mb-2">Reasoning</h4>
                            <div className="space-y-1 mb-4">
                                {message.data.reasoning.map((reason: string, index: number) => (
                                    <div key={index} className="flex items-start text-sm">
                                        <div className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center mr-2 flex-shrink-0 mt-0.5 text-xs">
                                            {index + 1}
                                        </div>
                                        {reason}
                                    </div>
                                ))}
                            </div>

                            <h4 className="font-medium mb-2">Alternative Strategies</h4>
                            <div className="space-y-1 mb-4">
                                {message.data.alternatives.map((alternative: string, index: number) => (
                                    <div key={index} className="flex items-center text-sm">
                                        <ChevronRight className="h-4 w-4 text-primary mr-2" />
                                        {alternative}
                                    </div>
                                ))}
                            </div>

                            <h4 className="font-medium mb-2">Risk Factors</h4>
                            <div className="space-y-1">
                                {message.data.risks.map((risk: string, index: number) => (
                                    <div key={index} className="flex items-center text-sm">
                                        <AlertCircle className="h-4 w-4 text-amber-500 mr-2" />
                                        {risk}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Card>

                    <div className="flex gap-2">
                        <Button size="sm">Accept Recommendation</Button>
                        <Button variant="outline" size="sm">
                            Request Alternatives
                        </Button>
                    </div>
                </div>
            )

        default:
            return <p className="whitespace-pre-line">{message.content}</p>
    }
} 