"use client"

import { useEffect, useRef, useState } from "react"

export default function PortfolioPieChart() {
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

    // Chart dimensions
    const width = dimensions.width
    const height = dimensions.height
    const centerX = width / 2
    const centerY = height / 2
    const radius = Math.min(width, height) / 2 - 20

    // Portfolio allocation data
    const data = [
      { label: "Stocks", value: 45, color: "#3b82f6" },
      { label: "Bonds", value: 25, color: "#64748b" },
      { label: "ETFs", value: 15, color: "#10b981" },
      { label: "Cash", value: 10, color: "#f59e0b" },
      { label: "Alternatives", value: 5, color: "#8b5cf6" },
    ]

    // Clear canvas
    ctx.clearRect(0, 0, width, height)

    // Draw pie chart
    let startAngle = 0

    data.forEach((item) => {
      const sliceAngle = (item.value / 100) * 2 * Math.PI

      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle)
      ctx.closePath()

      ctx.fillStyle = item.color
      ctx.fill()

      startAngle += sliceAngle
    })

    // Draw center circle (donut hole)
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius * 0.6, 0, 2 * Math.PI)
    ctx.fillStyle = "#ffffff"
    ctx.fill()

    // Calculate legend position based on available space
    const legendX = 10
    const legendItemHeight = 20
    const legendTotalHeight = data.length * legendItemHeight

    // Position legend at bottom if there's enough space, otherwise on the right
    let legendY

    if (height >= 180) {
      // Position at bottom with some padding
      legendY = height - legendTotalHeight - 10
    } else {
      // Position on right side
      legendY = (height - legendTotalHeight) / 2
    }

    // Ensure legend is visible
    legendY = Math.max(10, legendY)

    // Draw legend
    data.forEach((item, index) => {
      const itemY = legendY + index * legendItemHeight

      // Color box
      ctx.fillStyle = item.color
      ctx.fillRect(legendX, itemY, 12, 12)

      // Label
      ctx.fillStyle = "#ffffff"
      ctx.font = "10px sans-serif"
      ctx.textAlign = "left"
      ctx.fillText(`${item.label} (${item.value}%)`, legendX + 18, itemY + 10)
    })
  }, [dimensions])

  return (
    <div ref={containerRef} className="w-full h-full min-h-[150px]">
      <canvas ref={canvasRef} style={{ width: "100%", height: "100%" }} className="max-w-full" />
    </div>
  )
}

