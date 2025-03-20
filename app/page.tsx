"use client";

import {
  AlertCircle,
  BarChart4,
  Check,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Clock,
  FileSpreadsheet,
  FileText,
  Loader2,
  Maximize2,
  Mic,
  MicOff,
  Minimize2,
  PieChart,
  Send,
  Sparkles,
  TrendingUp,
  Volume2,
  X,
  Zap,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCallback, useEffect, useRef, useState } from "react"

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import NotificationCenter from "@/components/notification-center"
import PortfolioChart from "@/components/portfolio-chart";
import PortfolioPieChart from "@/components/portfolio-pie-chart";
import type React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import StockChart from "@/components/stock-chart";
import StockSummary from "@/components/stock-summary";
import { cn } from "@/lib/utils";
import { initialStockPlaceholder } from "./stocks/[symbol]/page";
import { motion } from "framer-motion";
import { v4 as uuidv4 } from "uuid";

type MessageType =
  | "text"
  | "thinking"
  | "client-info"
  | "stock-info"
  | "portfolio-info"
  | "excel-preview"
  | "powerpoint-preview"
  | "financial-advice"
  | "command-result";

interface Message {
  id: string;
  content: string;
  type: MessageType;
  sender: "user" | "agent";
  timestamp: Date;
  data?: any;
  thinking?: ThinkingStep[];
}

interface ThinkingStep {
  id: string;
  content: string;
  status: "loading" | "complete" | "error";
  result?: string;
  data?: any;
}

// Update the interface to include category
interface SuggestedCommand {
  command: string;
  description: string;
  icon: React.ReactNode;
  category: string;
}

// Add this type near other interfaces
interface SpeechRecognitionWindow extends Window {
  webkitSpeechRecognition?: typeof SpeechRecognition;
  SpeechRecognition?: typeof SpeechRecognition;
}

