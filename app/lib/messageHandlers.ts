import { Message, ThinkingStep } from "@/app/types"
import { Dispatch, SetStateAction } from "react"

type SetMessages = Dispatch<SetStateAction<Message[]>>
type SetIsLoading = Dispatch<SetStateAction<boolean>>

export const handleClientInfoRequest = (setMessages: SetMessages, setIsLoading: SetIsLoading) => {
    setIsLoading(true)
    setMessages((prev) => [
        ...prev,
        {
            id: Date.now().toString(),
            type: "thinking",
            content: "Fetching client information...",
            sender: "agent",
            timestamp: new Date(),
            thinking: [
                { id: "1", content: "Loading client profile", status: "loading" },
                { id: "2", content: "Fetching portfolio data", status: "loading" },
                { id: "3", content: "Analyzing performance metrics", status: "loading" },
            ],
        },
    ])

    // Simulate API call
    setTimeout(() => {
        setMessages((prev) => [
            ...prev,
            {
                id: (Date.now() + 1).toString(),
                type: "client-info",
                content: "Here's the client information you requested:",
                sender: "agent",
                timestamp: new Date(),
                data: {
                    name: "John Smith",
                    portfolioValue: "$1,234,567",
                    ytdReturn: "+12.5%",
                    lastContact: "2024-03-15",
                    goals: [
                        {
                            title: "Retirement Savings",
                            amount: "$2,000,000",
                            deadline: "2035",
                            progress: 65,
                        },
                        {
                            title: "College Fund",
                            amount: "$500,000",
                            deadline: "2028",
                            progress: 45,
                        },
                    ],
                    totalValue: "$1,234,567",
                    benchmarkComparison: "S&P 500: +10.2%",
                    allocation: [
                        { category: "Stocks", percentage: 60, value: "$740,740" },
                        { category: "Bonds", percentage: 30, value: "$370,370" },
                        { category: "Cash", percentage: 10, value: "$123,457" },
                    ],
                    metrics: {
                        volatility: "12.3%",
                        sharpeRatio: "1.8",
                        dividendYield: "2.1%",
                        annualIncome: "$25,926",
                    },
                    topHoldings: [
                        { symbol: "AAPL", name: "Apple Inc.", value: "$123,457", weight: "10%" },
                        { symbol: "MSFT", name: "Microsoft Corp.", value: "$98,765", weight: "8%" },
                        { symbol: "GOOGL", name: "Alphabet Inc.", value: "$86,420", weight: "7%" },
                    ],
                    recentActivity: "Last portfolio rebalance: March 1, 2024",
                },
            },
        ])
        setIsLoading(false)
    }, 2000)
}

export const handleStockInfoRequest = (setMessages: SetMessages, setIsLoading: SetIsLoading) => {
    setIsLoading(true)
    setMessages((prev) => [
        ...prev,
        {
            id: Date.now().toString(),
            type: "thinking",
            content: "Fetching stock information...",
            sender: "agent",
            timestamp: new Date(),
            thinking: [
                { id: "1", content: "Loading stock data", status: "loading" },
                { id: "2", content: "Analyzing market trends", status: "loading" },
                { id: "3", content: "Gathering news updates", status: "loading" },
            ],
        },
    ])

    // Simulate API call
    setTimeout(() => {
        setMessages((prev) => [
            ...prev,
            {
                id: (Date.now() + 1).toString(),
                type: "stock-info",
                content: "Here's the stock information you requested:",
                sender: "agent",
                timestamp: new Date(),
                data: {
                    symbol: "AAPL",
                    name: "Apple Inc.",
                    price: 175.43,
                    change: 2.34,
                    changePercent: 1.35,
                    marketCap: "$2.8T",
                    peRatio: 28.5,
                    dividend: 0.96,
                    eps: 6.15,
                    analystRating: "Buy",
                    priceTarget: 200.00,
                    clientMatch: 85,
                    recentNews: [
                        {
                            title: "Apple Announces New AI Features",
                            source: "Reuters",
                            time: "2h ago",
                        },
                        {
                            title: "iPhone Sales Beat Expectations",
                            source: "Bloomberg",
                            time: "4h ago",
                        },
                    ],
                },
            },
        ])
        setIsLoading(false)
    }, 2000)
}

export const handlePortfolioRequest = (setMessages: SetMessages, setIsLoading: SetIsLoading) => {
    setIsLoading(true)
    setMessages((prev) => [
        ...prev,
        {
            id: Date.now().toString(),
            type: "thinking",
            content: "Analyzing portfolio...",
            sender: "agent",
            timestamp: new Date(),
            thinking: [
                { id: "1", content: "Loading portfolio data", status: "loading" },
                { id: "2", content: "Calculating performance metrics", status: "loading" },
                { id: "3", content: "Generating insights", status: "loading" },
            ],
        },
    ])

    // Simulate API call
    setTimeout(() => {
        setMessages((prev) => [
            ...prev,
            {
                id: (Date.now() + 1).toString(),
                type: "portfolio-info",
                content: "Here's your portfolio analysis:",
                sender: "agent",
                timestamp: new Date(),
                data: {
                    totalValue: "$1,234,567",
                    ytdReturn: "+12.5%",
                    benchmarkComparison: "S&P 500: +10.2%",
                    allocation: [
                        { category: "Stocks", percentage: 60, value: "$740,740" },
                        { category: "Bonds", percentage: 30, value: "$370,370" },
                        { category: "Cash", percentage: 10, value: "$123,457" },
                    ],
                    metrics: {
                        volatility: "12.3%",
                        sharpeRatio: "1.8",
                        dividendYield: "2.1%",
                        annualIncome: "$25,926",
                    },
                    topHoldings: [
                        { symbol: "AAPL", name: "Apple Inc.", value: "$123,457", weight: "10%" },
                        { symbol: "MSFT", name: "Microsoft Corp.", value: "$98,765", weight: "8%" },
                        { symbol: "GOOGL", name: "Alphabet Inc.", value: "$86,420", weight: "7%" },
                    ],
                },
            },
        ])
        setIsLoading(false)
    }, 2000)
}

