"use client"

import { useState } from "react"
import { ChevronDown, FileSpreadsheet, ChevronRight } from "lucide-react"
import { useTheme } from "@/components/theme-provider"

export default function ExcelPreview() {
  const [selectedCell, setSelectedCell] = useState({ row: 1, col: 0 })
  const { theme } = useTheme()
  const isDarkMode = theme === "dark"

  // Sample portfolio data
  const headers = ["Symbol", "Name", "Shares", "Price", "Value", "Allocation", "Return"]
  const data = [
    ["AAPL", "Apple Inc.", "150", "$187.68", "$28,152.00", "12.5%", "+13.2%"],
    ["MSFT", "Microsoft Corp.", "100", "$390.27", "$39,027.00", "17.3%", "+8.7%"],
    ["GOOGL", "Alphabet Inc.", "75", "$142.89", "$10,716.75", "4.8%", "-2.1%"],
    ["AMZN", "Amazon.com Inc.", "50", "$178.12", "$8,906.00", "4.0%", "+5.4%"],
    ["TSLA", "Tesla, Inc.", "60", "$177.56", "$10,653.60", "4.7%", "-1.3%"],
    ["VTI", "Vanguard Total Stock", "200", "$252.34", "$50,468.00", "22.4%", "+10.8%"],
    ["VXUS", "Vanguard Total Intl", "300", "$58.92", "$17,676.00", "7.8%", "+7.3%"],
    ["BND", "Vanguard Total Bond", "400", "$72.45", "$28,980.00", "12.9%", "-1.2%"],
    ["BNDX", "Vanguard Intl Bond", "250", "$48.32", "$12,080.00", "5.4%", "+0.8%"],
    ["CASH", "Cash & Equivalents", "-", "-", "$18,230.65", "8.1%", "+0.3%"],
  ]

  // Calculate totals
  const totalValue = data.reduce((sum, row) => {
    const value = row[4].replace("$", "").replace(",", "")
    return sum + (isNaN(Number.parseFloat(value)) ? 0 : Number.parseFloat(value))
  }, 0)

  // Theme-specific colors
  const colors = {
    header: isDarkMode ? "bg-[#185a36]" : "bg-[#217346]",
    toolbar: isDarkMode ? "bg-[#1e1e1e]" : "bg-[#f3f3f3]",
    toolbarHover: isDarkMode ? "bg-[#2a2a2a]" : "bg-[#e5e5e5]",
    cellBg: isDarkMode ? "bg-[#121212]" : "bg-white",
    headerBg: isDarkMode ? "bg-[#1e1e1e]" : "bg-[#f3f3f3]",
    selectedCell: isDarkMode ? "bg-[#264f78]" : "bg-[#d9ebf9]",
    selectedOutline: isDarkMode ? "outline-[#4caf50]" : "outline-[#217346]",
    text: isDarkMode ? "text-white" : "text-black",
    mutedText: isDarkMode ? "text-gray-400" : "text-[#555]",
    activeTab: isDarkMode ? "bg-[#2a2a2a]" : "bg-white",
    formulaBar: isDarkMode ? "bg-[#2a2a2a]" : "bg-white",
    fxColor: isDarkMode ? "text-[#4caf50]" : "text-[#217346]",
  }

  return (
    <div
      className="border border-border rounded-md overflow-hidden shadow-sm w-full h-full flex flex-col"
      style={{ height: "400px" }}
    >
      {/* Excel header */}
      <div className={`${colors.header} text-white p-2 flex justify-between items-center`}>
        <div className="flex items-center">
          <FileSpreadsheet className="h-5 w-5 mr-2" />
          <span className="font-medium">Portfolio Analysis.xlsx</span>
        </div>
        <div className="flex space-x-2">
          <button className="h-5 w-5 flex items-center justify-center rounded hover:bg-white/20">
            <span className="text-xs">−</span>
          </button>
          <button className="h-5 w-5 flex items-center justify-center rounded hover:bg-white/20">
            <span className="text-xs">□</span>
          </button>
          <button className="h-5 w-5 flex items-center justify-center rounded hover:bg-white/20">
            <span className="text-xs">×</span>
          </button>
        </div>
      </div>

      {/* Excel toolbar */}
      <div className={`${colors.toolbar} border-b border-border flex text-xs`}>
        <div className={`px-3 py-2 hover:${colors.toolbarHover} cursor-pointer ${colors.text}`}>File</div>
        <div className={`px-3 py-2 ${colors.toolbarHover} cursor-pointer ${colors.text}`}>Home</div>
        <div className={`px-3 py-2 hover:${colors.toolbarHover} cursor-pointer ${colors.text}`}>Insert</div>
        <div className={`px-3 py-2 hover:${colors.toolbarHover} cursor-pointer ${colors.text}`}>Page Layout</div>
        <div className={`px-3 py-2 hover:${colors.toolbarHover} cursor-pointer ${colors.text}`}>Formulas</div>
        <div className={`px-3 py-2 hover:${colors.toolbarHover} cursor-pointer ${colors.text}`}>Data</div>
        <div className={`px-3 py-2 hover:${colors.toolbarHover} cursor-pointer ${colors.text}`}>Review</div>
        <div className={`px-3 py-2 hover:${colors.toolbarHover} cursor-pointer ${colors.text}`}>View</div>
      </div>

      {/* Excel ribbon */}
      <div className={`${colors.toolbar} border-b border-border flex items-center p-1 text-xs`}>
        <div
          className={`flex items-center px-2 py-1 mx-1 rounded hover:${colors.toolbarHover} cursor-pointer ${colors.text}`}
        >
          <span className="font-bold">B</span>
        </div>
        <div
          className={`flex items-center px-2 py-1 mx-1 rounded hover:${colors.toolbarHover} cursor-pointer ${colors.text}`}
        >
          <span className="italic">I</span>
        </div>
        <div
          className={`flex items-center px-2 py-1 mx-1 rounded hover:${colors.toolbarHover} cursor-pointer ${colors.text}`}
        >
          <span className="underline">U</span>
        </div>
        <div className="h-4 border-r border-border mx-2"></div>
        <div
          className={`flex items-center px-2 py-1 mx-1 rounded hover:${colors.toolbarHover} cursor-pointer ${colors.text}`}
        >
          <span>$</span>
        </div>
        <div
          className={`flex items-center px-2 py-1 mx-1 rounded hover:${colors.toolbarHover} cursor-pointer ${colors.text}`}
        >
          <span>%</span>
        </div>
        <div className="h-4 border-r border-border mx-2"></div>
        <div
          className={`flex items-center px-2 py-1 mx-1 rounded hover:${colors.toolbarHover} cursor-pointer ${colors.text}`}
        >
          <span>Filter</span>
          <ChevronDown className="h-3 w-3 ml-1" />
        </div>
        <div
          className={`flex items-center px-2 py-1 mx-1 rounded hover:${colors.toolbarHover} cursor-pointer ${colors.text}`}
        >
          <span>Sort</span>
          <ChevronDown className="h-3 w-3 ml-1" />
        </div>
      </div>

      {/* Formula bar */}
      <div className={`${colors.toolbar} border-b border-border flex items-center px-2 py-1 text-xs`}>
        <div className="flex items-center mr-2">
          <span className={colors.fxColor + " font-bold"}>fx</span>
        </div>
        <div className={`flex-1 border border-border px-2 py-1 ${colors.formulaBar} ${colors.text}`}>
          {selectedCell.row >= 0 &&
          selectedCell.col >= 0 &&
          selectedCell.row < data.length &&
          selectedCell.col < headers.length
            ? data[selectedCell.row][selectedCell.col]
            : ""}
        </div>
      </div>

      {/* Spreadsheet */}
      <div className={`flex-1 overflow-auto ${colors.cellBg}`}>
        <table className="w-full border-collapse text-xs">
          <thead>
            <tr className={colors.headerBg}>
              <th className={`border border-border p-1 w-8 text-center ${colors.text}`}>#</th>
              {headers.map((header, index) => (
                <th
                  key={index}
                  className={`border border-border p-1 font-medium text-left min-w-[100px] ${colors.text}`}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={rowIndex} className={`hover:${colors.toolbarHover}`}>
                <td className={`border border-border p-1 text-center ${colors.headerBg} font-medium ${colors.text}`}>
                  {rowIndex + 1}
                </td>
                {row.map((cell, colIndex) => (
                  <td
                    key={colIndex}
                    className={`border border-border p-1 ${
                      selectedCell.row === rowIndex && selectedCell.col === colIndex
                        ? `${colors.selectedCell} outline outline-2 ${colors.selectedOutline}`
                        : colors.cellBg
                    } ${
                      colIndex === 6
                        ? cell.startsWith("+")
                          ? "text-green-500 dark:text-green-400"
                          : cell.startsWith("-")
                            ? "text-red-500 dark:text-red-400"
                            : colors.text
                        : colors.text
                    } ${colIndex === 0 ? "font-medium" : ""} ${
                      colIndex === 3 || colIndex === 4 || colIndex === 5 || colIndex === 6 ? "text-right" : ""
                    }`}
                    onClick={() => setSelectedCell({ row: rowIndex, col: colIndex })}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
            {/* Total row */}
            <tr className={`${colors.headerBg} font-medium`}>
              <td className={`border border-border p-1 text-center ${colors.text}`}></td>
              <td className={`border border-border p-1 ${colors.text}`}>Total</td>
              <td className={`border border-border p-1 ${colors.text}`}></td>
              <td className={`border border-border p-1 ${colors.text}`}></td>
              <td className={`border border-border p-1 text-right ${colors.text}`}>${totalValue.toLocaleString()}</td>
              <td className={`border border-border p-1 text-right ${colors.text}`}>100.0%</td>
              <td className="border border-border p-1 text-right text-green-500 dark:text-green-400">+8.4%</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Status bar */}
      <div className={`${colors.toolbar} border-t border-border flex justify-between items-center px-2 py-1 text-xs`}>
        <div className="flex items-center">
          <span className={colors.mutedText}>Ready</span>
        </div>
        <div className="flex items-center space-x-4">
          <div className={`flex items-center ${colors.text}`}>
            <span>Sheet1</span>
          </div>
          <div className={`flex items-center ${colors.text}`}>
            <span>100%</span>
            <ChevronDown className="h-3 w-3 ml-1" />
          </div>
        </div>
      </div>

      {/* Sheet tabs */}
      <div className={`${colors.toolbar} border-t border-border flex items-center text-xs`}>
        <div
          className={`flex items-center px-3 py-1 ${colors.activeTab} border-r border-t border-l border-border rounded-t ${colors.text}`}
        >
          <span>Holdings</span>
        </div>
        <div className={`flex items-center px-3 py-1 hover:${colors.toolbarHover} cursor-pointer ${colors.mutedText}`}>
          <span>Performance</span>
        </div>
        <div className={`flex items-center px-3 py-1 hover:${colors.toolbarHover} cursor-pointer ${colors.mutedText}`}>
          <span>Allocation</span>
        </div>
        <div className={`flex items-center px-3 py-1 hover:${colors.toolbarHover} cursor-pointer ${colors.mutedText}`}>
          <span>Tax Analysis</span>
        </div>
        <div className={`flex items-center px-2 py-1 hover:${colors.toolbarHover} cursor-pointer ${colors.mutedText}`}>
          <ChevronRight className="h-3 w-3" />
        </div>
        <div className={`flex items-center px-2 py-1 hover:${colors.toolbarHover} cursor-pointer ${colors.mutedText}`}>
          <span>+</span>
        </div>
      </div>
    </div>
  )
}

