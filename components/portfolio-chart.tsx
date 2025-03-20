"use client"

import { useEffect, useState } from "react"
import {
  Area,
  Line,
  ComposedChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

export default function PortfolioChart() {
  const [data, setData] = useState<any[]>([])

  useEffect(() => {
    // Generate market conditions that will affect both portfolio and benchmark
    const marketConditions = generateMarketConditions()

    // Generate data with correlation to market conditions
    const portfolioData = generatePortfolioData(marketConditions)
    const benchmarkData = generateBenchmarkData(marketConditions)

    // Combine data for the chart
    const chartData = portfolioData.map((point, index) => ({
      month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][point.month],
      portfolio: point.value,
      benchmark: benchmarkData[index].value,
    }))

    setData(chartData)
  }, [])

  // Generate market conditions that will influence both portfolio and benchmark
  const generateMarketConditions = () => {
    const conditions = []

    // Start with neutral market
    let marketSentiment = 0

    for (let i = 0; i < 12; i++) {
      // Market sentiment has some momentum (previous month influences next month)
      marketSentiment = marketSentiment * 0.6 + (Math.random() - 0.5) * 0.4

      // Add seasonal effects
      const seasonalEffect = Math.sin(((i + 3) / 12) * Math.PI * 2) * 0.1 // Slight seasonal bias

      // Add some key events
      const events: Record<number, number> = {
        // Positive earnings season in Q2
        5: 0.2,
        // Market dip in September (common pattern)
        8: -0.15,
        // Year-end rally
        11: 0.1
      }

      const eventEffect = events[i] || 0

      conditions.push({
        sentiment: marketSentiment + seasonalEffect + eventEffect,
        volatility: 0.8 + Math.random() * 0.4 // Random volatility between 0.8 and 1.2
      })
    }

    return conditions
  }

  // Generate sample portfolio data with correlation to market conditions
  const generatePortfolioData = (marketConditions: any[]) => {
    const baseValue = 2000000
    const data = []
    let value = baseValue
    let cumulativeReturn = 0

    for (let i = 0; i < 12; i++) {
      if (i > 0) {
        const condition = marketConditions[i]

        // Portfolio has lower correlation with market and higher potential returns
        const marketEffect = condition.sentiment * (1.5 + Math.random() * 0.5)
        const specificEffect = (Math.random() - 0.3) * condition.volatility * 1.2 // Higher specific risk, positive bias

        // Monthly return calculation with higher volatility
        const monthlyReturn = (marketEffect + specificEffect) * 2.5
        cumulativeReturn += monthlyReturn
        value = baseValue * (1 + cumulativeReturn / 100)

        // Less aggressive mean reversion for more trending behavior
        if (value > baseValue * 1.4) {
          value *= 0.997
        } else if (value < baseValue * 0.8) {
          value *= 1.003
        }
      }

      data.push({ month: i, value: Math.round(value) })
    }

    return data
  }

  // Generate sample benchmark data (S&P 500) with realistic movements
  const generateBenchmarkData = (marketConditions: any[]) => {
    const baseValue = 2000000
    const data = []
    let value = baseValue
    let cumulativeReturn = 0

    for (let i = 0; i < 12; i++) {
      if (i > 0) {
        const condition = marketConditions[i]

        // S&P 500 follows market conditions more closely with lower volatility
        const marketEffect = condition.sentiment * 1.2
        const specificEffect = (Math.random() - 0.5) * condition.volatility * 0.5

        // Monthly return calculation with lower volatility
        const monthlyReturn = (marketEffect + specificEffect) * 1.8
        cumulativeReturn += monthlyReturn
        value = baseValue * (1 + cumulativeReturn / 100)

        // Stronger mean reversion for more stable behavior
        if (value > baseValue * 1.25) {
          value *= 0.998
        } else if (value < baseValue * 0.85) {
          value *= 1.002
        }
      }

      data.push({ month: i, value: Math.round(value) })
    }

    return data
  }

  const formatYAxis = (value: number) => {
    return `$${(value / 1000).toFixed(0)}k`
  }

  const formatTooltipValue = (value: number) => {
    return `$${value.toLocaleString()}`
  }

  return (
    <div className="w-full h-[250px]">
      <ResponsiveContainer width="100%" height="100%" debounce={1}>
        <ComposedChart data={data} margin={{ top: 50, right: 20, left: 15, bottom: 20 }}>
          <defs>
            <linearGradient id="portfolioGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#60A5FA" stopOpacity={0.15} />
              <stop offset="100%" stopColor="#60A5FA" stopOpacity={0.01} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="rgba(255, 255, 255, 0.05)"
          />
          <XAxis
            dataKey="month"
            axisLine={{ stroke: 'rgba(255, 255, 255, 0.1)' }}
            tick={{ fill: 'rgba(255, 255, 255, 0.5)', fontSize: 12 }}
            tickLine={{ stroke: 'rgba(255, 255, 255, 0.1)' }}
            padding={{ left: 0, right: 0 }}
            dy={10}
          />
          <YAxis
            tickFormatter={formatYAxis}
            axisLine={{ stroke: 'rgba(255, 255, 255, 0.1)' }}
            tick={{ fill: 'rgba(255, 255, 255, 0.5)', fontSize: 12 }}
            tickLine={{ stroke: 'rgba(255, 255, 255, 0.1)' }}
            width={55}
            dx={-5}
            domain={[(dataMin: number) => Math.floor(dataMin * 0.995), (dataMax: number) => Math.ceil(dataMax * 1.005)]}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(17, 25, 40, 0.95)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '6px',
              padding: '8px 12px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
            }}
            formatter={(value: number, name: string) => [
              formatTooltipValue(value),
              name === 'Portfolio'
            ]}
            labelStyle={{ color: 'rgba(255, 255, 255, 0.7)', marginBottom: '4px', fontWeight: 500 }}
            itemStyle={{ color: 'rgba(255, 255, 255, 0.9)', padding: '2px 0' }}
          />
          <Area
            type="monotone"
            dataKey="portfolio"
            stroke="#60A5FA"
            strokeWidth={2}
            fill="url(#portfolioGradient)"
            name="Portfolio"
            isAnimationActive={true}
            animationDuration={1000}
            dot={false}
            activeDot={{ r: 4, fill: '#60A5FA', stroke: '#fff', strokeWidth: 2 }}
          />
          <Line
            type="monotone"
            dataKey="benchmark"
            stroke="rgba(255, 255, 255, 0.6)"
            strokeWidth={1.5}
            dot={false}
            name="S&P 500"
            isAnimationActive={true}
            animationDuration={1000}
            activeDot={{ r: 4, fill: '#fff', stroke: '#fff', strokeWidth: 2 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
      <div className="absolute top-3 right-4 flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-[2px] bg-[#60A5FA]"></div>
          <span className="text-[12px] text-white/90">Portfolio</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-[2px] bg-white/60"></div>
          <span className="text-[12px] text-white/90">S&P 500</span>
        </div>
      </div>
    </div>
  )
}