export const handleExcelRequest = (setMessages: SetMessages, setIsLoading: SetIsLoading) => {
    setIsLoading(true)
    setMessages((prev) => [
        ...prev,
        {
            id: Date.now().toString(),
            type: "thinking",
            content: "Generating Excel report...",
            sender: "agent",
            timestamp: new Date(),
            thinking: [
                { id: "1", content: "Collecting data", status: "loading" },
                { id: "2", content: "Creating spreadsheet", status: "loading" },
                { id: "3", content: "Adding formulas and charts", status: "loading" },
            ],
        },
    ])

    // Simulate API call
    setTimeout(() => {
        setMessages((prev) => [
            ...prev,
            {
                id: (Date.now() + 1).toString(),
                type: "excel-preview",
                content: "Your Excel report is ready:",
                sender: "agent",
                timestamp: new Date(),
                data: {
                    fileName: "Portfolio_Analysis_Report.xlsx",
                    sheets: ["Overview", "Holdings", "Performance", "Transactions"],
                    totalRows: 1250,
                    totalColumns: 15,
                    features: [
                        "Interactive charts and graphs",
                        "Portfolio allocation breakdown",
                        "Performance metrics",
                        "Transaction history",
                    ],
                },
            },
        ])
        setIsLoading(false)
    }, 2000)
}

export const handlePowerPointRequest = (clientName: string, setMessages: SetMessages, setIsLoading: SetIsLoading) => {
    setIsLoading(true)
    setMessages((prev) => [
        ...prev,
        {
            id: Date.now().toString(),
            type: "thinking",
            content: "Creating PowerPoint presentation...",
            sender: "agent",
            timestamp: new Date(),
            thinking: [
                { id: "1", content: "Gathering client data", status: "loading" },
                { id: "2", content: "Designing slides", status: "loading" },
                { id: "3", content: "Adding visualizations", status: "loading" },
            ],
        },
    ])

    // Simulate API call
    setTimeout(() => {
        setMessages((prev) => [
            ...prev,
            {
                id: (Date.now() + 1).toString(),
                type: "powerpoint-preview",
                content: "Your PowerPoint presentation is ready:",
                sender: "agent",
                timestamp: new Date(),
                data: {
                    fileName: `${clientName}_Portfolio_Review.pptx`,
                    slides: [
                        "Executive Summary",
                        "Portfolio Overview",
                        "Performance Analysis",
                        "Asset Allocation",
                        "Top Holdings",
                        "Recommendations",
                    ],
                    totalSlides: 6,
                    features: [
                        "Professional design template",
                        "Interactive charts",
                        "Key performance metrics",
                        "Investment recommendations",
                    ],
                },
            },
        ])
        setIsLoading(false)
    }, 2000)
}

export const handleFinancialAdviceRequest = (setMessages: SetMessages, setIsLoading: SetIsLoading) => {
    setIsLoading(true)
    setMessages((prev) => [
        ...prev,
        {
            id: Date.now().toString(),
            type: "thinking",
            content: "Analyzing investment opportunity...",
            sender: "agent",
            timestamp: new Date(),
            thinking: [
                { id: "1", content: "Evaluating market conditions", status: "loading" },
                { id: "2", content: "Assessing risk factors", status: "loading" },
                { id: "3", content: "Generating recommendation", status: "loading" },
            ],
        },
    ])

    // Simulate API call
    setTimeout(() => {
        setMessages((prev) => [
            ...prev,
            {
                id: (Date.now() + 1).toString(),
                type: "financial-advice",
                content: "Here's my investment recommendation:",
                sender: "agent",
                timestamp: new Date(),
                data: {
                    confidence: "High",
                    recommendation: "Buy",
                    reasoning: [
                        "Strong financial performance and growth potential",
                        "Favorable market position and competitive advantage",
                        "Positive analyst consensus and price target",
                        "Aligns with your investment strategy",
                    ],
                    alternatives: [
                        "Consider dollar-cost averaging over 3 months",
                        "Look into related ETFs for diversification",
                        "Explore similar companies in the sector",
                    ],
                    risks: [
                        "Market volatility and economic uncertainty",
                        "Regulatory changes in the industry",
                        "Competition from emerging technologies",
                    ],
                },
            },
        ])
        setIsLoading(false)
    }, 2000)
} 