export default function Home() {
  // Add a new state variable to track whether the input section is collapsed
  const [isInputCollapsed, setIsInputCollapsed] = useState(false);
  // Update the state variables to remove the ones we no longer need
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content:
        "Hello, I'm Terminal Six AI. How can I assist you with your financial decisions today?",
      type: "text",
      sender: "agent",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [voiceMode, setVoiceMode] = useState<
    "idle" | "listening" | "processing" | "speaking"
  >("idle");
  const [isExpanded, setIsExpanded] = useState(false);
  const [audioVisualization, setAudioVisualization] = useState<number[]>(
    Array(20).fill(5)
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Add autocomplete functionality
  const [showCommandAutocomplete, setShowCommandAutocomplete] = useState(false);
  const [filteredCommands, setFilteredCommands] = useState<SuggestedCommand[]>(
    []
  );
  const [selectedCommandIndex, setSelectedCommandIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Add this to the main component to enhance the voice interface
  const [voiceCommandsVisible, setVoiceCommandsVisible] = useState(false);

  // Modify the suggestedCommands array to only include the most important commands per category
  const suggestedCommands: SuggestedCommand[] = [
    // Client commands
    {
      command: "/client John Smith",
      description: "View John Smith's portfolio and information",
      icon: (
        <Avatar className="h-4 w-4">
          <AvatarFallback>JS</AvatarFallback>
        </Avatar>
      ),
      category: "client",
    },
    {
      command: "/client Sarah Johnson",
      description: "View Sarah Johnson's portfolio and information",
      icon: (
        <Avatar className="h-4 w-4">
          <AvatarFallback>SJ</AvatarFallback>
        </Avatar>
      ),
      category: "client",
    },
    {
      command: "/client Michael Chen",
      description: "View Michael Chen's portfolio and information",
      icon: (
        <Avatar className="h-4 w-4">
          <AvatarFallback>MC</AvatarFallback>
        </Avatar>
      ),
      category: "client",
    },
    {
      command: "/client Emma Wilson",
      description: "View Emma Wilson's portfolio and information",
      icon: (
        <Avatar className="h-4 w-4">
          <AvatarFallback>EW</AvatarFallback>
        </Avatar>
      ),
      category: "client",
    },
    {
      command: "/client David Rodriguez",
      description: "View David Rodriguez's portfolio and information",
      icon: (
        <Avatar className="h-4 w-4">
          <AvatarFallback>DR</AvatarFallback>
        </Avatar>
      ),
      category: "client",
    },

    // Market commands
    {
      command: "/stock AAPL",
      description: "Analyze Apple stock performance and outlook",
      icon: <TrendingUp className="h-4 w-4" />,
      category: "market",
    },
    {
      command: "/stock MSFT",
      description: "Analyze Microsoft stock performance and outlook",
      icon: <TrendingUp className="h-4 w-4" />,
      category: "market",
    },
    {
      command: "/market trends",
      description: "View current market trends and analysis",
      icon: <BarChart4 className="h-4 w-4" />,
      category: "market",
    },
    {
      command: "/sector technology",
      description: "Analyze technology sector performance",
      icon: <BarChart4 className="h-4 w-4" />,
      category: "market",
    },
    {
      command: "/market news",
      description: "Get latest market news and updates",
      icon: <FileText className="h-4 w-4" />,
      category: "market",
    },

    // Document commands
    {
      command: "/create excel",
      description: "Generate portfolio Excel report",
      icon: <FileSpreadsheet className="h-4 w-4" />,
      category: "document",
    },
    {
      command: "/create powerpoint John Smith",
      description: "Generate PowerPoint presentation for John Smith",
      icon: <FileText className="h-4 w-4" />,
      category: "document",
    },
    {
      command: "/create tax report",
      description: "Generate tax optimization report",
      icon: <FileText className="h-4 w-4" />,
      category: "document",
    },
    {
      command: "/create investment proposal",
      description: "Create new investment proposal document",
      icon: <FileText className="h-4 w-4" />,
      category: "document",
    },
    {
      command: "/export portfolio PDF",
      description: "Export portfolio summary as PDF",
      icon: <FileText className="h-4 w-4" />,
      category: "document",
    },

    // Analysis commands
    {
      command: "/portfolio analysis",
      description: "Analyze current portfolio performance",
      icon: <PieChart className="h-4 w-4" />,
      category: "analysis",
    },
    {
      command: "/analyze risk",
      description: "Perform portfolio risk assessment",
      icon: <AlertCircle className="h-4 w-4" />,
      category: "analysis",
    },
    {
      command: "/analyze allocation",
      description: "Analyze asset allocation efficiency",
      icon: <PieChart className="h-4 w-4" />,
      category: "analysis",
    },
    {
      command: "/analyze tax efficiency",
      description: "Analyze portfolio tax efficiency",
      icon: <BarChart4 className="h-4 w-4" />,
      category: "analysis",
    },
    {
      command: "/analyze goals",
      description: "Analyze progress toward financial goals",
      icon: <TrendingUp className="h-4 w-4" />,
      category: "analysis",
    },
  ];

  // Define the core commands that will appear in the "All" tab
  const coreCommands = [
    "/client John Smith",
    "/stock AAPL",
    "/create excel",
    "/portfolio analysis",
  ];

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Speed up scroll behavior
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "auto" }); // Changed from "smooth"
  };

  // Smooth animation for audio visualization
  useEffect(() => {
    if (voiceMode === "listening" || voiceMode === "speaking") {
      const interval = setInterval(() => {
        setAudioVisualization((prev) =>
          prev.map(() =>
            Math.max(3, Math.min(30, Math.floor(Math.random() * 30)))
          )
        );
      }, 50);
      return () => clearInterval(interval);
    } else {
      setAudioVisualization(Array(20).fill(5));
    }
  }, [voiceMode]);

  // Update the toggleVoiceMode function
  const toggleVoiceMode = useCallback(() => {
    if (voiceMode === "idle") {
      // Initialize speech recognition
      const SpeechRecognition = (window as SpeechRecognitionWindow).SpeechRecognition || 
                               (window as SpeechRecognitionWindow).webkitSpeechRecognition;
      
      if (!SpeechRecognition) {
        alert("Speech recognition is not supported in this browser.");
        return;
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setVoiceMode("listening");
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setVoiceMode("processing");
        
        // Process the voice input and reset voice mode
        setTimeout(() => {
          handleUserMessage(transcript);
          setVoiceMode("idle");
        }, 500);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setVoiceMode("idle");
      };

      recognition.onend = () => {
        // Only set to idle if we're still in listening mode
        // This prevents overriding the "processing" state
        if (voiceMode === "listening") {
          setVoiceMode("idle");
        }
      };

      recognition.start();
    } else {
      setVoiceMode("idle");
    }
  }, [voiceMode]);

  // Add this function to toggle voice commands visibility
  const toggleVoiceCommands = () => {
    setVoiceCommandsVisible((prev) => !prev);
  };

  // Add this to the component to show voice activation status
  const getVoiceActivationLabel = () => {
    return "Manual Activation";
  };

  // Add this to the component to show voice activation icon
  const getVoiceActivationIcon = () => {
    return <Mic className="h-5 w-5" />;
  };

  const handleUserMessage = (message: string) => {
    if (!message.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: message,
      type: "text",
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    // Process the message
    processUserMessage(message);
  };

  // Update the processUserMessage function to handle the new PowerPoint command with client parameter
  const processUserMessage = (message: string) => {
    const lowerMessage = message.toLowerCase();

    // Check for commands
    if (
      lowerMessage.startsWith("/client") ||
      lowerMessage.includes("john smith")
    ) {
      handleClientInfoRequest();
    } else if (
      lowerMessage.startsWith("/stock") ||
      lowerMessage.includes("aapl") ||
      lowerMessage.includes("apple")
    ) {
      handleStockInfoRequest();
    } else if (
      lowerMessage.startsWith("/create excel") ||
      lowerMessage.includes("excel")
    ) {
      handleExcelRequest();
    } else if (
      lowerMessage.startsWith("/create powerpoint") ||
      lowerMessage.includes("powerpoint")
    ) {
      // Extract client name if present
      const clientMatch = message.match(/\/create powerpoint\s+([A-Za-z\s]+)/);
      const clientName = clientMatch ? clientMatch[1].trim() : "John Smith"; // Default to John Smith if no client specified
      handlePowerPointRequest(clientName);
    } else if (
      lowerMessage.startsWith("/portfolio") ||
      lowerMessage.includes("portfolio")
    ) {
      handlePortfolioRequest();
    } else if (
      lowerMessage.includes("buy") ||
      lowerMessage.includes("invest") ||
      lowerMessage.includes("should i")
    ) {
      handleFinancialAdviceRequest();
    } else {
      // Generic response
      setTimeout(() => {
        const agentMessage: Message = {
          id: Date.now().toString(),
          content:
            "I understand you're asking about financial information. Could you be more specific? You can try commands like '/client John Smith', '/stock AAPL', or ask about portfolio performance.",
          type: "text",
          sender: "agent",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, agentMessage]);
        setIsLoading(false);
      }, 1000);
    }
  };

  // Helper to wait for a specified time (ms)
  const wait = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const handleClientInfoRequest = async () => {
    // Create the initial thinking message
    const thinkingMessage: Message = {
      id: uuidv4(),
      content: "Analyzing client information...",
      type: "thinking",
      sender: "agent",
      timestamp: new Date(),
      thinking: [
        {
          id: uuidv4(),
          content: "Retrieving client profile for John Smith",
          status: "loading",
        },
      ],
    };

    setMessages((prev) => [...prev, thinkingMessage]);

    // Update thinking steps over time
    await wait(500);
    setMessages((prev) => {
      const updated = [...prev];
      const index = updated.findIndex((m) => m.id === thinkingMessage.id);
      if (index !== -1) {
        updated[index] = {
          ...updated[index],
          thinking: [
            {
              id: uuidv4(),
              content: "Retrieved client profile for John Smith",
              status: "complete",
            },
            {
              id: uuidv4(),
              content: "Analyzed portfolio performance",
              status: "complete",
              result: "Portfolio up 13.2% YTD, outperforming S&P 500 by 2.1%",
            },
            {
              id: uuidv4(),
              content: "Checking recent transactions and goals",
              status: "loading",
            },
          ],
        };
      }
      return updated;
    });

    await wait(500);
    setMessages((prev) => {
      const updated = [...prev];
      const index = updated.findIndex((m) => m.id === thinkingMessage.id);
      if (index !== -1) {
        updated[index] = {
          ...updated[index],
          thinking: [
            {
              id: uuidv4(),
              content: "Retrieved client profile for John Smith",
              status: "complete",
            },
            {
              id: uuidv4(),
              content: "Analyzed portfolio performance",
              status: "complete",
              result: "Portfolio up 13.2% YTD, outperforming S&P 500 by 2.1%",
            },
            {
              id: uuidv4(),
              content: "Checked recent transactions and goals",
              status: "complete",
              result:
                "Recent activity: $50,000 cash position increase for house down payment",
            },
          ],
        };
      }
      return updated;
    });

    await wait(300);
    // Add the final client info message
    const clientInfoMessage: Message = {
      id: uuidv4(),
      content: "Here's John Smith's client information and portfolio overview:",
      type: "client-info",
      sender: "agent",
      timestamp: new Date(),
      data: {
        name: "John Smith",
        portfolioValue: "$2,437,890",
        ytdReturn: "+13.2%",
        lastContact: "March 5, 2025",
        goals: [
          {
            title: "House Down Payment",
            amount: "$150,000",
            deadline: "2026",
            progress: 67,
          },
          {
            title: "Children's College Fund",
            amount: "$250,000",
            deadline: "2030",
            progress: 35,
          },
          {
            title: "Early Retirement",
            amount: "$3,500,000",
            deadline: "2045",
            progress: 28,
          },
        ],
        recentActivity:
          "Increased cash position by $50,000 for house down payment",
      },
    };

    setMessages((prev) => [...prev, clientInfoMessage]);
    setIsLoading(false);
  };

  const handleStockInfoRequest = () => {
    // Create a thinking message first
    const thinkingMessage: Message = {
      id: uuidv4(),
      content: "Analyzing Apple stock...",
      type: "thinking",
      sender: "agent",
      timestamp: new Date(),
      thinking: [
        {
          id: uuidv4(),
          content: "Retrieving current stock data for AAPL",
          status: "loading",
        },
      ],
    };

    setMessages((prev) => [...prev, thinkingMessage]);

    // Update thinking steps over time
    setTimeout(() => {
      setMessages((prev) => {
        const updated = [...prev];
        const thinkingIndex = updated.findIndex(
          (m) => m.id === thinkingMessage.id
        );
        if (thinkingIndex !== -1) {
          updated[thinkingIndex] = {
            ...updated[thinkingIndex],
            thinking: [
              {
                id: uuidv4(),
                content: "Retrieved current stock data for AAPL",
                status: "complete",
                result: "Current price: $187.68, Change: +$1.23 (+0.66%)",
              },
              {
                id: uuidv4(),
                content: "Analyzing recent financial performance",
                status: "loading",
              },
            ],
          };
        }
        return updated;
      });

      // Add more thinking steps
      setTimeout(() => {
        setMessages((prev) => {
          const updated = [...prev];
          const thinkingIndex = updated.findIndex(
            (m) => m.id === thinkingMessage.id
          );
          if (thinkingIndex !== -1) {
            updated[thinkingIndex] = {
              ...updated[thinkingIndex],
              thinking: [
                {
                  id: uuidv4(),
                  content: "Retrieved current stock data for AAPL",
                  status: "complete",
                  result: "Current price: $187.68, Change: +$1.23 (+0.66%)",
                },
                {
                  id: uuidv4(),
                  content: "Analyzed recent financial performance",
                  status: "complete",
                  result:
                    "Q1 2025 EPS: $1.52 (beat by $0.12), Revenue: $94.8B (beat by $2.1B)",
                },
                {
                  id: uuidv4(),
                  content: "Checking analyst recommendations",
                  status: "loading",
                },
              ],
            };
          }
          return updated;
        });

        // Complete thinking and add stock info
        setTimeout(() => {
          setMessages((prev) => {
            const updated = [...prev];
            const thinkingIndex = updated.findIndex(
              (m) => m.id === thinkingMessage.id
            );
            if (thinkingIndex !== -1) {
              updated[thinkingIndex] = {
                ...updated[thinkingIndex],
                thinking: [
                  {
                    id: uuidv4(),
                    content: "Retrieved current stock data for AAPL",
                    status: "complete",
                    result: "Current price: $187.68, Change: +$1.23 (+0.66%)",
                  },
                  {
                    id: uuidv4(),
                    content: "Analyzed recent financial performance",
                    status: "complete",
                    result:
                      "Q1 2025 EPS: $1.52 (beat by $0.12), Revenue: $94.8B (beat by $2.1B)",
                  },
                  {
                    id: uuidv4(),
                    content: "Checked analyst recommendations",
                    status: "complete",
                    result:
                      "Consensus: Buy (32 analysts), Average price target: $215.45",
                  },
                  {
                    id: uuidv4(),
                    content: "Evaluating alignment with client preferences",
                    status: "complete",
                    result:
                      "72% match with John Smith's preferences (Environmental Sustainability, Technology sector)",
                  },
                ],
              };
            }
            return updated;
          });

          // Add the final stock info message
          setTimeout(() => {
            const stockInfoMessage: Message = {
              id: uuidv4(),
              content: "Here's the analysis for Apple Inc. (AAPL):",
              type: "stock-info",
              sender: "agent",
              timestamp: new Date(),
              data: {
                symbol: "AAPL",
                name: "Apple Inc.",
                price: 187.68,
                change: 1.23,
                changePercent: 0.66,
                marketCap: "$2.94T",
                peRatio: 31.2,
                dividend: 0.92,
                eps: 6.02,
                analystRating: "Buy",
                priceTarget: 215.45,
                socialCauses: [
                  "Environmental Sustainability",
                  "Privacy & Data Security",
                  "Education",
                ],
                clientMatch: 72,
                recentNews: [
                  {
                    title: "Apple Reports Strong Quarterly Earnings",
                    source: "Financial Times",
                    time: "2 hours ago",
                  },
                  {
                    title: "New Product Line Announcement Expected Next Month",
                    source: "Bloomberg",
                    time: "1 day ago",
                  },
                  {
                    title: "Apple Expands Renewable Energy Initiatives",
                    source: "Wall Street Journal",
                    time: "3 days ago",
                  },
                ],
              },
            };

            setMessages((prev) => [...prev, stockInfoMessage]);
            setIsLoading(false);
          }, 1000);
        }, 1000);
      }, 1000);
    }, 1000);
  };

  const handlePortfolioRequest = () => {
    // Create a thinking message first
    const thinkingMessage: Message = {
      id: uuidv4(),
      content: "Analyzing portfolio performance...",
      type: "thinking",
      sender: "agent",
      timestamp: new Date(),
      thinking: [
        {
          id: uuidv4(),
          content: "Retrieving portfolio data for John Smith",
          status: "loading",
        },
      ],
    };

    setMessages((prev) => [...prev, thinkingMessage]);

    // Update thinking steps over time
    setTimeout(() => {
      setMessages((prev) => {
        const updated = [...prev];
        const thinkingIndex = updated.findIndex(
          (m) => m.id === thinkingMessage.id
        );
        if (thinkingIndex !== -1) {
          updated[thinkingIndex] = {
            ...updated[thinkingIndex],
            thinking: [
              {
                id: uuidv4(),
                content: "Retrieved portfolio data for John Smith",
                status: "complete",
              },
              {
                id: uuidv4(),
                content: "Calculating performance metrics",
                status: "loading",
              },
            ],
          };
        }
        return updated;
      });

      // Add more thinking steps
      setTimeout(() => {
        setMessages((prev) => {
          const updated = [...prev];
          const thinkingIndex = updated.findIndex(
            (m) => m.id === thinkingMessage.id
          );
          if (thinkingIndex !== -1) {
            updated[thinkingIndex] = {
              ...updated[thinkingIndex],
              thinking: [
                {
                  id: uuidv4(),
                  content: "Retrieved portfolio data for John Smith",
                  status: "complete",
                },
                {
                  id: uuidv4(),
                  content: "Calculated performance metrics",
                  status: "complete",
                  result:
                    "YTD Return: +13.2%, Volatility: 12.4%, Sharpe Ratio: 1.8",
                },
                {
                  id: uuidv4(),
                  content: "Analyzing asset allocation",
                  status: "loading",
                },
              ],
            };
          }
          return updated;
        });

        // Complete thinking and add portfolio info
        setTimeout(() => {
          setMessages((prev) => {
            const updated = [...prev];
            const thinkingIndex = updated.findIndex(
              (m) => m.id === thinkingMessage.id
            );
            if (thinkingIndex !== -1) {
              updated[thinkingIndex] = {
                ...updated[thinkingIndex],
                thinking: [
                  {
                    id: uuidv4(),
                    content: "Retrieved portfolio data for John Smith",
                    status: "complete",
                  },
                  {
                    id: uuidv4(),
                    content: "Calculated performance metrics",
                    status: "complete",
                    result:
                      "YTD Return: +13.2%, Volatility: 12.4%, Sharpe Ratio: 1.8",
                  },
                  {
                    id: uuidv4(),
                    content: "Analyzed asset allocation",
                    status: "complete",
                    result:
                      "Stocks: 45%, Bonds: 25%, ETFs: 15%, Cash: 10%, Alternatives: 5%",
                  },
                  {
                    id: uuidv4(),
                    content: "Identifying top performers and underperformers",
                    status: "complete",
                    result:
                      "Top: Technology Sector (+18.7%), Bottom: Utilities Sector (-0.8%)",
                  },
                ],
              };
            }
            return updated;
          });

          // Add the final portfolio info message
          setTimeout(() => {
            const portfolioInfoMessage: Message = {
              id: uuidv4(),
              content: "Here's John Smith's portfolio performance analysis:",
              type: "portfolio-info",
              sender: "agent",
              timestamp: new Date(),
              data: {
                totalValue: "$2,437,890",
                ytdReturn: "+13.2%",
                benchmarkComparison: "+2.1% vs S&P 500",
                allocation: [
                  { category: "Stocks", percentage: 45, value: "$1,097,050" },
                  { category: "Bonds", percentage: 25, value: "$609,472" },
                  { category: "ETFs", percentage: 15, value: "$365,683" },
                  { category: "Cash", percentage: 10, value: "$243,789" },
                  {
                    category: "Alternatives",
                    percentage: 5,
                    value: "$121,894",
                  },
                ],
                metrics: {
                  volatility: "12.4%",
                  sharpeRatio: "1.8",
                  dividendYield: "2.3%",
                  annualIncome: "$56,071",
                },
                topHoldings: [
                  {
                    symbol: "AAPL",
                    name: "Apple Inc.",
                    value: "$146,273",
                    weight: "6.0%",
                  },
                  {
                    symbol: "MSFT",
                    name: "Microsoft Corp.",
                    value: "$134,084",
                    weight: "5.5%",
                  },
                  {
                    symbol: "VTI",
                    name: "Vanguard Total Stock",
                    value: "$121,894",
                    weight: "5.0%",
                  },
                ],
              },
            };

            setMessages((prev) => [...prev, portfolioInfoMessage]);
            setIsLoading(false);
          }, 1000);
        }, 1000);
      }, 1000);
    }, 1000);
  };

  const handleExcelRequest = () => {
    // Create a thinking message first
    const thinkingMessage: Message = {
      id: uuidv4(),
      content: "Generating Excel report...",
      type: "thinking",
      sender: "agent",
      timestamp: new Date(),
      thinking: [
        {
          id: uuidv4(),
          content: "Retrieving portfolio data for Excel report",
          status: "loading",
        },
      ],
    };

    setMessages((prev) => [...prev, thinkingMessage]);

    // Update thinking steps over time
    setTimeout(() => {
      setMessages((prev) => {
        const updated = [...prev];
        const thinkingIndex = updated.findIndex(
          (m) => m.id === thinkingMessage.id
        );
        if (thinkingIndex !== -1) {
          updated[thinkingIndex] = {
            ...updated[thinkingIndex],
            thinking: [
              {
                id: uuidv4(),
                content: "Retrieved portfolio data for Excel report",
                status: "complete",
              },
              {
                id: uuidv4(),
                content: "Formatting portfolio holdings sheet",
                status: "loading",
              },
            ],
          };
        }
        return updated;
      });

      // Add more thinking steps
      setTimeout(() => {
        setMessages((prev) => {
          const updated = [...prev];
          const thinkingIndex = updated.findIndex(
            (m) => m.id === thinkingMessage.id
          );
          if (thinkingIndex !== -1) {
            updated[thinkingIndex] = {
              ...updated[thinkingIndex],
              thinking: [
                {
                  id: uuidv4(),
                  content: "Retrieved portfolio data for Excel report",
                  status: "complete",
                },
                {
                  id: uuidv4(),
                  content: "Formatted portfolio holdings sheet",
                  status: "complete",
                },
                {
                  id: uuidv4(),
                  content: "Creating performance analysis sheet",
                  status: "loading",
                },
              ],
            };
          }
          return updated;
        });

        // Complete thinking and add Excel preview
        setTimeout(() => {
          setMessages((prev) => {
            const updated = [...prev];
            const thinkingIndex = updated.findIndex(
              (m) => m.id === thinkingMessage.id
            );
            if (thinkingIndex !== -1) {
              updated[thinkingIndex] = {
                ...updated[thinkingIndex],
                thinking: [
                  {
                    id: uuidv4(),
                    content: "Retrieved portfolio data for Excel report",
                    status: "complete",
                  },
                  {
                    id: uuidv4(),
                    content: "Formatted portfolio holdings sheet",
                    status: "complete",
                  },
                  {
                    id: uuidv4(),
                    content: "Created performance analysis sheet",
                    status: "complete",
                  },
                  {
                    id: uuidv4(),
                    content: "Added tax analysis and allocation sheets",
                    status: "complete",
                  },
                  {
                    id: uuidv4(),
                    content: "Applied formatting and formulas",
                    status: "complete",
                  },
                ],
              };
            }
            return updated;
          });

          // Add the final Excel preview message
          setTimeout(() => {
            const excelPreviewMessage: Message = {
              id: uuidv4(),
              content: "I've generated a comprehensive Excel report for John Smith's portfolio:",
              type: "excel-preview",
              sender: "agent",
              timestamp: new Date(),
              data: {
                fileName: "John_Smith_Portfolio_Analysis.xlsx",
                sheets: [
                  "Holdings",
                  "Performance",
                  "Allocation",
                  "Tax Analysis",
                ],
                totalRows: 156,
                totalColumns: 24,
                features: [
                  "Interactive filters and slicers",
                  "Dynamic charts and visualizations",
                  "Automated performance calculations",
                  "Tax-lot optimization analysis",
                  "What-if scenario modeling",
                ],
              },
            };

            setMessages((prev) => [...prev, excelPreviewMessage]);
            setIsLoading(false);
          }, 1000);
        }, 1000);
      }, 1000);
    }, 1000);
  };

  // Update the handlePowerPointRequest function to accept a client name parameter
  const handlePowerPointRequest = (clientName = "John Smith") => {
    // Create a thinking message first
    const thinkingMessage: Message = {
      id: uuidv4(),
      content: `Creating PowerPoint presentation for ${clientName}...`,
      type: "thinking",
      sender: "agent",
      timestamp: new Date(),
      thinking: [
        {
          id: uuidv4(),
          content: `Retrieving portfolio data for ${clientName}`,
          status: "loading",
        },
      ],
    };

    setMessages((prevMessages) => [...prevMessages, thinkingMessage]);

    // Simulate the creation process
    setTimeout(() => {
      // Update the thinking message status
      const updatedThinkingMessage: Message = {
        ...thinkingMessage,
        thinking: thinkingMessage.thinking?.map((item) => ({
          ...item,
          status: "complete",
        })),
      };

      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === thinkingMessage.id ? updatedThinkingMessage : msg
        )
      );

      // Simulate further steps
      setTimeout(() => {
        const powerPointPreviewMessage: Message = {
          id: uuidv4(),
          content: `I've created a professional PowerPoint presentation for ${clientName}'s portfolio review:`,
          type: "powerpoint-preview",
          sender: "agent",
          timestamp: new Date(),
          data: {
            fileName: `${clientName.replace(
              /\s+/g,
              "_"
            )}_Portfolio_Review_Q1_2025.pptx`,
            slides: [
              "Portfolio Performance Overview",
              "Asset Allocation",
              "Market Analysis",
              "Investment Strategy",
              "Financial Goals Progress",
            ],
            totalSlides: 12,
            features: [
              "Professional design with Terminal Six branding",
              "Interactive charts and data visualizations",
              "Executive summary with key metrics",
              "Strategic recommendations section",
              "Printable handout version included",
            ],
          },
        };

        setMessages((prevMessages) => [
          ...prevMessages,
          powerPointPreviewMessage,
        ]);
      }, 500);
    }, 500);
  };

  const handleFinancialAdviceRequest = () => {
    // Create a thinking message first
    const thinkingMessage: Message = {
      id: uuidv4(),
      content: "Analyzing investment opportunity...",
      type: "thinking",
      sender: "agent",
      timestamp: new Date(),
      thinking: [
        {
          id: uuidv4(),
          content: "Retrieving market data and trends",
          status: "loading",
        },
      ],
    };

    setMessages((prev) => [...prev, thinkingMessage]);

    // Update thinking steps over time
    setTimeout(() => {
      setMessages((prev) => {
        const updated = [...prev];
        const thinkingIndex = updated.findIndex(
          (m) => m.id === thinkingMessage.id
        );
        if (thinkingIndex !== -1) {
          updated[thinkingIndex] = {
            ...updated[thinkingIndex],
            thinking: [
              {
                id: uuidv4(),
                content: "Retrieved market data and trends",
                status: "complete",
              },
              {
                id: uuidv4(),
                content: "Analyzing client's current portfolio allocation",
                status: "loading",
              },
            ],
          };
        }
        return updated;
      });

      // Add more thinking steps
      setTimeout(() => {
        setMessages((prev) => {
          const updated = [...prev];
          const thinkingIndex = updated.findIndex(
            (m) => m.id === thinkingMessage.id
          );
          if (thinkingIndex !== -1) {
            updated[thinkingIndex] = {
              ...updated[thinkingIndex],
              thinking: [
                {
                  id: uuidv4(),
                  content: "Retrieved market data and trends",
                  status: "complete",
                },
                {
                  id: uuidv4(),
                  content: "Analyzing client's current portfolio allocation",
                  status: "complete",
                  result:
                    "Current tech allocation: 32%, Target allocation: 25-35%",
                },
                {
                  id: uuidv4(),
                  content: "Evaluating risk profile and investment goals",
                  status: "loading",
                },
              ],
            };
          }
          return updated;
        });

        // Complete thinking and add financial advice
        setTimeout(() => {
          setMessages((prev) => {
            const updated = [...prev];
            const thinkingIndex = updated.findIndex(
              (m) => m.id === thinkingMessage.id
            );
            if (thinkingIndex !== -1) {
              updated[thinkingIndex] = {
                ...updated[thinkingIndex],
                thinking: [
                  {
                    id: uuidv4(),
                    content: "Retrieved market data and trends",
                    status: "complete",
                  },
                  {
                    id: uuidv4(),
                    content: "Analyzed client's current portfolio allocation",
                    status: "complete",
                    result:
                      "Current tech allocation: 32%, Target allocation: 25-35%",
                  },
                  {
                    id: uuidv4(),
                    content: "Evaluated risk profile and investment goals",
                    status: "complete",
                    result:
                      "Risk tolerance: Moderate, Primary goal: House down payment (2026)",
                  },
                  {
                    id: uuidv4(),
                    content: "Checking alignment with ESG preferences",
                    status: "complete",
                    result:
                      "72% match with environmental sustainability preferences",
                  },
                  {
                    id: uuidv4(),
                    content: "Formulating recommendation",
                    status: "complete",
                  },
                ],
              };
            }
            return updated;
          });

          // Add the final financial advice message
          setTimeout(() => {
            const financialAdviceMessage: Message = {
              id: uuidv4(),
              content: "Based on my analysis, here's my recommendation regarding Apple stock (AAPL):",
              type: "financial-advice",
              sender: "agent",
              timestamp: new Date(),
              data: {
                recommendation: "Hold",
                confidence: "Medium",
                reasoning: [
                  "Apple's current valuation is slightly above historical averages (P/E ratio of 31.2 vs 5-year average of 28.5)",
                  "Your portfolio already has sufficient technology exposure (32% allocation)",
                  "Your near-term goal of saving for a house down payment suggests maintaining liquidity",
                  "Apple's environmental initiatives align well with your sustainability preferences (72% match)",
                ],
                alternatives: [
                  "Consider dollar-cost averaging with smaller purchases over time",
                  "Look at renewable energy ETFs for better alignment with sustainability goals",
                  "Prioritize increasing cash position for upcoming house down payment",
                ],
                risks: [
                  "Technology sector volatility may impact short-term performance",
                  "Regulatory challenges in key markets could affect growth",
                  "Product cycle dependencies create quarterly earnings volatility",
                ],
              },
            };

            setMessages((prev) => [...prev, financialAdviceMessage]);
            setIsLoading(false);
          }, 1000);
        }, 1000);
      }, 1000);
    }, 1000);
  };

  // Update the handleInputChange function
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    if (value.startsWith("/")) {
      const searchTerm = value.slice(1).toLowerCase();
      const filtered = suggestedCommands.filter((cmd) =>
        cmd.command.toLowerCase().slice(1).startsWith(searchTerm)
      );
      setFilteredCommands(filtered);
      setShowCommandAutocomplete(filtered.length > 0);
      setSelectedCommandIndex(0);
    } else {
      setShowCommandAutocomplete(false);
    }
  };

  // Add keyboard navigation for autocomplete
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (showCommandAutocomplete) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedCommandIndex((prev) =>
          prev < filteredCommands.length - 1 ? prev + 1 : prev
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedCommandIndex((prev) => (prev > 0 ? prev - 1 : 0));
      } else if (e.key === "Tab" || e.key === "Enter") {
        e.preventDefault();
        if (filteredCommands.length > 0) {
          setInputValue(filteredCommands[selectedCommandIndex].command);
          setShowCommandAutocomplete(false);
          if (e.key === "Enter") {
            handleUserMessage(filteredCommands[selectedCommandIndex].command);
          }
        }
      } else if (e.key === "Escape") {
        setShowCommandAutocomplete(false);
      }
    } else if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleUserMessage(inputValue);
    }
  };

  // Add function to select command from autocomplete
  const selectCommand = (command: string) => {
    setInputValue(command);
    setShowCommandAutocomplete(false);
    inputRef.current?.focus();
  };

  const handleCommandClick = (command: string) => {
    setInputValue(command);
    handleUserMessage(command);
  };

  // Render message content based on type
  const renderMessageContent = (message: Message) => {
    switch (message.type) {
      case "thinking":
        return (
          <div className="space-y-2 p-3 bg-muted/30 rounded-lg">
            <p className="text-sm font-medium">{message.content}</p>
            <div className="space-y-1.5">
              {message.thinking?.map((step) => (
                <div key={step.id} className="flex items-start">
                  {step.status === "loading" ? (
                    <Loader2 className="h-4 w-4 text-muted-foreground animate-spin mr-2 mt-0.5" />
                  ) : step.status === "complete" ? (
                    <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                  ) : (
                    <X className="h-4 w-4 text-red-500 mr-2 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p className="text-sm">{step.content}</p>
                    {step.result && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {step.result}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case "client-info":
        return (
          <div className="space-y-4">
            <p className="text-sm">{message.content}</p>

            <Card className="overflow-hidden">
              <div className="p-4 flex items-start gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage
                    src="/clients/client1.png"
                    alt={message.data.name}
                  />
                  <AvatarFallback>JS</AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <h3 className="text-xl font-bold">{message.data.name}</h3>
                  <div className="flex flex-wrap gap-2 mt-1">
                    <Badge
                      variant="outline"
                      className="bg-primary/10 text-primary"
                    >
                      Portfolio: {message.data.portfolioValue}
                    </Badge>
                    <Badge
                      variant="outline"
                      className="bg-green-500/10 text-green-500 flex items-center"
                    >
                      <TrendingUp className="h-3 w-3 mr-1" />
                      {message.data.ytdReturn} YTD
                    </Badge>
                    <Badge variant="outline" className="bg-muted/50">
                      Last Contact: {message.data.lastContact}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="border-t p-4">
                <h4 className="font-medium mb-3">Financial Goals</h4>
                <div className="space-y-3">
                  {message.data.goals.map((goal: any, index: number) => (
                    <div key={index} className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">
                          {goal.title}
                        </span>
                        <span className="text-sm">
                          {goal.amount} by {goal.deadline}
                        </span>
                      </div>
                      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${goal.progress}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-muted-foreground text-right">
                        {goal.progress}% complete
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t p-4 bg-muted/30">
                <h4 className="font-medium mb-2">Recent Activity</h4>
                <p className="text-sm">{message.data.recentActivity}</p>
              </div>
            </Card>

            <div className="flex gap-2">
              <Button size="sm">
                <FileSpreadsheet className="h-4 w-4 mr-1" />
                Generate Report
              </Button>
              <Button variant="outline" size="sm">
                <BarChart4 className="h-4 w-4 mr-1" />
                Portfolio Analysis
              </Button>
            </div>
          </div>
        );

      case "stock-info":
        return (
          <div className="space-y-4">
            <p className="text-sm">{message.content}</p>

            <Card className="overflow-hidden">
              <div className="p-4">
                <div className="h-[270px]">
                  <StockChart symbol={message.data.symbol} height={200} />
                </div>
              </div>

              <div className="border-t p-4 grid grid-cols-2 gap-4">
                <div>
                  <StockSummary
                    symbol={message.data.symbol}
                    initialData={initialStockPlaceholder}
                  />
                </div>

                <div>
                  <h4 className="font-medium mb-3">Analyst Consensus</h4>
                  <div className="text-center p-3 bg-muted/30 rounded-lg">
                    <div className="text-2xl font-bold text-primary">
                      {message.data.analystRating}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Price Target: ${message.data.priceTarget}
                    </div>
                  </div>

                  <div className="mt-3">
                    <div className="text-sm mb-1">Client Preference Match</div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500 rounded-full"
                        style={{ width: `${message.data.clientMatch}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-muted-foreground text-right mt-1">
                      {message.data.clientMatch}% match
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t p-4">
                <h4 className="font-medium mb-2">Recent News</h4>
                <div className="space-y-2">
                  {message.data.recentNews.map((news: any, index: number) => (
                    <div
                      key={index}
                      className="flex justify-between text-sm p-2 hover:bg-muted/30 rounded-md"
                    >
                      <div>{news.title}</div>
                      <div className="text-muted-foreground text-xs flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {news.time}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            <div className="flex gap-2">
              <Button size="sm">Add to Watchlist</Button>
              <Button variant="outline" size="sm">
                <TrendingUp className="h-4 w-4 mr-1" />
                Technical Analysis
              </Button>
            </div>
          </div>
        );

      case "portfolio-info":
        return (
          <div className="space-y-4">
            <p className="text-sm">{message.content}</p>

            <Card className="overflow-hidden">
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold">Portfolio Value</h3>
                    <p className="text-3xl font-bold mt-1">
                      {message.data.totalValue}
                    </p>
                  </div>
                  <div className="text-right">
                    <h3 className="text-xl font-bold">YTD Return</h3>
                    <Badge
                      variant="outline"
                      className="bg-green-500/10 text-green-500 text-lg mt-1 px-2 py-1"
                    >
                      {message.data.ytdReturn}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">
                      {message.data.benchmarkComparison}
                    </p>
                  </div>
                </div>

                <div className="mt-4 h-[250px]">
                  <PortfolioChart />
                </div>
              </div>

              <div className="border-t p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">Asset Allocation</h4>
                    <div className="h-[180px]">
                      <PortfolioPieChart />
                    </div>
                    <div className="mt-2 space-y-1 text-sm">
                      {message.data.allocation.map(
                        (item: any, index: number) => (
                          <div key={index} className="flex justify-between">
                            <span>{item.category}</span>
                            <span>
                              {item.percentage}% ({item.value})
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">Performance Metrics</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 border rounded-lg text-center">
                        <div className="text-xs text-muted-foreground">
                          Volatility
                        </div>
                        <div className="text-lg font-bold">
                          {message.data.metrics.volatility}
                        </div>
                      </div>
                      <div className="p-3 border rounded-lg text-center">
                        <div className="text-xs text-muted-foreground">
                          Sharpe Ratio
                        </div>
                        <div className="text-lg font-bold">
                          {message.data.metrics.sharpeRatio}
                        </div>
                      </div>
                      <div className="p-3 border rounded-lg text-center">
                        <div className="text-xs text-muted-foreground">
                          Dividend Yield
                        </div>
                        <div className="text-lg font-bold">
                          {message.data.metrics.dividendYield}
                        </div>
                      </div>
                      <div className="p-3 border rounded-lg text-center">
                        <div className="text-xs text-muted-foreground">
                          Annual Income
                        </div>
                        <div className="text-lg font-bold">
                          {message.data.metrics.annualIncome}
                        </div>
                      </div>
                    </div>

                    <h4 className="font-medium mt-4 mb-2">Top Holdings</h4>
                    <div className="space-y-1 text-sm">
                      {message.data.topHoldings.map(
                        (holding: any, index: number) => (
                          <div key={index} className="flex justify-between">
                            <span>
                              {holding.symbol} ({holding.name})
                            </span>
                            <span>
                              {holding.value} ({holding.weight})
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <div className="flex gap-2">
              <Button size="sm">
                <FileSpreadsheet className="h-4 w-4 mr-1" />
                Export Report
              </Button>
              <Button variant="outline" size="sm">
                <PieChart className="h-4 w-4 mr-1" />
                Rebalance Portfolio
              </Button>
            </div>
          </div>
        );

      case "excel-preview":
        return (
          <div className="space-y-4">
            <p className="text-sm">{message.content}</p>

            <Card className="overflow-hidden">
              <div className="p-4 border-b bg-[#217346] text-white flex justify-between items-center">
                <div className="flex items-center">
                  <FileSpreadsheet className="h-5 w-5 mr-2" />
                  <h3 className="font-medium">{message.data.fileName}</h3>
                </div>
              </div>

              <div className="p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Sheets</h4>
                    <div className="space-y-1">
                      {message.data.sheets.map(
                        (sheet: string, index: number) => (
                          <div
                            key={index}
                            className="flex items-center p-2 hover:bg-muted/30 rounded-md text-sm"
                          >
                            <div
                              className={`w-3 h-3 rounded-sm mr-2 ${index === 0
                                ? "bg-green-500"
                                : index === 1
                                  ? "bg-blue-500"
                                  : index === 2
                                    ? "bg-purple-500"
                                    : "bg-amber-500"
                                }`}
                            ></div>
                            {sheet}
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Report Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Total Rows:
                        </span>
                        <span>{message.data.totalRows}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Total Columns:
                        </span>
                        <span>{message.data.totalColumns}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          File Size:
                        </span>
                        <span>2.4 MB</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Created:</span>
                        <span>{new Date().toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <h4 className="font-medium mb-2">Features</h4>
                  <div className="space-y-1">
                    {message.data.features.map(
                      (feature: string, index: number) => (
                        <div key={index} className="flex items-center text-sm">
                          <Check className="h-4 w-4 text-green-500 mr-2" />
                          {feature}
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            </Card>

            <div className="flex gap-2">
              <Button size="sm">Download Excel File</Button>
              <Button variant="outline" size="sm">
                <FileSpreadsheet className="h-4 w-4 mr-1" />
                Open in Excel Online
              </Button>
            </div>
          </div>
        );

      case "powerpoint-preview":
        return (
          <div className="space-y-4">
            <p className="text-sm">{message.content}</p>

            <Card className="overflow-hidden">
              <div className="p-4 border-b bg-[#B7472A] text-white flex justify-between items-center">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  <h3 className="font-medium">{message.data.fileName}</h3>
                </div>
              </div>

              <div className="p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Slides</h4>
                    <div className="space-y-1">
                      {message.data.slides.map(
                        (slide: string, index: number) => (
                          <div
                            key={index}
                            className="flex items-center p-2 hover:bg-muted/30 rounded-md text-sm"
                          >
                            <div className="w-5 h-5 rounded-sm bg-[#B7472A]/10 text-[#B7472A] flex items-center justify-center mr-2 text-xs">
                              {index + 1}
                            </div>
                            {slide}
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Presentation Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Total Slides:
                        </span>
                        <span>{message.data.totalSlides}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Aspect Ratio:
                        </span>
                        <span>16:9 Widescreen</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          File Size:
                        </span>
                        <span>3.8 MB</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Created:</span>
                        <span>{new Date().toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <h4 className="font-medium mb-2">Features</h4>
                  <div className="space-y-1">
                    {message.data.features.map(
                      (feature: string, index: number) => (
                        <div key={index} className="flex items-center text-sm">
                          <Check className="h-4 w-4 text-green-500 mr-2" />
                          {feature}
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            </Card>

            <div className="flex gap-2">
              <Button size="sm">Download PowerPoint</Button>
              <Button variant="outline" size="sm">
                <FileText className="h-4 w-4 mr-1" />
                Open in PowerPoint Online
              </Button>
            </div>
          </div>
        );

      case "financial-advice":
        return (
          <div className="space-y-4">
            <p className="text-sm">{message.content}</p>

            <Card className="overflow-hidden">
              <div className="p-4 border-b bg-primary text-primary-foreground flex justify-between items-center">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  <h3 className="font-medium">Investment Recommendation</h3>
                </div>
                <Badge variant="outline" className="bg-white/20 text-white">
                  {message.data.confidence} Confidence
                </Badge>
              </div>

              <div className="p-4 flex items-center justify-center border-b">
                <div className="text-center">
                  <div className="text-4xl font-bold mb-1">
                    {message.data.recommendation}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Recommended Action
                  </div>
                </div>
              </div>

              <div className="p-4">
                <h4 className="font-medium mb-2">Reasoning</h4>
                <div className="space-y-1 mb-4">
                  {message.data.reasoning.map(
                    (reason: string, index: number) => (
                      <div key={index} className="flex items-start text-sm">
                        <div className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center mr-2 flex-shrink-0 mt-0.5 text-xs">
                          {index + 1}
                        </div>
                        {reason}
                      </div>
                    )
                  )}
                </div>

                <h4 className="font-medium mb-2">Alternative Strategies</h4>
                <div className="space-y-1 mb-4">
                  {message.data.alternatives.map(
                    (alternative: string, index: number) => (
                      <div key={index} className="flex items-center text-sm">
                        <ChevronRight className="h-4 w-4 text-primary mr-2" />
                        {alternative}
                      </div>
                    )
                  )}
                </div>

                <h4 className="font-medium mb-2">Risk Factors</h4>
                <div className="space-y-1">
                  {message.data.risks.map((risk: string, index: number) => (
                    <div key={index} className="flex items-center text-sm">
                      <AlertCircle className="h-4 w-4 text-amber-500 mr-2" />
                      {risk}
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            <div className="flex gap-2">
              <Button size="sm">Accept Recommendation</Button>
              <Button variant="outline" size="sm">
                Request Alternatives
              </Button>
            </div>
          </div>
        );

      default:
        return <p className="whitespace-pre-line">{message.content}</p>;
    }
  };

  // Add a toggle function for the input section
  const toggleInputSection = () => {
    setIsInputCollapsed((prev) => !prev);
  };

  // Add this helper function
  const isSpeechRecognitionSupported = () => {
    return !!(
      (window as SpeechRecognitionWindow).SpeechRecognition ||
      (window as SpeechRecognitionWindow).webkitSpeechRecognition
    );
  };

  return (
    <main className="flex flex-col h-screen bg-background text-foreground">
      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Voice activation overlay - shown only during listening and processing */}
        {(voiceMode === "listening" || voiceMode === "processing") && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
            <div className="absolute inset-0 overflow-hidden">
              {/* Animated background elements */}
              <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full animate-pulse"></div>
              <div
                className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-primary/10 rounded-full animate-pulse"
                style={{ animationDelay: "0.5s" }}
              ></div>
              <div
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[200%] h-[1px] bg-primary/20 animate-spin"
                style={{ animationDuration: "20s" }}
              ></div>
              <div
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[180%] h-[1px] bg-primary/15 animate-spin"
                style={{
                  animationDuration: "25s",
                  animationDirection: "reverse",
                }}
              ></div>
            </div>

            <div className="relative mb-6 z-10">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl"></div>
              <Button
                size="lg"
                className={cn(
                  "h-14 px-6 rounded-full transition-all duration-150 shadow-lg",
                  isSpeechRecognitionSupported() 
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "bg-muted text-muted-foreground cursor-not-allowed"
                )}
                onClick={isSpeechRecognitionSupported() ? toggleVoiceMode : () => alert("Speech recognition is not supported in this browser.")}
              >
                <div className="flex items-center">
                  <Mic className="h-5 w-5" />
                  <span className="ml-2 font-medium">
                    {!isSpeechRecognitionSupported() 
                      ? "Speech not supported"
                      : voiceMode === "idle"
                      ? "Speak to Terminal Six"
                      : voiceMode === "listening"
                      ? "Listening..."
                      : voiceMode === "processing"
                      ? "Processing..."
                      : "Speaking..."}
                  </span>
                </div>
              </Button>
            </div>

            <div className="text-center mb-8 z-10">
              <h3 className="text-3xl font-medium mb-2 text-white">
                {voiceMode === "listening" ? "Listening..." : "Processing..."}
              </h3>
              <p className="text-xl text-white/70">
                {voiceMode === "listening"
                  ? "Say something like 'Show me John's portfolio'"
                  : "Analyzing your request"}
              </p>
            </div>

            {/* Enhanced audio visualization */}
            <div className="flex items-end justify-center gap-[3px] h-32 w-full max-w-md z-10">
              {audioVisualization.map((height, i) => (
                <motion.div
                  key={i}
                  initial={{ height: 5 }}
                  animate={{ height: `${height}px` }}
                  transition={{ duration: 0.2 }}
                  className={cn(
                    "w-[8px] rounded-full transition-all",
                    voiceMode === "idle" ? "bg-white/30" : "bg-primary"
                  )}
                  style={{
                    opacity: voiceMode === "idle" ? 0.3 : 0.7,
                  }}
                ></motion.div>
              ))}
            </div>

            {/* Voice commands quick reference */}
            <div className="mt-8 z-10 bg-black/30 backdrop-blur-sm p-4 rounded-lg border border-white/10 max-w-md">
              <h4 className="text-white/90 text-sm font-medium mb-2">
                Try saying:
              </h4>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                <div className="text-white/70 text-sm flex items-center">
                  <Zap className="h-3 w-3 text-primary mr-1" />
                  "Show portfolio"
                </div>
                <div className="text-white/70 text-sm flex items-center">
                  <Zap className="h-3 w-3 text-primary mr-1" />
                  "Apple stock analysis"
                </div>
                <div className="text-white/70 text-sm flex items-center">
                  <Zap className="h-3 w-3 text-primary mr-1" />
                  "Create Excel report"
                </div>
                <div className="text-white/70 text-sm flex items-center">
                  <Zap className="h-3 w-3 text-primary mr-1" />
                  "Should I buy Tesla?"
                </div>
              </div>
            </div>

            <div className="mt-8 z-10">
              <Button
                variant="outline"
                size="lg"
                className="text-white border-white/30 hover:bg-white/10"
                onClick={() => setVoiceMode("idle")}
              >
                <MicOff className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          </div>
        )}
        {/* Header with logo */}
        <div className="border-b border-border p-4 flex justify-between items-center bg-background">
          <div className="flex items-center">
            <div className="h-8 w-8 mr-2">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/monkeyy-AUgmriMSYzYWjIC2RQIjNlDwE6WVdE.png"
                alt="Terminal Six Logo"
                className="h-full w-full object-contain dark:invert"
              />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Terminal Six</h2>
              <p className="text-xs text-muted-foreground">
                AI Financial Assistant
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <NotificationCenter />
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? (
                <Minimize2 className="h-4 w-4" />
              ) : (
                <Maximize2 className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
        {/* Messages area */}
        <ScrollArea
          className="flex-1 p-4"
          style={{
            height: isExpanded
              ? `calc(100vh - ${isInputCollapsed ? 64 : 140}px)`
              : `calc(100vh - ${isInputCollapsed ? 64 : 140}px)`,
          }}
        >
          <div className="space-y-6 max-w-4xl mx-auto">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"
                  }`}
              >
                <div
                  className={`max-w-[90%] rounded-lg p-4 ${message.sender === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border border-border"
                    }`}
                >
                  {message.sender === "agent" && (
                    <div className="flex items-center mb-2">
                      <Sparkles className="h-4 w-4 text-primary mr-2" />
                      <span className="font-medium">Terminal Six AI</span>
                    </div>
                  )}

                  {renderMessageContent(message)}

                  <div
                    className={`text-xs mt-2 ${message.sender === "user"
                      ? "text-primary-foreground/70"
                      : "text-muted-foreground"
                      }`}
                  >
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-card border border-border rounded-lg p-4">
                  <div className="flex items-center">
                    <Sparkles className="h-4 w-4 text-primary mr-2" />
                    <span className="font-medium">Terminal Six AI</span>
                  </div>
                  <div className="flex items-center mt-2">
                    <Loader2 className="h-5 w-5 animate-spin text-primary mr-2" />
                    <span className="text-muted-foreground">Thinking...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
        {/* Input area */}
        <div className="border-t border-border">
          <div
            className="flex items-center justify-center py-1 border-b border-border cursor-pointer hover:bg-muted/50 transition-colors"
            onClick={toggleInputSection}
          >
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              {isInputCollapsed ? (
                <>
                  <ChevronUp className="h-3 w-3" />
                  <span>Show input</span>
                </>
              ) : (
                <>
                  <ChevronDown className="h-3 w-3" />
                  <span>Hide input</span>
                </>
              )}
            </div>
          </div>

          <div
            className={cn(
              "overflow-hidden transition-all duration-300 ease-in-out",
              isInputCollapsed ? "max-h-0" : "max-h-[300px]"
            )}
          >
            <div className="p-4">
              <div className="max-w-4xl mx-auto">
                {/* Voice command button - more prominent but without flashing */}
                <div className="flex justify-center mb-4">
                  <Button
                    size="lg"
                    className="h-14 px-6 rounded-full transition-all duration-150 shadow-lg bg-primary text-primary-foreground hover:bg-primary/90"
                    onClick={toggleVoiceMode}
                  >
                    <div className="flex items-center">
                      <Mic className="h-5 w-5" />
                      <span className="ml-2 font-medium">
                        {voiceMode === "idle"
                          ? "Speak to Terminal Six"
                          : voiceMode === "listening"
                            ? "Listening..."
                            : voiceMode === "processing"
                              ? "Processing..."
                              : "Speaking..."}
                      </span>
                    </div>
                  </Button>
                </div>

                {/* Command categories */}
                <div className="mb-3">
                  <Tabs defaultValue="all" className="w-full">
                    <TabsList className="w-full justify-start mb-2 overflow-x-auto flex-nowrap">
                      <TabsTrigger value="all" className="text-xs">
                        All
                      </TabsTrigger>
                      <TabsTrigger value="client" className="text-xs">
                        Clients
                      </TabsTrigger>
                      <TabsTrigger value="market" className="text-xs">
                        Market
                      </TabsTrigger>
                      <TabsTrigger value="document" className="text-xs">
                        Documents
                      </TabsTrigger>
                      <TabsTrigger value="analysis" className="text-xs">
                        Analysis
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="all" className="m-0">
                      <div className="flex flex-wrap gap-2">
                        {suggestedCommands
                          .filter((cmd) => coreCommands.includes(cmd.command))
                          .map((command, index) => (
                            <Button
                              key={index}
                              variant="outline"
                              size="sm"
                              className="h-8 text-xs"
                              onClick={() =>
                                handleCommandClick(command.command)
                              }
                            >
                              {command.icon}
                              <span className="ml-1">{command.command}</span>
                            </Button>
                          ))}
                      </div>
                    </TabsContent>

                    <TabsContent value="client" className="m-0">
                      <div className="flex flex-wrap gap-2">
                        {suggestedCommands
                          .filter((cmd) => cmd.category === "client")
                          .map((command, index) => (
                            <Button
                              key={index}
                              variant="outline"
                              size="sm"
                              className="h-8 text-xs"
                              onClick={() =>
                                handleCommandClick(command.command)
                              }
                            >
                              {command.icon}
                              <span className="ml-1">{command.command}</span>
                            </Button>
                          ))}
                      </div>
                    </TabsContent>

                    <TabsContent value="market" className="m-0">
                      <div className="flex flex-wrap gap-2">
                        {suggestedCommands
                          .filter((cmd) => cmd.category === "market")
                          .map((command, index) => (
                            <Button
                              key={index}
                              variant="outline"
                              size="sm"
                              className="h-8 text-xs"
                              onClick={() =>
                                handleCommandClick(command.command)
                              }
                            >
                              {command.icon}
                              <span className="ml-1">{command.command}</span>
                            </Button>
                          ))}
                      </div>
                    </TabsContent>

                    <TabsContent value="document" className="m-0">
                      <div className="flex flex-wrap gap-2">
                        {suggestedCommands
                          .filter((cmd) => cmd.category === "document")
                          .map((command, index) => (
                            <Button
                              key={index}
                              variant="outline"
                              size="sm"
                              className="h-8 text-xs"
                              onClick={() =>
                                handleCommandClick(command.command)
                              }
                            >
                              {command.icon}
                              <span className="ml-1">{command.command}</span>
                            </Button>
                          ))}
                      </div>
                    </TabsContent>

                    <TabsContent value="analysis" className="m-0">
                      <div className="flex flex-wrap gap-2">
                        {suggestedCommands
                          .filter((cmd) => cmd.category === "analysis")
                          .map((command, index) => (
                            <Button
                              key={index}
                              variant="outline"
                              size="sm"
                              className="h-8 text-xs"
                              onClick={() =>
                                handleCommandClick(command.command)
                              }
                            >
                              {command.icon}
                              <span className="ml-1">{command.command}</span>
                            </Button>
                          ))}
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>

                {/* Text input with autocomplete */}
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Input
                      ref={inputRef}
                      placeholder="Type / for commands or ask anything..."
                      value={inputValue}
                      onChange={handleInputChange}
                      onKeyDown={handleKeyDown}
                      className="pr-10"
                    />

                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1/2 transform -translate-y-1/2"
                      onClick={() => handleUserMessage(inputValue)}
                      disabled={inputValue.trim() === "" || isLoading}
                    >
                      <Send className="h-4 w-4" />
                    </Button>

                    {/* Command autocomplete dropdown */}
                    {showCommandAutocomplete && (
                      <div className="absolute z-10 w-full bottom-full mb-1 bg-card border border-border rounded-md shadow-lg max-h-60 overflow-auto">
                        {filteredCommands.map((command, index) => (
                          <div
                            key={index}
                            className={cn(
                              "flex items-center p-2 cursor-pointer hover:bg-muted transition-colors duration-100",
                              selectedCommandIndex === index && "bg-muted"
                            )}
                            onClick={() => selectCommand(command.command)}
                          >
                            <div className="mr-2">{command.icon}</div>
                            <div className="flex-1">
                              <div className="font-medium text-sm">
                                {command.command}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {command.description}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
                  <div>Powered by Terminal Six AI</div>
                  <div>Type / for commands or use voice</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
