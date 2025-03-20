"use client"

import { useEffect, useRef, useState } from "react"

interface StockChartProps {
  symbol: string
  timeframe?: "1D" | "1W" | "1M" | "3M" | "1Y" | "5Y"
  height?: number
}

export default function StockChart({ symbol, timeframe = "1M", height = 300 }: StockChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height })
  const [stockData, setStockData] = useState<{ date: Date; price: number; volume: number }[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch stock data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await fetch('/api/stock', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            companyName: symbol,
            timeframe,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch stock data');
        }

        const { data } = await response.json();

        console.log('Fetched stock data:', data)
        
        // Transform the object data into our required array format
        const transformedData = Object.entries(data).map(([dateStr, item]: [string, any]) => ({
          date: new Date(dateStr),
          price: parseFloat(item.close),
          volume: parseInt(item.vol),
        }));

        // Sort by date to ensure correct order
        transformedData.sort((a, b) => a.date.getTime() - b.date.getTime());

        setStockData(transformedData);
      } catch (err) {
        console.error('Error fetching stock data:', err);
        setError('Failed to load stock data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [symbol, timeframe]);

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const { width } = containerRef.current.getBoundingClientRect()
        setDimensions({ width, height })
      }
    }

    // Initial size
    handleResize()

    // Add resize listener
    window.addEventListener("resize", handleResize)

    // Cleanup
    return () => window.removeEventListener("resize", handleResize)
  }, [height])

  // Draw chart whenever dimensions or data change
  useEffect(() => {
    if (!canvasRef.current || dimensions.width === 0 || stockData.length === 0) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions with device pixel ratio for sharp rendering
    const dpr = window.devicePixelRatio || 1
    canvas.width = dimensions.width * dpr
    canvas.height = dimensions.height * dpr
    ctx.scale(dpr, dpr)

    // Chart dimensions
    const width = dimensions.width
    const chartHeight = dimensions.height
    const padding = {
      top: 20,
      right: Math.max(40, width * 0.05),
      bottom: 30,
      left: Math.max(60, width * 0.08),
    }

    // Find min and max values
    const values = stockData.map((d) => d.price)
    const minValue = Math.min(...values) * 0.98
    const maxValue = Math.max(...values) * 1.02

    // Clear canvas
    ctx.clearRect(0, 0, width, chartHeight)

    // Draw grid lines
    const gridCount = 5
    ctx.strokeStyle = "#e2e8f0"
    ctx.lineWidth = 0.5

    for (let i = 0; i <= gridCount; i++) {
      const y = padding.top + ((chartHeight - padding.top - padding.bottom) * i) / gridCount

      ctx.beginPath()
      ctx.moveTo(padding.left, y)
      ctx.lineTo(width - padding.right, y)
      ctx.stroke()

      // Y-axis labels
      const value = maxValue - ((maxValue - minValue) * i) / gridCount
      ctx.fillStyle = "#64748b"
      ctx.font = `${Math.max(10, Math.min(12, width * 0.025))}px sans-serif`
      ctx.textAlign = "right"
      ctx.fillText(`$${value.toFixed(2)}`, padding.left - 5, y + 3)
    }

    // X-axis labels
    const xLabels = stockData.map(d => {
      const date = new Date(d.date)
      switch (timeframe) {
        case "1D":
          return date.getHours() + ":00"
        case "1W":
          return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][date.getDay()]
        case "1M":
        case "3M":
          return date.getDate().toString()
        case "1Y":
          return ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][date.getMonth()]
        case "5Y":
          return `${["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][date.getMonth()]} ${date.getFullYear()}`
        default:
          return date.toLocaleDateString()
      }
    })

    // Determine how many labels to show based on width
    const skipFactor = width < 500 ? 2 : 1
    const visibleLabels = xLabels.filter((_, i) => i % skipFactor === 0 || i === xLabels.length - 1)

    const xStep = (width - padding.left - padding.right) / (visibleLabels.length - 1)

    ctx.fillStyle = "#64748b"
    ctx.font = `${Math.max(10, Math.min(12, width * 0.025))}px sans-serif`
    ctx.textAlign = "center"

    visibleLabels.forEach((label, i) => {
      const x = padding.left + i * xStep
      ctx.fillText(label, x, chartHeight - padding.bottom + 15)
    })

    // Draw price line
    ctx.strokeStyle = "#3b82f6"
    ctx.lineWidth = 2
    ctx.beginPath()

    stockData.forEach((point, i) => {
      const x = padding.left + ((width - padding.left - padding.right) * i) / (stockData.length - 1)
      const y =
        padding.top +
        (chartHeight - padding.top - padding.bottom) * (1 - (point.price - minValue) / (maxValue - minValue))

      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })

    ctx.stroke()

    // Draw area under the line
    const lastPoint = stockData[stockData.length - 1]
    const lastX = width - padding.right
    const lastY =
      padding.top +
      (chartHeight - padding.top - padding.bottom) * (1 - (lastPoint.price - minValue) / (maxValue - minValue))

    ctx.lineTo(lastX, chartHeight - padding.bottom)
    ctx.lineTo(padding.left, chartHeight - padding.bottom)
    ctx.closePath()

    ctx.fillStyle = "rgba(59, 130, 246, 0.1)"
    ctx.fill()

    // Draw volume bars
    const volumeBarWidth = ((width - padding.left - padding.right) / stockData.length) * 0.8
    const maxVolume = Math.max(...stockData.map((d) => d.volume))
    const volumeScale = (chartHeight - padding.top - padding.bottom) * 0.2

    ctx.fillStyle = "rgba(59, 130, 246, 0.3)"

    stockData.forEach((point, i) => {
      const x =
        padding.left + ((width - padding.left - padding.right) * i) / (stockData.length - 1) - volumeBarWidth / 2
      const volumeHeight = (point.volume / maxVolume) * volumeScale
      const y = chartHeight - padding.bottom - volumeHeight

      ctx.fillRect(x, y, volumeBarWidth, volumeHeight)
    })

    // Draw current price line and label
    const currentPrice = lastPoint.price
    const currentPriceY =
      padding.top +
      (chartHeight - padding.top - padding.bottom) * (1 - (currentPrice - minValue) / (maxValue - minValue))

    ctx.strokeStyle = "#64748b"
    ctx.setLineDash([5, 3])
    ctx.beginPath()
    ctx.moveTo(padding.left, currentPriceY)
    ctx.lineTo(width - padding.right, currentPriceY)
    ctx.stroke()
    ctx.setLineDash([])

    // Price label
    const labelWidth = 38
    ctx.fillStyle = "#1e293b"
    ctx.fillRect(width - padding.right + 1, currentPriceY - 10, labelWidth, 20)
    ctx.fillStyle = "#ffffff"
    ctx.textAlign = "center"
    ctx.fillText(`$${currentPrice.toFixed(2)}`, width - padding.right + labelWidth / 2, currentPriceY + 4)
  }, [dimensions, stockData, timeframe])

  if (loading) {
    return (
      <div ref={containerRef} className="w-full flex items-center justify-center" style={{ height: `${height}px` }}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div ref={containerRef} className="w-full flex items-center justify-center" style={{ height: `${height}px` }}>
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="w-full" style={{ height: `${height}px` }}>
      <canvas ref={canvasRef} style={{ width: "100%", height: "100%" }} className="max-w-full" />
    </div>
  )
}