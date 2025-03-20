import React from "react"
import {
    User,
    TrendingUp,
    BarChart4,
    FileSpreadsheet,
    FileText,
    PieChart,
    AlertCircle,
} from "lucide-react"
import { SuggestedCommand } from "@/app/types"

// Core commands that should always be shown
export const coreCommands = ["/client", "/stock", "/market", "/create", "/analyze"]

// Suggested commands with their descriptions and categories
export const suggestedCommands: SuggestedCommand[] = [
    {
        command: "/client John Smith",
        description: "View John Smith's portfolio and information",
        category: "client",
        icon: React.createElement(User, { className: "h-4 w-4" }),
    },
    {
        command: "/client Sarah Johnson",
        description: "View Sarah Johnson's portfolio and information",
        category: "client",
        icon: React.createElement(User, { className: "h-4 w-4" }),
    },
    {
        command: "/stock AAPL",
        description: "Analyze Apple stock performance and outlook",
        category: "market",
        icon: React.createElement(TrendingUp, { className: "h-4 w-4" }),
    },
    {
        command: "/stock MSFT",
        description: "Analyze Microsoft stock performance and outlook",
        category: "market",
        icon: React.createElement(TrendingUp, { className: "h-4 w-4" }),
    },
    {
        command: "/market trends",
        description: "View current market trends and analysis",
        category: "market",
        icon: React.createElement(BarChart4, { className: "h-4 w-4" }),
    },
    {
        command: "/create excel",
        description: "Generate portfolio Excel report",
        category: "document",
        icon: React.createElement(FileSpreadsheet, { className: "h-4 w-4" }),
    },
    {
        command: "/create powerpoint",
        description: "Generate PowerPoint presentation",
        category: "document",
        icon: React.createElement(FileText, { className: "h-4 w-4" }),
    },
    {
        command: "/portfolio analysis",
        description: "Analyze current portfolio performance",
        category: "analysis",
        icon: React.createElement(PieChart, { className: "h-4 w-4" }),
    },
    {
        command: "/analyze risk",
        description: "Perform portfolio risk assessment",
        category: "analysis",
        icon: React.createElement(AlertCircle, { className: "h-4 w-4" }),
    },
] 