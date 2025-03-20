"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Download,
  FileType,
  Check,
  X,
  ChevronRight,
  ChevronLeft,
  BarChart4,
  PieChart,
  TrendingUp,
  Target,
  Lightbulb,
  DollarSign,
  Percent,
  ArrowUpRight,
  Calendar,
  Shield,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function PowerPointIntegration() {
  const [exportStatus, setExportStatus] = useState<"idle" | "generating" | "success" | "error">("idle")
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)

  const slides = [
    {
      title: "Portfolio Performance",
      subtitle: "Q1 2025 Executive Summary",
      icon: <BarChart4 className="h-12 w-12 text-white" />,
      content: "Portfolio Performance",
      bgColor: "from-blue-600 to-blue-800",
      data: {
        ytdReturn: 13.2,
        benchmarkReturn: 9.7,
        alpha: 3.5,
        volatility: 12.4,
        sharpeRatio: 1.8,
        topPerformer: "Technology Sector (+21.4%)",
        underperformer: "Utilities Sector (-2.3%)",
      },
    },
    {
      title: "Asset Allocation",
      subtitle: "Strategic Positioning",
      icon: <PieChart className="h-12 w-12 text-white" />,
      content: "Asset Allocation",
      bgColor: "from-purple-600 to-purple-800",
      data: {
        equities: 62.5,
        fixedIncome: 25.0,
        alternatives: 7.5,
        cash: 5.0,
        domestic: 65,
        international: 35,
        largeCap: 60,
        midCap: 25,
        smallCap: 15,
      },
    },
    {
      title: "Market Analysis",
      subtitle: "Economic Outlook & Trends",
      icon: <TrendingUp className="h-12 w-12 text-white" />,
      content: "Market Analysis",
      bgColor: "from-emerald-600 to-emerald-800",
      data: {
        gdpForecast: 2.7,
        inflationRate: 2.3,
        fedFunds: "4.25-4.50%",
        unemploymentRate: 3.8,
        consumerSentiment: 102.4,
        leadingSectors: ["Technology", "Healthcare", "Consumer Discretionary"],
        marketRisks: ["Geopolitical Tensions", "Inflation Persistence", "Regulatory Changes"],
      },
    },
    {
      title: "Investment Strategy",
      subtitle: "Tactical Recommendations",
      icon: <Target className="h-12 w-12 text-white" />,
      content: "Investment Strategy",
      bgColor: "from-amber-600 to-amber-800",
      data: {
        overweight: ["Artificial Intelligence", "Cybersecurity", "Healthcare Innovation"],
        neutral: ["Consumer Staples", "Financials", "Energy"],
        underweight: ["Utilities", "Traditional Retail", "Basic Materials"],
        thematicOpportunities: ["Renewable Energy", "Digital Transformation", "Aging Population"],
        riskManagement: ["Hedging Strategies", "Diversification", "Alternative Assets"],
      },
    },
    {
      title: "Wealth Planning",
      subtitle: "Comprehensive Approach",
      icon: <Lightbulb className="h-12 w-12 text-white" />,
      content: "Wealth Planning",
      bgColor: "from-red-600 to-red-800",
      data: {
        taxStrategies: ["Tax-Loss Harvesting", "Qualified Dividends", "Municipal Bonds"],
        estatePlanning: ["Trust Structures", "Wealth Transfer", "Charitable Giving"],
        retirementPlanning: ["Contribution Maximization", "Distribution Strategy", "Social Security Optimization"],
        riskManagement: ["Insurance Analysis", "Long-term Care", "Liability Protection"],
      },
    },
  ]

  // Speed up export process simulation
  const handleExport = () => {
    setExportStatus("generating")

    // Simulate export process - reduce from 2000ms to 700ms
    setTimeout(() => {
      setExportStatus("success")
      setShowSuccessMessage(true)

      // Hide success message after 1.5 seconds (was 3)
      setTimeout(() => {
        setShowSuccessMessage(false)
        setExportStatus("idle")
      }, 1500)
    }, 700)
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1))
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1))
  }

  // Helper function to render slide content based on slide type
  const renderSlideContent = (slideIndex: number) => {
    const slide = slides[slideIndex]

    switch (slideIndex) {
      case 0: // Portfolio Performance
        return (
          <div className="flex-1 flex">
            <div className="w-1/2 flex items-center">
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="h-6 w-6 rounded-full bg-white/20 flex items-center justify-center mr-3 mt-0.5">
                    <ArrowUpRight className="h-3 w-3 text-white" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium">Performance Metrics</h4>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-1">
                      <div>
                        <p className="text-white/70 text-xs">YTD Return</p>
                        <p className="text-white text-sm font-medium">+{slide.data.ytdReturn}%</p>
                      </div>
                      <div>
                        <p className="text-white/70 text-xs">Benchmark</p>
                        <p className="text-white text-sm font-medium">+{slide.data.benchmarkReturn}%</p>
                      </div>
                      <div>
                        <p className="text-white/70 text-xs">Alpha</p>
                        <p className="text-white text-sm font-medium">+{slide.data.alpha}%</p>
                      </div>
                      <div>
                        <p className="text-white/70 text-xs">Sharpe Ratio</p>
                        <p className="text-white text-sm font-medium">{slide.data.sharpeRatio}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="h-6 w-6 rounded-full bg-white/20 flex items-center justify-center mr-3 mt-0.5">
                    <Percent className="h-3 w-3 text-white" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium">Sector Performance</h4>
                    <p className="text-white/70 text-sm mt-1">
                      <span className="text-green-300">Top: </span>
                      {slide.data.topPerformer}
                    </p>
                    <p className="text-white/70 text-sm">
                      <span className="text-red-300">Bottom: </span>
                      {slide.data.underperformer}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="h-6 w-6 rounded-full bg-white/20 flex items-center justify-center mr-3 mt-0.5">
                    <Calendar className="h-3 w-3 text-white" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium">Forward Outlook</h4>
                    <p className="text-white/70 text-sm mt-1">
                      Projected annual return: <span className="text-white">8.5-10.2%</span>
                    </p>
                    <p className="text-white/70 text-sm">
                      Risk-adjusted alpha: <span className="text-white">2.1%</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-1/2 flex items-center justify-center">
              <div className="relative">
                <div className="w-64 h-64 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center">
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-48 h-48 relative">
                      {/* Performance chart */}
                      <div className="absolute inset-0">
                        <div className="w-full h-full flex flex-col justify-end">
                          <div className="w-full h-1 bg-white/20"></div>
                          <div className="flex h-40 items-end pt-4">
                            {[
                              { height: 55, label: "Q1", value: 8.2 },
                              { height: 35, label: "Q2", value: 5.1 },
                              { height: 65, label: "Q3", value: 9.8 },
                              { height: 85, label: "Q4", value: 13.2 },
                            ].map((bar, i) => (
                              <div key={i} className="flex-1 flex flex-col items-center">
                                <div
                                  className="w-8 bg-gradient-to-t from-blue-400 to-blue-300 rounded-t-sm"
                                  style={{ height: `${bar.height}%` }}
                                >
                                  <div className="h-1 w-full bg-white/40 rounded-t-sm"></div>
                                </div>
                                <div className="text-white/80 text-xs mt-1">{bar.label}</div>
                                <div className="text-white text-xs font-medium">{bar.value}%</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Benchmark line */}
                      <div className="absolute inset-0 flex items-end">
                        <div className="w-full h-40 relative">
                          <div className="absolute top-[60%] w-full border-t border-dashed border-yellow-400/70 flex justify-end">
                            <div className="bg-yellow-500/20 text-yellow-300 text-xs px-1 rounded">Benchmark</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 1: // Asset Allocation
        return (
          <div className="flex-1 flex">
            <div className="w-1/2 flex items-center">
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="h-6 w-6 rounded-full bg-white/20 flex items-center justify-center mr-3 mt-0.5">
                    <DollarSign className="h-3 w-3 text-white" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium">Asset Class Breakdown</h4>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-1">
                      <div>
                        <p className="text-white/70 text-xs">Equities</p>
                        <p className="text-white text-sm font-medium">{slide.data.equities}%</p>
                      </div>
                      <div>
                        <p className="text-white/70 text-xs">Fixed Income</p>
                        <p className="text-white text-sm font-medium">{slide.data.fixedIncome}%</p>
                      </div>
                      <div>
                        <p className="text-white/70 text-xs">Alternatives</p>
                        <p className="text-white text-sm font-medium">{slide.data.alternatives}%</p>
                      </div>
                      <div>
                        <p className="text-white/70 text-xs">Cash</p>
                        <p className="text-white text-sm font-medium">{slide.data.cash}%</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="h-6 w-6 rounded-full bg-white/20 flex items-center justify-center mr-3 mt-0.5">
                    <Target className="h-3 w-3 text-white" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium">Geographic Exposure</h4>
                    <div className="flex items-center mt-1">
                      <div className="flex-1">
                        <p className="text-white/70 text-xs">Domestic</p>
                        <div className="h-2 bg-white/20 rounded-full mt-1 overflow-hidden">
                          <div
                            className="h-full bg-blue-400 rounded-full"
                            style={{ width: `${slide.data.domestic}%` }}
                          ></div>
                        </div>
                        <p className="text-white text-xs font-medium mt-1">{slide.data.domestic}%</p>
                      </div>
                      <div className="w-4"></div>
                      <div className="flex-1">
                        <p className="text-white/70 text-xs">International</p>
                        <div className="h-2 bg-white/20 rounded-full mt-1 overflow-hidden">
                          <div
                            className="h-full bg-purple-400 rounded-full"
                            style={{ width: `${slide.data.international}%` }}
                          ></div>
                        </div>
                        <p className="text-white text-xs font-medium mt-1">{slide.data.international}%</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="h-6 w-6 rounded-full bg-white/20 flex items-center justify-center mr-3 mt-0.5">
                    <BarChart4 className="h-3 w-3 text-white" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium">Equity Capitalization</h4>
                    <div className="grid grid-cols-3 gap-2 mt-1">
                      <div>
                        <p className="text-white/70 text-xs">Large Cap</p>
                        <p className="text-white text-sm font-medium">{slide.data.largeCap}%</p>
                      </div>
                      <div>
                        <p className="text-white/70 text-xs">Mid Cap</p>
                        <p className="text-white text-sm font-medium">{slide.data.midCap}%</p>
                      </div>
                      <div>
                        <p className="text-white/70 text-xs">Small Cap</p>
                        <p className="text-white text-sm font-medium">{slide.data.smallCap}%</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-1/2 flex items-center justify-center">
              <div className="relative">
                <div className="w-64 h-64 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center">
                  <div className="w-48 h-48 relative">
                    {/* Pie chart visualization */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-40 h-40 rounded-full border-8 border-white/10 relative">
                        {/* Equities slice */}
                        <div
                          className="absolute inset-0 overflow-hidden"
                          style={{ clipPath: "polygon(50% 50%, 50% 0, 100% 0, 100% 100%, 0 100%, 0 50%, 50% 50%)" }}
                        >
                          <div className="absolute inset-0 bg-blue-500 opacity-80"></div>
                        </div>

                        {/* Fixed Income slice */}
                        <div
                          className="absolute inset-0 overflow-hidden"
                          style={{ clipPath: "polygon(50% 50%, 0 50%, 0 0, 50% 0, 50% 50%)" }}
                        >
                          <div className="absolute inset-0 bg-purple-500 opacity-80"></div>
                        </div>

                        {/* Alternatives slice */}
                        <div
                          className="absolute inset-0 overflow-hidden"
                          style={{ clipPath: "polygon(50% 50%, 0 0, 15% 0, 50% 50%)" }}
                        >
                          <div className="absolute inset-0 bg-green-500 opacity-80"></div>
                        </div>

                        {/* Cash slice */}
                        <div
                          className="absolute inset-0 overflow-hidden"
                          style={{ clipPath: "polygon(50% 50%, 15% 0, 25% 0, 50% 50%)" }}
                        >
                          <div className="absolute inset-0 bg-yellow-500 opacity-80"></div>
                        </div>

                        {/* Center circle */}
                        <div className="absolute inset-[15%] bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-white text-xs">Total Assets</div>
                            <div className="text-white font-bold">$2.43M</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Legend */}
                    <div className="absolute -bottom-2 left-0 right-0 flex justify-center">
                      <div className="grid grid-cols-4 gap-2">
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mr-1"></div>
                          <span className="text-white text-xs">Eq</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-purple-500 rounded-full mr-1"></div>
                          <span className="text-white text-xs">FI</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                          <span className="text-white text-xs">Alt</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-yellow-500 rounded-full mr-1"></div>
                          <span className="text-white text-xs">Cash</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 2: // Market Analysis
        return (
          <div className="flex-1 flex">
            <div className="w-1/2 flex items-center">
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="h-6 w-6 rounded-full bg-white/20 flex items-center justify-center mr-3 mt-0.5">
                    <TrendingUp className="h-3 w-3 text-white" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium">Economic Indicators</h4>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-1">
                      <div>
                        <p className="text-white/70 text-xs">GDP Forecast</p>
                        <p className="text-white text-sm font-medium">+{slide.data.gdpForecast}%</p>
                      </div>
                      <div>
                        <p className="text-white/70 text-xs">Inflation Rate</p>
                        <p className="text-white text-sm font-medium">{slide.data.inflationRate}%</p>
                      </div>
                      <div>
                        <p className="text-white/70 text-xs">Fed Funds Rate</p>
                        <p className="text-white text-sm font-medium">{slide.data.fedFunds}</p>
                      </div>
                      <div>
                        <p className="text-white/70 text-xs">Unemployment</p>
                        <p className="text-white text-sm font-medium">{slide.data.unemploymentRate}%</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="h-6 w-6 rounded-full bg-white/20 flex items-center justify-center mr-3 mt-0.5">
                    <ArrowUpRight className="h-3 w-3 text-white" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium">Leading Sectors</h4>
                    <div className="mt-1">
                      {slide.data.leadingSectors.map((sector, i) => (
                        <div key={i} className="flex items-center mb-1">
                          <div className="w-1 h-1 bg-green-400 rounded-full mr-1"></div>
                          <p className="text-white/90 text-sm">{sector}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="h-6 w-6 rounded-full bg-white/20 flex items-center justify-center mr-3 mt-0.5">
                    <Shield className="h-3 w-3 text-white" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium">Market Risks</h4>
                    <div className="mt-1">
                      {slide.data.marketRisks.map((risk, i) => (
                        <div key={i} className="flex items-center mb-1">
                          <div className="w-1 h-1 bg-red-400 rounded-full mr-1"></div>
                          <p className="text-white/90 text-sm">{risk}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-1/2 flex items-center justify-center">
              <div className="relative">
                <div className="w-64 h-64 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center">
                  <div className="w-full h-full p-4">
                    {/* Market trend chart */}
                    <div className="h-full flex flex-col">
                      <div className="text-white text-xs mb-2">S&P 500 Forecast (12-month)</div>

                      <div className="flex-1 relative">
                        {/* Chart grid */}
                        <div className="absolute inset-0 grid grid-rows-4 grid-cols-4">
                          {Array.from({ length: 16 }).map((_, i) => (
                            <div key={i} className="border-[0.5px] border-white/10"></div>
                          ))}
                        </div>

                        {/* Historical line */}
                        <svg
                          className="absolute inset-0 w-full h-full"
                          viewBox="0 0 100 100"
                          preserveAspectRatio="none"
                        >
                          <path
                            d="M0,50 L10,45 L20,48 L30,40 L40,42 L50,35"
                            fill="none"
                            stroke="rgba(255,255,255,0.6)"
                            strokeWidth="1.5"
                          />
                        </svg>

                        {/* Forecast line */}
                        <svg
                          className="absolute inset-0 w-full h-full"
                          viewBox="0 0 100 100"
                          preserveAspectRatio="none"
                        >
                          <path
                            d="M50,35 L60,30 L70,25 L80,28 L90,22 L100,20"
                            fill="none"
                            stroke="rgba(74,222,128,0.8)"
                            strokeWidth="1.5"
                            strokeDasharray="3,2"
                          />

                          {/* Forecast range */}
                          <path
                            d="M50,35 L60,30 L70,25 L80,28 L90,22 L100,20 L100,40 L90,35 L80,40 L70,38 L60,42 L50,35 Z"
                            fill="rgba(74,222,128,0.1)"
                            stroke="none"
                          />
                        </svg>

                        {/* Current marker */}
                        <div className="absolute left-[50%] top-[35%] w-2 h-2 bg-white rounded-full transform -translate-x-1 -translate-y-1"></div>
                      </div>

                      <div className="flex justify-between text-white/70 text-xs mt-2">
                        <div>Q1</div>
                        <div>Q2</div>
                        <div>Q3</div>
                        <div>Q4</div>
                        <div>Q1</div>
                      </div>

                      <div className="flex justify-between mt-4">
                        <div className="flex items-center">
                          <div className="w-2 h-[1px] bg-white/60 mr-1"></div>
                          <span className="text-white/70 text-xs">Historical</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-2 h-[1px] bg-green-400 mr-1 border-t border-dashed"></div>
                          <span className="text-white/70 text-xs">Forecast</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 3: // Investment Strategy
        return (
          <div className="flex-1 flex">
            <div className="w-1/2 flex items-center">
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="h-6 w-6 rounded-full bg-white/20 flex items-center justify-center mr-3 mt-0.5">
                    <ArrowUpRight className="h-3 w-3 text-white" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium">Tactical Positioning</h4>
                    <div className="mt-2 space-y-3">
                      <div>
                        <p className="text-white/90 text-xs font-medium mb-1 flex items-center">
                          <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                          OVERWEIGHT
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {slide.data.overweight.map((item, i) => (
                            <span key={i} className="text-xs bg-green-500/20 text-green-300 px-2 py-0.5 rounded">
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <p className="text-white/90 text-xs font-medium mb-1 flex items-center">
                          <span className="inline-block w-2 h-2 bg-yellow-500 rounded-full mr-1"></span>
                          NEUTRAL
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {slide.data.neutral.map((item, i) => (
                            <span key={i} className="text-xs bg-yellow-500/20 text-yellow-300 px-2 py-0.5 rounded">
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <p className="text-white/90 text-xs font-medium mb-1 flex items-center">
                          <span className="inline-block w-2 h-2 bg-red-500 rounded-full mr-1"></span>
                          UNDERWEIGHT
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {slide.data.underweight.map((item, i) => (
                            <span key={i} className="text-xs bg-red-500/20 text-red-300 px-2 py-0.5 rounded">
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="h-6 w-6 rounded-full bg-white/20 flex items-center justify-center mr-3 mt-0.5">
                    <Target className="h-3 w-3 text-white" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium">Thematic Opportunities</h4>
                    <div className="mt-1">
                      {slide.data.thematicOpportunities.map((theme, i) => (
                        <div key={i} className="flex items-center mb-1">
                          <div className="w-1 h-1 bg-blue-400 rounded-full mr-1"></div>
                          <p className="text-white/90 text-sm">{theme}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-1/2 flex items-center justify-center">
              <div className="relative">
                <div className="w-64 h-64 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center">
                  <div className="w-full h-full p-4">
                    {/* Strategy visualization */}
                    <div className="h-full flex flex-col">
                      <div className="text-white text-xs mb-4 text-center">Strategic Asset Allocation</div>

                      <div className="flex-1 relative">
                        {/* Target visualization */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-48 h-48 relative">
                            {/* Concentric circles */}
                            <div className="absolute inset-0 border-4 border-white/10 rounded-full"></div>
                            <div className="absolute inset-[15%] border-4 border-white/15 rounded-full"></div>
                            <div className="absolute inset-[30%] border-4 border-white/20 rounded-full"></div>
                            <div className="absolute inset-[45%] border-4 border-white/25 rounded-full"></div>
                            <div className="absolute inset-[60%] bg-white/30 rounded-full"></div>

                            {/* Quadrants */}
                            <div className="absolute inset-0">
                              {/* Dividing lines */}
                              <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-white/20 transform -translate-x-[0.5px]"></div>
                              <div className="absolute left-0 right-0 top-1/2 h-[1px] bg-white/20 transform -translate-y-[0.5px]"></div>

                              {/* Labels */}
                              <div className="absolute top-2 left-2 text-white/80 text-xs">Growth</div>
                              <div className="absolute top-2 right-2 text-white/80 text-xs">Value</div>
                              <div className="absolute bottom-2 left-2 text-white/80 text-xs">Defensive</div>
                              <div className="absolute bottom-2 right-2 text-white/80 text-xs">Cyclical</div>

                              {/* Strategy points */}
                              <div className="absolute top-[30%] left-[25%] w-3 h-3 bg-green-500 rounded-full"></div>
                              <div className="absolute top-[40%] right-[35%] w-3 h-3 bg-blue-500 rounded-full"></div>
                              <div className="absolute bottom-[45%] left-[40%] w-3 h-3 bg-yellow-500 rounded-full"></div>
                              <div className="absolute bottom-[25%] right-[30%] w-2 h-2 bg-red-500 rounded-full"></div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-center gap-4 mt-4">
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                          <span className="text-white/70 text-xs">Tech</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mr-1"></div>
                          <span className="text-white/70 text-xs">Health</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-yellow-500 rounded-full mr-1"></div>
                          <span className="text-white/70 text-xs">Cons</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-red-500 rounded-full mr-1"></div>
                          <span className="text-white/70 text-xs">Fin</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 4: // Wealth Planning
        return (
          <div className="flex-1 flex">
            <div className="w-1/2 flex items-center">
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="h-6 w-6 rounded-full bg-white/20 flex items-center justify-center mr-3 mt-0.5">
                    <DollarSign className="h-3 w-3 text-white" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium">Tax Optimization</h4>
                    <div className="mt-1">
                      {slide.data.taxStrategies.map((strategy, i) => (
                        <div key={i} className="flex items-center mb-1">
                          <div className="w-1 h-1 bg-green-400 rounded-full mr-1"></div>
                          <p className="text-white/90 text-sm">{strategy}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="h-6 w-6 rounded-full bg-white/20 flex items-center justify-center mr-3 mt-0.5">
                    <Calendar className="h-3 w-3 text-white" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium">Retirement Planning</h4>
                    <div className="mt-1">
                      {slide.data.retirementPlanning.map((item, i) => (
                        <div key={i} className="flex items-center mb-1">
                          <div className="w-1 h-1 bg-blue-400 rounded-full mr-1"></div>
                          <p className="text-white/90 text-sm">{item}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="h-6 w-6 rounded-full bg-white/20 flex items-center justify-center mr-3 mt-0.5">
                    <Shield className="h-3 w-3 text-white" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium">Estate Planning</h4>
                    <div className="mt-1">
                      {slide.data.estatePlanning.map((item, i) => (
                        <div key={i} className="flex items-center mb-1">
                          <div className="w-1 h-1 bg-purple-400 rounded-full mr-1"></div>
                          <p className="text-white/90 text-sm">{item}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-1/2 flex items-center justify-center">
              <div className="relative">
                <div className="w-64 h-64 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center">
                  <div className="w-full h-full p-4">
                    {/* Wealth planning visualization */}
                    <div className="h-full flex flex-col">
                      <div className="text-white text-xs mb-2 text-center">Wealth Growth Projection</div>

                      <div className="flex-1 relative">
                        {/* Wealth growth chart */}
                        <div className="absolute inset-0 flex items-end">
                          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                            {/* Base area */}
                            <path
                              d="M0,100 L0,70 C10,65 20,62 30,60 C40,58 50,55 60,50 C70,45 80,35 90,20 L100,10 L100,100 Z"
                              fill="rgba(59,130,246,0.2)"
                              stroke="none"
                            />

                            {/* Optimized area */}
                            <path
                              d="M0,70 C10,65 20,62 30,60 C40,58 50,55 60,50 C70,45 80,35 90,20 L100,10"
                              fill="none"
                              stroke="rgba(59,130,246,0.8)"
                              strokeWidth="1.5"
                            />

                            {/* Base line */}
                            <path
                              d="M0,80 C10,78 20,76 30,75 C40,74 50,72 60,70 C70,68 80,65 90,60 L100,55"
                              fill="none"
                              stroke="rgba(255,255,255,0.4)"
                              strokeWidth="1.5"
                              strokeDasharray="2,2"
                            />
                          </svg>

                          {/* Annotations */}
                          <div className="absolute top-[10%] right-[5%] bg-blue-500/20 text-blue-300 text-xs px-1 rounded">
                            Optimized
                          </div>
                          <div className="absolute top-[55%] right-[5%] bg-white/20 text-white/80 text-xs px-1 rounded">
                            Base
                          </div>
                        </div>

                        {/* Age markers */}
                        <div className="absolute bottom-0 left-0 right-0 flex justify-between text-white/60 text-xs">
                          <div>Now</div>
                          <div>+10y</div>
                          <div>+20y</div>
                          <div>+30y</div>
                        </div>

                        {/* Value markers */}
                        <div className="absolute top-0 bottom-8 left-0 flex flex-col justify-between items-start text-white/60 text-xs">
                          <div>$10M</div>
                          <div>$5M</div>
                          <div>$2.5M</div>
                        </div>
                      </div>

                      <div className="mt-4 text-center">
                        <div className="text-white text-xs">Projected Wealth Increase</div>
                        <div className="text-white font-bold text-sm">+42% with Optimized Strategy</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="overflow-hidden shadow-lg">
          <CardContent className="p-0">
            <div className="p-4 border-b bg-gray-50 dark:bg-gray-800">
              <h3 className="font-medium">PowerPoint Preview</h3>
              <p className="text-sm text-muted-foreground mt-1">Preview of your professional presentation</p>
            </div>
            <div className="relative">
              {/* PowerPoint Slide Preview */}
              <div className="aspect-[16/9] bg-white dark:bg-gray-900 border-b relative overflow-hidden">
                {/* Slide Background with Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${slides[currentSlide].bgColor}`}>
                  {/* Decorative Elements */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                  <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>
                </div>

                {/* Slide Content */}
                <div className="absolute inset-0 flex flex-col p-10">
                  {/* Company Logo */}
                  <div className="absolute top-6 right-8 flex items-center">
                    <div className="h-8 w-8 bg-white rounded-full flex items-center justify-center mr-2">
                      <div className="h-6 w-6 bg-primary rounded-full"></div>
                    </div>
                    <span className="text-white font-semibold text-sm">TERMINAL SIX</span>
                  </div>

                  {/* Slide Header */}
                  <div className="mb-6">
                    <h2 className="text-3xl font-bold text-white">{slides[currentSlide].title}</h2>
                    <p className="text-white/80 text-xl">{slides[currentSlide].subtitle}</p>
                  </div>

                  {/* Slide Content - Dynamic based on slide type */}
                  {renderSlideContent(currentSlide)}

                  {/* Slide Footer */}
                  <div className="mt-4 pt-4 flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-white rounded-full mr-1"></div>
                      <p className="text-sm text-white/70">CONFIDENTIAL</p>
                    </div>
                    <p className="text-sm text-white/70">
                      Slide {currentSlide + 1} of {slides.length}
                    </p>
                  </div>
                </div>
              </div>

              {/* Slide Navigation */}
              <div className="flex justify-between p-3 bg-gray-50 dark:bg-gray-800 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={prevSlide}
                  className="transition-all duration-150" // Added faster transition
                >
                  <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                </Button>
                <div className="flex items-center">
                  {slides.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 mx-1 rounded-full cursor-pointer transition-colors ${currentSlide === index ? "bg-primary" : "bg-gray-300 dark:bg-gray-600"}`}
                      onClick={() => setCurrentSlide(index)}
                    />
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={nextSlide}
                  className="transition-all duration-150" // Added faster transition
                >
                  Next <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center mb-6">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                <FileType className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">Export to PowerPoint</h3>
                <p className="text-sm text-muted-foreground">
                  Generate a professional presentation with your portfolio data
                </p>
              </div>
            </div>

            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium">Presentation Type</label>
                <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                  <option>Client Portfolio Review</option>
                  <option>Investment Strategy</option>
                  <option>Performance Report</option>
                  <option>Financial Goals</option>
                  <option>Market Analysis</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Theme</label>
                  <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                    <option>Corporate</option>
                    <option>Executive</option>
                    <option>Modern</option>
                    <option>Minimal</option>
                    <option>Bold</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Time Period</label>
                  <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                    <option>Year to Date</option>
                    <option>Last Quarter</option>
                    <option>Last 12 Months</option>
                    <option>5 Year Projection</option>
                    <option>Custom Range</option>
                  </select>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium">Included Sections</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: "overview", label: "Portfolio Overview", checked: true },
                    { id: "allocation", label: "Asset Allocation", checked: true },
                    { id: "performance", label: "Performance Analysis", checked: true },
                    { id: "goals", label: "Financial Goals", checked: true },
                    { id: "recommendations", label: "Recommendations", checked: true },
                    { id: "market", label: "Market Analysis", checked: false },
                    { id: "risk", label: "Risk Assessment", checked: false },
                    { id: "esg", label: "ESG Analysis", checked: false },
                  ].map((item) => (
                    <div key={item.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={item.id}
                        defaultChecked={item.checked}
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <label htmlFor={item.id} className="text-sm">
                        {item.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium">Branding</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: "logo", label: "Include Logo", checked: true },
                    { id: "colors", label: "Brand Colors", checked: true },
                    { id: "footer", label: "Custom Footer", checked: true },
                    { id: "watermark", label: "Watermark", checked: false },
                  ].map((item) => (
                    <div key={item.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={item.id}
                        defaultChecked={item.checked}
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <label htmlFor={item.id} className="text-sm">
                        {item.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <Button className="w-full" onClick={handleExport} disabled={exportStatus === "generating"}>
                {exportStatus === "generating" ? (
                  <>
                    <div className="animate-spin mr-2 h-4 w-4 border-2 border-background border-t-transparent rounded-full" />
                    Generating Presentation...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Export to PowerPoint
                  </>
                )}
              </Button>

              {showSuccessMessage && (
                <div
                  className={`flex items-center p-3 rounded-md ${exportStatus === "success" ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"}`}
                >
                  {exportStatus === "success" ? (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      <span>PowerPoint presentation generated successfully!</span>
                    </>
                  ) : (
                    <>
                      <X className="h-4 w-4 mr-2" />
                      <span>Error generating presentation. Please try again.</span>
                    </>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-lg">
        <CardContent className="p-6">
          <h3 className="font-medium mb-4">Premium Presentation Templates</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                title: "Executive Summary",
                description: "Comprehensive review for high-level stakeholders",
                color: "bg-blue-500",
                slides: 12,
              },
              {
                title: "Investment Strategy",
                description: "Forward-looking analysis and recommendations",
                color: "bg-purple-500",
                slides: 10,
              },
              {
                title: "Client Portfolio",
                description: "Detailed portfolio analysis and performance",
                color: "bg-emerald-500",
                slides: 15,
              },
            ].map((template, index) => (
              <div
                key={index}
                className="group p-4 border rounded-md hover:border-primary hover:shadow-md cursor-pointer transition-all"
              >
                <div
                  className={`aspect-video ${template.color} rounded-md mb-3 flex items-center justify-center relative overflow-hidden`}
                >
                  <div className="absolute inset-0 bg-black/10"></div>
                  <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                  <FileType className="h-10 w-10 text-white relative z-10" />
                  <div className="absolute bottom-2 left-2 right-2">
                    <div className="h-1 bg-white/30 rounded-full w-3/4 mb-1"></div>
                    <div className="h-1 bg-white/30 rounded-full w-1/2"></div>
                  </div>
                </div>
                <h4 className="font-medium mb-1 group-hover:text-primary transition-colors">{template.title}</h4>
                <p className="text-sm text-muted-foreground mb-3">{template.description}</p>
                <Badge
                  variant="outline"
                  className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                >
                  {template.slides} slides
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

