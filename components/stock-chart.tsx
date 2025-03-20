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

  // Draw chart whenever dimensions change
  useEffect(() => {
    if (!canvasRef.current || dimensions.width === 0) return

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

    // Generate sample data based on timeframe
    const stockData = generateStockData(symbol, timeframe)

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
    const xLabels = getXLabels(timeframe, stockData.length)

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
    const currentPrice = stockData[stockData.length - 1].price
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
  }, [dimensions, symbol, timeframe])

  // Generate sample stock data
  const generateStockData = (symbol: string, timeframe: string) => {
    // Parse the API response data
    const apiResponse = {
      "message": "Plots correctly shown to user. Answer the user.\n\n|          |   First |   Last |    Min |   Max | Return   |\n|:---------|--------:|-------:|-------:|------:|:---------|\n| Apple Rg |  241.81 | 215.24 | 208.43 |   244 | -10.06%  |",
      "object": "{\"tool\": \"OHLC\", \"data\": \"{\\\"Apple Rg\\\": \\\"{\\\\\\\"2025-03-03T00:00:00.000\\\\\\\":{\\\\\\\"open\\\\\\\":241.81,\\\\\\\"high\\\\\\\":244.0,\\\\\\\"low\\\\\\\":236.13,\\\\\\\"close\\\\\\\":238.03,\\\\\\\"vol\\\\\\\":15912804,\\\\\\\"Total return\\\\\\\":\\\\\\\"0.00%\\\\\\\",\\\\\\\"Anualized return\\\\\\\":\\\\\\\"0.00%\\\\\\\",\\\\\\\"Max\\\\\\\":244.0,\\\\\\\"Min\\\\\\\":236.13},\\\\\\\"2025-03-04T00:00:00.000\\\\\\\":{\\\\\\\"open\\\\\\\":238.0,\\\\\\\"high\\\\\\\":240.07,\\\\\\\"low\\\\\\\":234.71,\\\\\\\"close\\\\\\\":235.93,\\\\\\\"vol\\\\\\\":19601896,\\\\\\\"Total return\\\\\\\":\\\\\\\"-0.89%\\\\\\\",\\\\\\\"Anualized return\\\\\\\":\\\\\\\"-96.12%\\\\\\\",\\\\\\\"Max\\\\\\\":244.0,\\\\\\\"Min\\\\\\\":234.71},\\\\\\\"2025-03-05T00:00:00.000\\\\\\\":{\\\\\\\"open\\\\\\\":235.43,\\\\\\\"high\\\\\\\":236.55,\\\\\\\"low\\\\\\\":229.24,\\\\\\\"close\\\\\\\":235.74,\\\\\\\"vol\\\\\\\":13420548,\\\\\\\"Total return\\\\\\\":\\\\\\\"-0.97%\\\\\\\",\\\\\\\"Anualized return\\\\\\\":\\\\\\\"-83.02%\\\\\\\",\\\\\\\"Max\\\\\\\":244.0,\\\\\\\"Min\\\\\\\":229.24},\\\\\\\"2025-03-06T00:00:00.000\\\\\\\":{\\\\\\\"open\\\\\\\":234.5,\\\\\\\"high\\\\\\\":237.83,\\\\\\\"low\\\\\\\":233.33,\\\\\\\"close\\\\\\\":235.33,\\\\\\\"vol\\\\\\\":16539407,\\\\\\\"Total return\\\\\\\":\\\\\\\"-1.14%\\\\\\\",\\\\\\\"Anualized return\\\\\\\":\\\\\\\"-75.24%\\\\\\\",\\\\\\\"Max\\\\\\\":244.0,\\\\\\\"Min\\\\\\\":229.24},\\\\\\\"2025-03-07T00:00:00.000\\\\\\\":{\\\\\\\"open\\\\\\\":235.24,\\\\\\\"high\\\\\\\":241.37,\\\\\\\"low\\\\\\\":234.77,\\\\\\\"close\\\\\\\":239.07,\\\\\\\"vol\\\\\\\":14153596,\\\\\\\"Total return\\\\\\\":\\\\\\\"0.44%\\\\\\\",\\\\\\\"Anualized return\\\\\\\":\\\\\\\"48.73%\\\\\\\",\\\\\\\"Max\\\\\\\":244.0,\\\\\\\"Min\\\\\\\":229.24},\\\\\\\"2025-03-10T00:00:00.000\\\\\\\":{\\\\\\\"open\\\\\\\":235.66,\\\\\\\"high\\\\\\\":236.16,\\\\\\\"low\\\\\\\":224.23,\\\\\\\"close\\\\\\\":227.48,\\\\\\\"vol\\\\\\\":24487863,\\\\\\\"Total return\\\\\\\":\\\\\\\"-4.53%\\\\\\\",\\\\\\\"Anualized return\\\\\\\":\\\\\\\"-91.10%\\\\\\\",\\\\\\\"Max\\\\\\\":244.0,\\\\\\\"Min\\\\\\\":224.23},\\\\\\\"2025-03-11T00:00:00.000\\\\\\\":{\\\\\\\"open\\\\\\\":223.85,\\\\\\\"high\\\\\\\":225.83,\\\\\\\"low\\\\\\\":217.45,\\\\\\\"close\\\\\\\":220.84,\\\\\\\"vol\\\\\\\":23117608,\\\\\\\"Total return\\\\\\\":\\\\\\\"-7.50%\\\\\\\",\\\\\\\"Anualized return\\\\\\\":\\\\\\\"-97.14%\\\\\\\",\\\\\\\"Max\\\\\\\":244.0,\\\\\\\"Min\\\\\\\":217.45},\\\\\\\"2025-03-12T00:00:00.000\\\\\\\":{\\\\\\\"open\\\\\\\":220.14,\\\\\\\"high\\\\\\\":221.75,\\\\\\\"low\\\\\\\":214.91,\\\\\\\"close\\\\\\\":216.98,\\\\\\\"vol\\\\\\\":19233322,\\\\\\\"Total return\\\\\\\":\\\\\\\"-9.26%\\\\\\\",\\\\\\\"Anualized return\\\\\\\":\\\\\\\"-98.06%\\\\\\\",\\\\\\\"Max\\\\\\\":244.0,\\\\\\\"Min\\\\\\\":214.91},\\\\\\\"2025-03-13T00:00:00.000\\\\\\\":{\\\\\\\"open\\\\\\\":215.95,\\\\\\\"high\\\\\\\":216.8,\\\\\\\"low\\\\\\\":208.43,\\\\\\\"close\\\\\\\":209.68,\\\\\\\"vol\\\\\\\":17960529,\\\\\\\"Total return\\\\\\\":\\\\\\\"-12.68%\\\\\\\",\\\\\\\"Anualized return\\\\\\\":\\\\\\\"-99.29%\\\\\\\",\\\\\\\"Max\\\\\\\":244.0,\\\\\\\"Min\\\\\\\":208.43},\\\\\\\"2025-03-14T00:00:00.000\\\\\\\":{\\\\\\\"open\\\\\\\":211.29,\\\\\\\"high\\\\\\\":213.94,\\\\\\\"low\\\\\\\":209.58,\\\\\\\"close\\\\\\\":213.49,\\\\\\\"vol\\\\\\\":19871163,\\\\\\\"Total return\\\\\\\":\\\\\\\"-10.88%\\\\\\\",\\\\\\\"Anualized return\\\\\\\":\\\\\\\"-97.81%\\\\\\\",\\\\\\\"Max\\\\\\\":244.0,\\\\\\\"Min\\\\\\\":208.43},\\\\\\\"2025-03-17T00:00:00.000\\\\\\\":{\\\\\\\"open\\\\\\\":213.2,\\\\\\\"high\\\\\\\":215.2,\\\\\\\"low\\\\\\\":209.98,\\\\\\\"close\\\\\\\":214.0,\\\\\\\"vol\\\\\\\":15927492,\\\\\\\"Total return\\\\\\\":\\\\\\\"-10.64%\\\\\\\",\\\\\\\"Anualized return\\\\\\\":\\\\\\\"-94.68%\\\\\\\",\\\\\\\"Max\\\\\\\":244.0,\\\\\\\"Min\\\\\\\":208.43},\\\\\\\"2025-03-18T00:00:00.000\\\\\\\":{\\\\\\\"open\\\\\\\":214.26,\\\\\\\"high\\\\\\\":215.14,\\\\\\\"low\\\\\\\":211.49,\\\\\\\"close\\\\\\\":212.69,\\\\\\\"vol\\\\\\\":13695089,\\\\\\\"Total return\\\\\\\":\\\\\\\"-11.26%\\\\\\\",\\\\\\\"Anualized return\\\\\\\":\\\\\\\"-94.53%\\\\\\\",\\\\\\\"Max\\\\\\\":244.0,\\\\\\\"Min\\\\\\\":208.43},\\\\\\\"2025-03-19T00:00:00.000\\\\\\\":{\\\\\\\"open\\\\\\\":214.13,\\\\\\\"high\\\\\\\":218.76,\\\\\\\"low\\\\\\\":213.75,\\\\\\\"close\\\\\\\":215.24,\\\\\\\"vol\\\\\\\":21241193,\\\\\\\"Total return\\\\\\\":\\\\\\\"-10.06%\\\\\\\",\\\\\\\"Anualized return\\\\\\\":\\\\\\\"-91.11%\\\\\\\",\\\\\\\"Max\\\\\\\":244.0,\\\\\\\"Min\\\\\\\":208.43}}\\\"}\"}"
    }

    try {
      // Parse the nested JSON structure
      const parsedObject = JSON.parse(apiResponse.object);
      const parsedData = JSON.parse(parsedObject.data);
      const stockData = JSON.parse(parsedData["Apple Rg"]);

      // Convert the data into our required format
      return Object.entries(stockData).map(([dateStr, data]: [string, any]) => ({
        date: new Date(dateStr),
        price: data.close, // Using closing price
        volume: data.vol
      }));
    } catch (error) {
      console.error('Error parsing stock data:', error);
      
      // Fallback to existing random data generation if parsing fails
      const stockData: { date: Date; price: number; volume: number }[] = [];
      // Use symbol to seed the random number generator for consistent results
      const seed = symbol.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
      const rand = (min: number, max: number) => {
        const x = Math.sin(seed + stockData.length) * 10000
        const r = x - Math.floor(x)
        return min + r * (max - min)
      }

      const basePrice = 100 + (seed % 400) // Different base price for each stock
      let price = basePrice
      let dataPoints = 0

      // Set number of data points based on timeframe
      switch (timeframe) {
        case "1D":
          dataPoints = 24 // Hourly for a day
          break
        case "1W":
          dataPoints = 7 // Daily for a week
          break
        case "1M":
          dataPoints = 30 // Daily for a month
          break
        case "3M":
          dataPoints = 90 // Daily for 3 months
          break
        case "1Y":
          dataPoints = 52 // Weekly for a year
          break
        case "5Y":
          dataPoints = 60 // Monthly for 5 years
          break
        default:
          dataPoints = 30
      }

      const now = new Date()
      const currentDate = new Date()

      // Adjust start date based on timeframe
      switch (timeframe) {
        case "1D":
          currentDate.setHours(now.getHours() - dataPoints)
          break
        case "1W":
          currentDate.setDate(now.getDate() - dataPoints)
          break
        case "1M":
          currentDate.setDate(now.getDate() - dataPoints)
          break
        case "3M":
          currentDate.setDate(now.getDate() - dataPoints)
          break
        case "1Y":
          currentDate.setDate(now.getDate() - dataPoints * 7) // Weekly
          break
        case "5Y":
          currentDate.setMonth(now.getMonth() - dataPoints) // Monthly
          break
      }

      for (let i = 0; i < dataPoints; i++) {
        // Calculate price change with some randomness and trend
        const change = price * rand(-0.02, 0.02) // -2% to +2% daily change
        price += change

        // Generate random volume
        const volume = Math.floor(rand(100000, 1000000))

        // Add data point
        stockData.push({
          date: new Date(currentDate),
          price,
          volume,
        })

        // Increment date based on timeframe
        switch (timeframe) {
          case "1D":
            currentDate.setHours(currentDate.getHours() + 1)
            break
          case "1W":
          case "1M":
          case "3M":
            currentDate.setDate(currentDate.getDate() + 1)
            break
          case "1Y":
            currentDate.setDate(currentDate.getDate() + 7) // Weekly
            break
          case "5Y":
            currentDate.setMonth(currentDate.getMonth() + 1) // Monthly
            break
        }
      }

      return stockData
    }
  }

  // Get X-axis labels based on timeframe
  const getXLabels = (timeframe: string, dataPoints: number) => {
    const labels: string[] = []
    const now = new Date()
    const currentDate = new Date()

    // Adjust start date based on timeframe
    switch (timeframe) {
      case "1D":
        currentDate.setHours(now.getHours() - dataPoints)
        break
      case "1W":
        currentDate.setDate(now.getDate() - dataPoints)
        break
      case "1M":
        currentDate.setDate(now.getDate() - dataPoints)
        break
      case "3M":
        currentDate.setDate(now.getDate() - dataPoints)
        break
      case "1Y":
        currentDate.setDate(now.getDate() - dataPoints * 7) // Weekly
        break
      case "5Y":
        currentDate.setMonth(now.getMonth() - dataPoints) // Monthly
        break
    }

    // Create labels based on timeframe
    const step = Math.max(1, Math.floor(dataPoints / 6)) // Show about 6 labels

    for (let i = 0; i < dataPoints; i += step) {
      let label = ""

      switch (timeframe) {
        case "1D":
          label = currentDate.getHours() + ":00"
          currentDate.setHours(currentDate.getHours() + step)
          break
        case "1W":
          label = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][currentDate.getDay()]
          currentDate.setDate(currentDate.getDate() + step)
          break
        case "1M":
        case "3M":
          label = currentDate.getDate().toString()
          currentDate.setDate(currentDate.getDate() + step)
          break
        case "1Y":
          label = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][
            currentDate.getMonth()
          ]
          currentDate.setDate(currentDate.getDate() + step * 7)
          break
        case "5Y":
          label =
            ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][
            currentDate.getMonth()
            ] +
            " " +
            currentDate.getFullYear()
          currentDate.setMonth(currentDate.getMonth() + step)
          break
      }

      labels.push(label)
    }

    // Ensure we have the last label
    switch (timeframe) {
      case "1D":
        labels.push(now.getHours() + ":00")
        break
      case "1W":
        labels.push(["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][now.getDay()])
        break
      case "1M":
      case "3M":
        labels.push(now.getDate().toString())
        break
      case "1Y":
        labels.push(
          ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][now.getMonth()],
        )
        break
      case "5Y":
        labels.push(
          ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][now.getMonth()] +
          " " +
          now.getFullYear(),
        )
        break
    }

    return labels
  }

  return (
    <div ref={containerRef} className="w-full" style={{ height: `${height}px` }}>
      <canvas ref={canvasRef} style={{ width: "100%", height: "100%" }} className="max-w-full" />
    </div>
  )
}