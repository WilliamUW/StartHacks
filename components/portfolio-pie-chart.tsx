"use client"

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"

const data = [
  {
    name: "Stocks",
    value: 45,
    color: "#3b82f6"
  },
  {
    name: "Bonds",
    value: 25,
    color: "#64748b"
  },
  {
    name: "ETFs",
    value: 15,
    color: "#10b981"
  },
  {
    name: "Cash",
    value: 10,
    color: "#f59e0b"
  },
  {
    name: "Alternatives",
    value: 5,
    color: "#8b5cf6"
  },
]

export default function PortfolioPieChart() {
  return (
    <div className="flex items-center gap-8 h-full">
      <div className="w-[200px] h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius="65%"
              outerRadius="100%"
              paddingAngle={2}
              dataKey="value"
              startAngle={90}
              endAngle={-270}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  stroke="transparent"
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className="w-2.5 h-2.5 rounded-sm"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-sm font-medium">{item.name}</span>
            <span className="text-sm text-muted-foreground">{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

