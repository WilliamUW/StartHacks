"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Download, FileSpreadsheet, Check, X } from "lucide-react"
import ExcelPreview from "@/components/excel-preview"

export default function ExcelIntegration() {
  const [exportStatus, setExportStatus] = useState<"idle" | "generating" | "success" | "error">("idle")
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)

  const handleExport = () => {
    setExportStatus("generating")

    // Simulate export process
    setTimeout(() => {
      setExportStatus("success")
      setShowSuccessMessage(true)

      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccessMessage(false)
        setExportStatus("idle")
      }, 3000)
    }, 2000)
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="p-4 border-b">
              <h3 className="font-medium">Excel Preview</h3>
              <p className="text-sm text-muted-foreground mt-1">Preview of your portfolio data in Excel format</p>
            </div>
            <div className="p-0">
              <ExcelPreview />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <FileSpreadsheet className="h-8 w-8 text-primary mr-3" />
              <div>
                <h3 className="font-medium">Export Portfolio Data</h3>
                <p className="text-sm text-muted-foreground">
                  Generate a comprehensive Excel report with your portfolio data
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Export Type</label>
                <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                  <option>Complete Portfolio Analysis</option>
                  <option>Holdings Summary</option>
                  <option>Performance Report</option>
                  <option>Tax Lot Analysis</option>
                  <option>ESG Impact Report</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Format</label>
                  <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                    <option>Excel (.xlsx)</option>
                    <option>CSV (.csv)</option>
                    <option>PDF (.pdf)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Time Period</label>
                  <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                    <option>Year to Date</option>
                    <option>Last Quarter</option>
                    <option>Last 12 Months</option>
                    <option>Custom Range</option>
                  </select>
                </div>
              </div>

              <Button className="w-full" onClick={handleExport} disabled={exportStatus === "generating"}>
                {exportStatus === "generating" ? (
                  <>
                    <div className="animate-spin mr-2 h-4 w-4 border-2 border-background border-t-transparent rounded-full" />
                    Generating Excel File...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Export to Excel
                  </>
                )}
              </Button>

              {showSuccessMessage && (
                <div
                  className={`flex items-center p-2 rounded-md ${exportStatus === "success" ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"}`}
                >
                  {exportStatus === "success" ? (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      <span>Excel file generated successfully!</span>
                    </>
                  ) : (
                    <>
                      <X className="h-4 w-4 mr-2" />
                      <span>Error generating Excel file. Please try again.</span>
                    </>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-6">
          <h3 className="font-medium mb-4">Excel Integration Options</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-md hover:bg-muted/50 cursor-pointer transition-colors">
              <h4 className="font-medium mb-2">Live Data Connection</h4>
              <p className="text-sm text-muted-foreground">
                Connect Excel to your portfolio for real-time updates and analysis
              </p>
              <Button variant="outline" className="mt-3 w-full">
                Setup Connection
              </Button>
            </div>

            <div className="p-4 border rounded-md hover:bg-muted/50 cursor-pointer transition-colors">
              <h4 className="font-medium mb-2">Excel Add-in</h4>
              <p className="text-sm text-muted-foreground">
                Install our Excel add-in for custom formulas and advanced analytics
              </p>
              <Button variant="outline" className="mt-3 w-full">
                Download Add-in
              </Button>
            </div>

            <div className="p-4 border rounded-md hover:bg-muted/50 cursor-pointer transition-colors">
              <h4 className="font-medium mb-2">Scheduled Reports</h4>
              <p className="text-sm text-muted-foreground">Set up automated Excel reports delivered on your schedule</p>
              <Button variant="outline" className="mt-3 w-full">
                Configure Schedule
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

