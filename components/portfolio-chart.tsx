"use client"

import { useEffect, useRef, useState } from "react"

export default function PortfolioChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect()
        setDimensions({ width, height })
      }
    }

    // Initial size
    handleResize()

    // Add resize listener
    window.addEventListener("resize", handleResize)

    // Cleanup
    return () => window.removeEventListener("resize", handleResize)
  }, [])

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

    // Clear canvas
    ctx.clearRect(0, 0, dimensions.width, dimensions.height)

    // Chart dimensions
    const width = dimensions.width
    const height = dimensions.height
    const padding = {
      top: 20,
      right: Math.max(40, width * 0.05),
      bottom: 40,
      left: Math.max(60, width * 0.08),
    }

    // Generate sample data
    const portfolioData = generatePortfolioData()
    const benchmarkData = generateBenchmarkData()

    // Find min and max values
    const allValues = [...portfolioData.map((d) => d.value), ...benchmarkData.map((d) => d.value)]
    const minValue = Math.min(...allValues) * 0.95
    const maxValue = Math.max(...allValues) * 1.05

    // Draw axes
    ctx.strokeStyle = "#e2e8f0"
    ctx.lineWidth = 1

    // X-axis
    ctx.beginPath()
    ctx.moveTo(padding.left, height - padding.bottom)
    ctx.lineTo(width - padding.right, height - padding.bottom)
    ctx.stroke()

    // Y-axis
    ctx.beginPath()
    ctx.moveTo(padding.left, padding.top)
    ctx.lineTo(padding.left, height - padding.bottom)
    ctx.stroke()

    // Draw grid lines
    const gridCount = 5
    ctx.strokeStyle = "#e2e8f0"
    ctx.lineWidth = 0.5

    for (let i = 1; i <= gridCount; i++) {
      const y = padding.top + (height - padding.top - padding.bottom) * (i / gridCount)

      ctx.beginPath()
      ctx.moveTo(padding.left, y)
      ctx.lineTo(width - padding.right, y)
      ctx.stroke()

      // Y-axis labels
      const value = maxValue - (maxValue - minValue) * (i / gridCount)
      ctx.fillStyle = "#64748b"
      ctx.font = `${Math.max(10, Math.min(12, width * 0.025))}px sans-serif`
      ctx.textAlign = "right"
      ctx.fillText(`$${Math.round(value).toLocaleString()}`, padding.left - 5, y + 3)
    }

    // X-axis labels (months)
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    const xStep = (width - padding.left - padding.right) / (months.length - 1)

    ctx.fillStyle = "#64748b"
    ctx.font = `${Math.max(10, Math.min(12, width * 0.025))}px sans-serif`
    ctx.textAlign = "center"

    // Determine how many labels to show based on width
    const skipFactor = width < 500 ? 2 : 1

    months.forEach((month, i) => {
      if (i % skipFactor === 0 || i === months.length - 1) {
        const x = padding.left + i * xStep
        ctx.fillText(month, x, height - padding.bottom + 15)
      }
    })

    // Draw portfolio line
    ctx.strokeStyle = "#3b82f6"
    ctx.lineWidth = 2
    ctx.beginPath()

    portfolioData.forEach((point, i) => {
      const x = padding.left + (width - padding.left - padding.right) * (i / (portfolioData.length - 1))
      const y =
        height -
        padding.bottom -
        (height - padding.top - padding.bottom) * ((point.value - minValue) / (maxValue - minValue))

      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })

    ctx.stroke()

    // Draw portfolio area
    const lastPoint = portfolioData[portfolioData.length - 1]
    const lastX = padding.left + (width - padding.left - padding.right)
    const lastY =
      height -
      padding.bottom -
      (height - padding.top - padding.bottom) * ((lastPoint.value - minValue) / (maxValue - minValue))

    ctx.lineTo(lastX, height - padding.bottom)
    ctx.lineTo(padding.left, height - padding.bottom)
    ctx.closePath()

    ctx.fillStyle = "rgba(59, 130, 246, 0.1)"
    ctx.fill()

    // Draw benchmark line
    ctx.strokeStyle = "#94a3b8"
    ctx.lineWidth = 2
    ctx.beginPath()

    benchmarkData.forEach((point, i) => {
      const x = padding.left + (width - padding.left - padding.right) * (i / (benchmarkData.length - 1))
      const y =
        height -
        padding.bottom -
        (height - padding.top - padding.bottom) * ((point.value - minValue) / (maxValue - minValue))

      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })

    ctx.stroke()

    // Draw legend
    const legendX = width - padding.right - Math.min(150, width * 0.3)
    const legendY = padding.top + 20

    // Portfolio legend
    ctx.fillStyle = "#3b82f6"
    ctx.fillRect(legendX, legendY, 15, 2)
    ctx.fillStyle = "#ffffff"
    ctx.font = `${Math.max(10, Math.min(12, width * 0.025))}px sans-serif`
    ctx.textAlign = "left"
    ctx.fillText("Portfolio", legendX + 20, legendY + 4)

    // Benchmark legend
    ctx.fillStyle = "#94a3b8"
    ctx.fillRect(legendX, legendY + 20, 15, 2)
    ctx.fillStyle = "#ffffff"
    ctx.fillText("S&P 500", legendX + 20, legendY + 24)
  }, [dimensions])

  // Generate sample portfolio data
  const generatePortfolioData = () => {
    const baseValue = 2000000
    const data = []

    for (let i = 0; i < 12; i++) {
      let value = baseValue

      // Add some randomness and an upward trend
      if (i > 0) {
        const prevValue = data[i - 1].value
        const change = prevValue * (0.01 + Math.random() * 0.03) * (Math.random() > 0.3 ? 1 : -1)
        value = prevValue + change + prevValue * 0.01 // Slight upward bias
      }

      data.push({ month: i, value })
    }

    return data
  }

  // Generate sample benchmark data
  const generateBenchmarkData = () => {
    const baseValue = 2000000
    const data = []

    for (let i = 0; i < 12; i++) {
      let value = baseValue

      // Add some randomness and a slight upward trend
      if (i > 0) {
        const prevValue = data[i - 1].value
        const change = prevValue * (0.005 + Math.random() * 0.025) * (Math.random() > 0.4 ? 1 : -1)
        value = prevValue + change + prevValue * 0.005 // Slight upward bias
      }

      data.push({ month: i, value })
    }

    return data
  }

  return (
    <div ref={containerRef} className="w-full h-full min-h-[300px]">
      <canvas ref={canvasRef} style={{ width: "100%", height: "100%" }} className="max-w-full" />
    </div>
  )
}

