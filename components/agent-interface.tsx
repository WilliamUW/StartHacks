"use client"

import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  FileText,
  Loader2,
  Maximize2,
  MessageSquare,
  Mic,
  MicOff,
  Minimize2,
  Paperclip,
  Percent,
  Send,
  Sparkles,
  Volume2,
  X,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useEffect, useRef, useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type React from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

type Message = {
  id: string
  content: string
  sender: "user" | "agent"
  timestamp: Date
  type?: "default" | "thinking" | "powerpoint-preview"
  thinking?: { id: string; content: string; status: "loading" | "complete" }[]
  data?: any
}

export default function AgentInterface() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isOpen, setIsOpen] = useState(true)
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello, I'm Terminal Six AI. How can I assist you with Jane Appleseed's portfolio today?",
      sender: "agent",
      timestamp: new Date(),
    },
  ])
  const [height, setHeight] = useState(300)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStartY, setDragStartY] = useState(0)
  const [dragStartHeight, setDragStartHeight] = useState(0)
  const [isVoiceActive, setIsVoiceActive] = useState(false)
  const [voiceMode, setVoiceMode] = useState<"idle" | "listening" | "processing" | "speaking">("idle")
  const [audioVisualization, setAudioVisualization] = useState<number[]>(Array(20).fill(5))

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const resizeHandleRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Smooth animation for audio visualization
  useEffect(() => {
    if (voiceMode === "listening" || voiceMode === "speaking") {
      const interval = setInterval(() => {
        setAudioVisualization((prev) => prev.map(() => Math.max(3, Math.min(30, Math.floor(Math.random() * 30)))))
      }, 50)
      return () => clearInterval(interval)
    } else {
      setAudioVisualization(Array(20).fill(5))
    }
  }, [voiceMode])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        e.preventDefault()
        const deltaY = dragStartY - e.clientY
        const newHeight = Math.max(200, Math.min(window.innerHeight * 0.8, dragStartHeight + deltaY))

        // Use requestAnimationFrame for smoother updates
        requestAnimationFrame(() => {
          if (containerRef.current) {
            containerRef.current.style.height = `${newHeight}px`
          }
        })
      }
    }

    const handleMouseUp = () => {
      if (isDragging) {
        setIsDragging(false)
        // Update state after dragging ends
        if (containerRef.current) {
          setHeight(containerRef.current.clientHeight)
        }
      }
    }

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove, { passive: false })
      document.addEventListener("mouseup", handleMouseUp)
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isDragging, dragStartY, dragStartHeight])

  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsDragging(true)
    setDragStartY(e.clientY)
    setDragStartHeight(height)
  }

  const handleSendMessage = () => {
    if (inputValue.trim() === "") return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsLoading(true)

    // Simulate AI response
    setTimeout(() => {
      let response = ""

      if (
        inputValue.toLowerCase().includes("sell") ||
        inputValue.toLowerCase().includes("cash") ||
        inputValue.toLowerCase().includes("50k")
      ) {
        response =
          "Based on Jane's goal to save for a house down payment, I've analyzed his portfolio and recommend selling the following positions to generate $50,000 in cash:\n\n• AAPL: 50 shares ($10,500)\n• MSFT: 25 shares ($9,750)\n• VTI: 100 shares ($24,800)\n• VXUS: 50 shares ($5,250)\n\nTotal: $50,300\n\nThis rebalancing maintains his overall asset allocation while slightly reducing exposure to technology. Would you like me to execute these trades?"
      } else if (inputValue.toLowerCase().includes("portfolio") || inputValue.toLowerCase().includes("performance")) {
        response =
          "Jane's portfolio has returned 13.2% YTD, outperforming the S&P 500 by 2.1%. The strongest performers have been his technology holdings (+18.7%) and healthcare stocks (+15.2%). His fixed income allocation has underperformed (-0.8%) due to rising interest rates."
      } else if (inputValue.toLowerCase().includes("report") || inputValue.toLowerCase().includes("document")) {
        response =
          "I've generated a comprehensive portfolio report for Jane Appleseed. The report includes:\n\n• Current asset allocation\n• YTD performance analysis\n• Recent transactions\n• Progress toward financial goals\n• Tax implications of recent trades\n\nWould you like me to send this report to Jane via email or would you prefer to download it now?"
      } else {
        response =
          "I understand you're looking for information about Jane Appleseed's portfolio. How specifically can I help you today? I can provide portfolio analysis, suggest rebalancing options, generate reports, or help with other financial planning tasks."
      }

      const agentMessage: Message = {
        id: Date.now().toString(),
        content: response,
        sender: "agent",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, agentMessage])
      setIsLoading(false)
    }, 500)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const toggleVoiceMode = () => {
    if (voiceMode === "idle") {
      setVoiceMode("listening")
      // Simulate voice recognition after 3 seconds
      setTimeout(() => {
        setVoiceMode("processing")
        // Simulate processing for 1.5 seconds
        setTimeout(() => {
          // Add a simulated voice message
          const userMessage: Message = {
            id: Date.now().toString(),
            content: "Show me Jane's portfolio performance",
            sender: "user",
            timestamp: new Date(),
          }
          setMessages((prev) => [...prev, userMessage])
          setVoiceMode("speaking")

          // Simulate AI speaking for 3 seconds
          setTimeout(() => {
            const agentMessage: Message = {
              id: Date.now().toString(),
              content:
                "Jane's portfolio has returned 13.2% YTD, outperforming the S&P 500 by 2.1%. The strongest performers have been his technology holdings (+18.7%) and healthcare stocks (+15.2%).",
              sender: "agent",
              timestamp: new Date(),
            }
            setMessages((prev) => [...prev, agentMessage])
            setVoiceMode("idle")
          }, 1000)
        }, 500)
      }, 1000)
    } else {
      setVoiceMode("idle")
    }
  }

  const processUserMessage = (message: string) => {
    const lowerMessage = message.toLowerCase()

    if (lowerMessage.startsWith("/help")) {
      // Display help information
    } else if (lowerMessage.startsWith("/clear")) {
      // Clear the chat history
    } else if (lowerMessage.startsWith("/portfolio")) {
      // Display portfolio information
    } else if (lowerMessage.startsWith("/performance")) {
      // Display performance metrics
    } else if (lowerMessage.startsWith("/rebalance")) {
      // Initiate portfolio rebalancing
    } else if (lowerMessage.startsWith("/risk")) {
      // Display risk assessment
    } else if (lowerMessage.startsWith("/tax")) {
      // Display tax information
    } else if (lowerMessage.startsWith("/compliance")) {
      // Display compliance information
    }
    // PowerPoint command
    else if (lowerMessage.startsWith("/create powerpoint") || lowerMessage.includes("powerpoint")) {
      // Extract client name if present
      const clientMatch = message.match(/\/create powerpoint\s+([A-Za-z\s]+)/)
      const clientName = clientMatch ? clientMatch[1].trim() : "Jane Appleseed" // Default to Jane Appleseed if no client specified
      handlePowerPointRequest(clientName)
    } else {
      // Default response
    }
  }

  const handlePowerPointRequest = (clientName = "Jane Appleseed") => {
    // Create a thinking message first
    const thinkingMessage: Message = {
      id: Date.now().toString(),
      content: `Creating PowerPoint presentation for ${clientName}...`,
      type: "thinking",
      sender: "agent",
      timestamp: new Date(),
      thinking: [
        {
          id: "1",
          content: `Retrieving portfolio data for ${clientName}`,
          status: "loading",
        },
      ],
    }

    setMessages((prevMessages) => [...prevMessages, thinkingMessage])

    // Simulate the creation process
    setTimeout(() => {
      // Update the thinking message status
      const updatedThinkingMessage: Message = {
        ...thinkingMessage,
        thinking: thinkingMessage.thinking?.map((item) => ({
          ...item,
          status: "complete",
        })),
      }

      setMessages((prevMessages) =>
        prevMessages.map((msg) => (msg.id === thinkingMessage.id ? updatedThinkingMessage : msg)),
      )

      // Simulate further steps
      setTimeout(() => {
        const powerPointPreviewMessage: Message = {
          id: Date.now().toString(),
          content: `I've created a professional PowerPoint presentation for ${clientName}'s portfolio review:`,
          type: "powerpoint-preview",
          sender: "agent",
          timestamp: new Date(),
          data: {
            fileName: `${clientName.replace(/\s+/g, "_")}_Portfolio_Review_Q1_2025.pptx`,
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
        }

        setMessages((prevMessages) => [...prevMessages, powerPointPreviewMessage])
      }, 500)
    }, 500)
  }

  const renderMessageContent = (message: Message) => {
    switch (message.type) {
      case "thinking":
        return (
          <div className="flex flex-col">
            <p className="text-sm">{message.content}</p>
            {message.thinking?.map((item) => (
              <div key={item.id} className="flex items-center text-sm text-muted-foreground mt-1">
                {item.status === "loading" ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-4 h-4 mr-2"
                  >
                    <path
                      fillRule="evenodd"
                      d="M19.916 4.626a.75.75 0 01.208 1.04l-9 12a.75.75 0 01-1.082.01L3.454 12.47a.75.75 0 011.06-1.06l6.764 7.374 8.42-10.5a.75.75 0 011.04-.208z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
                {item.content}
              </div>
            ))}
          </div>
        )
      case "powerpoint-preview":
        return (
          <div className="space-y-4">
            <p className="text-sm">{message.content}</p>

            <Card className="overflow-hidden shadow-lg">
              <CardContent className="p-0">
                <div className="p-4 border-b bg-gray-50 dark:bg-gray-800">
                  <h3 className="font-medium">PowerPoint Preview</h3>
                  <p className="text-sm text-muted-foreground mt-1">Preview of your professional presentation</p>
                </div>
                <div className="relative">
                  {/* PowerPoint Slide Preview */}
                  <div className="aspect-[16/9] bg-white dark:bg-gray-900 border-b relative overflow-hidden">
                    {/* Slide Background with Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-800">
                      {/* Decorative Elements */}
                      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                      <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>
                    </div>

                    {/* Slide Content */}
                    <div className="absolute inset-0 flex flex-col p-10">
                      {/* Company Logo */}
                      <div className="absolute top-6 right-8 flex items-center">
                        <div className="h-8 w-8 bg-white rounded-full flex items-center justify-center mr-2">
                          <div className="h-6 w-6 bg-primary rounded-full"></div>
                        </div>
                        <span className="text-white font-semibold text-sm">TERMINAL SIX</span>
                      </div>

                      {/* Slide Header */}
                      <div className="mb-6">
                        <h2 className="text-3xl font-bold text-white">Portfolio Performance</h2>
                        <p className="text-white/80 text-xl">Q1 2025 Executive Summary</p>
                      </div>

                      {/* Slide Content */}
                      <div className="flex-1 flex">
                        <div className="w-1/2 flex items-center">
                          <div className="space-y-6">
                            <div className="flex items-start">
                              <div className="h-6 w-6 rounded-full bg-white/20 flex items-center justify-center mr-3 mt-0.5">
                                <ArrowUpRight className="h-3 w-3 text-white" />
                              </div>
                              <div>
                                <h4 className="text-white font-medium">Performance Metrics</h4>
                                <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-1">
                                  <div>
                                    <p className="text-white/70 text-xs">YTD Return</p>
                                    <p className="text-white text-sm font-medium">+13.2%</p>
                                  </div>
                                  <div>
                                    <p className="text-white/70 text-xs">Benchmark</p>
                                    <p className="text-white text-sm font-medium">+9.7%</p>
                                  </div>
                                  <div>
                                    <p className="text-white/70 text-xs">Alpha</p>
                                    <p className="text-white text-sm font-medium">+3.5%</p>
                                  </div>
                                  <div>
                                    <p className="text-white/70 text-xs">Sharpe Ratio</p>
                                    <p className="text-white text-sm font-medium">1.8</p>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-start">
                              <div className="h-6 w-6 rounded-full bg-white/20 flex items-center justify-center mr-3 mt-0.5">
                                <Percent className="h-3 w-3 text-white" />
                              </div>
                              <div>
                                <h4 className="text-white font-medium">Sector Performance</h4>
                                <p className="text-white/70 text-sm mt-1">
                                  <span className="text-green-300">Top: </span>
                                  Technology Sector (+21.4%)
                                </p>
                                <p className="text-white/70 text-sm">
                                  <span className="text-red-300">Bottom: </span>
                                  Utilities Sector (-2.3%)
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="w-1/2 flex items-center justify-center">
                          <div className="w-64 h-64 rounded-lg bg-white/10 backdrop-blur-sm flex items-center justify-center">
                            <div className="w-full h-full flex flex-col justify-end">
                              <div className="w-full h-1 bg-white/20"></div>
                              <div className="flex h-40 items-end pt-4">
                                {[
                                  { height: 55, label: "Q1", value: 8.2 },
                                  { height: 35, label: "Q2", value: 5.1 },
                                  { height: 65, label: "Q3", value: 9.8 },
                                  { height: 85, label: "Q4", value: 13.2 },
                                ].map((bar, i) => (
                                  <div key={i} className="flex-1 flex flex-col items-center">
                                    <div
                                      className="w-8 bg-gradient-to-t from-blue-400 to-blue-300 rounded-t-sm"
                                      style={{ height: `${bar.height}%` }}
                                    >
                                      <div className="h-1 w-full bg-white/40 rounded-t-sm"></div>
                                    </div>
                                    <div className="text-white/80 text-xs mt-1">{bar.label}</div>
                                    <div className="text-white text-xs font-medium">{bar.value}%</div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Slide Footer */}
                      <div className="mt-4 pt-4 flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-white rounded-full mr-1"></div>
                          <p className="text-sm text-white/70">CONFIDENTIAL</p>
                        </div>
                        <p className="text-sm text-white/70">Slide 1 of {message.data.totalSlides}</p>
                      </div>
                    </div>
                  </div>

                  {/* Slide Navigation */}
                  <div className="flex justify-between p-3 bg-gray-50 dark:bg-gray-800 border-t">
                    <Button variant="outline" size="sm">
                      <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                    </Button>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, index) => (
                        <div
                          key={index}
                          className={`w-2 h-2 mx-1 rounded-full cursor-pointer transition-colors ${index === 0 ? "bg-primary" : "bg-gray-300 dark:bg-gray-600"}`}
                        />
                      ))}
                    </div>
                    <Button variant="outline" size="sm">
                      Next <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-md hover:bg-muted/50 transition-colors cursor-pointer">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-4 w-4 text-primary" />
                  <h4 className="font-medium">{message.data.fileName}</h4>
                </div>
                <div className="grid grid-cols-2 gap-y-1 text-sm">
                  <span className="text-muted-foreground">Total Slides:</span>
                  <span>{message.data.totalSlides}</span>
                  <span className="text-muted-foreground">Created:</span>
                  <span>{new Date().toLocaleDateString()}</span>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Included Slides</h4>
                <div className="space-y-1">
                  {message.data.slides.map((slide: string, index: number) => (
                    <div key={index} className="flex items-center text-sm">
                      <div className="w-5 h-5 rounded-sm bg-[#B7472A]/10 text-[#B7472A] flex items-center justify-center mr-2 text-xs">
                        {index + 1}
                      </div>
                      {slide}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button size="sm">Download PowerPoint</Button>
              <Button variant="outline" size="sm">
                <FileText className="h-4 w-4 mr-1" />
                Edit Presentation
              </Button>
            </div>
          </div>
        )
      default:
        return <div className="whitespace-pre-line">{message.content}</div>
    }
  }

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          size="icon"
          className="h-12 w-12 rounded-full shadow-lg bg-primary hover:bg-primary/90"
          onClick={() => setIsOpen(true)}
        >
          <MessageSquare className="h-6 w-6 text-primary-foreground" />
        </Button>
      </div>
    )
  }

  return (
    <>
      {/* Resize handle */}
      <div
        ref={resizeHandleRef}
        className="h-1 bg-border hover:bg-primary/30 cursor-ns-resize w-full transition-colors duration-200"
        onMouseDown={handleResizeMouseDown}
      />

      <div
        ref={containerRef}
        className={`border-t border-border bg-card transition-all duration-150 flex flex-col`}
        style={{ height: isExpanded ? "70vh" : `${height}px` }}
      >
        <div className="flex items-center justify-between px-4 py-2 border-b border-border flex-shrink-0">
          <div className="flex items-center">
            <Sparkles className="h-5 w-5 text-primary mr-2" />
            <h3 className="font-medium">Terminal Six AI</h3>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" onClick={() => setIsExpanded(!isExpanded)}>
              {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          <Tabs defaultValue="chat" className="flex flex-col h-full">
            <div className="px-4 pt-2 flex-shrink-0">
              <div className="flex items-center">
                <Button
                  variant={isVoiceActive ? "default" : "outline"}
                  size="sm"
                  className={cn(
                    "rounded-r-none border-r-0 gap-1 h-8",
                    isVoiceActive && "bg-primary text-primary-foreground",
                  )}
                  onClick={() => setIsVoiceActive(true)}
                >
                  <Volume2 className="h-4 w-4" />
                  <span>Voice</span>
                </Button>
                <TabsList className="h-8 rounded-l-none">
                  <TabsTrigger value="chat" className="h-8" onClick={() => setIsVoiceActive(false)}>
                    Chat
                  </TabsTrigger>
                  <TabsTrigger value="commands" className="h-8">
                    Commands
                  </TabsTrigger>
                  <TabsTrigger value="history" className="h-8">
                    History
                  </TabsTrigger>
                </TabsList>
              </div>
            </div>

            {isVoiceActive ? (
              <div className="flex-1 flex flex-col p-4 overflow-hidden">
                <div className="flex-1 flex flex-col items-center justify-center">
                  <div className="relative mb-6">
                    <div className="absolute inset-0 bg-primary/10 rounded-full blur-xl"></div>
                    <Button
                      variant={voiceMode !== "idle" ? "default" : "outline"}
                      size="icon"
                      className={cn(
                        "h-20 w-20 rounded-full relative z-10 transition-all duration-200",
                        voiceMode !== "idle" && "bg-primary text-primary-foreground animate-pulse",
                      )}
                      onClick={toggleVoiceMode}
                    >
                      {voiceMode === "idle" ? (
                        <Mic className="h-8 w-8" />
                      ) : voiceMode === "listening" ? (
                        <Mic className="h-8 w-8" />
                      ) : voiceMode === "processing" ? (
                        <Loader2 className="h-8 w-8 animate-spin" />
                      ) : (
                        <Volume2 className="h-8 w-8" />
                      )}
                    </Button>
                  </div>

                  <div className="text-center mb-4">
                    <h3 className="text-lg font-medium mb-1">
                      {voiceMode === "idle"
                        ? "Tap to speak"
                        : voiceMode === "listening"
                          ? "Listening..."
                          : voiceMode === "processing"
                            ? "Processing..."
                            : "Speaking..."}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {voiceMode === "idle"
                        ? "Ask Terminal Six about Jane's portfolio"
                        : voiceMode === "listening"
                          ? "Say something like 'Show me portfolio performance'"
                          : voiceMode === "processing"
                            ? "Analyzing your request"
                            : "Terminal Six is responding"}
                    </p>
                  </div>

                  {/* Audio visualization */}
                  <div className="flex items-end justify-center gap-[2px] h-20 w-full max-w-md">
                    {audioVisualization.map((height, i) => (
                      <div
                        key={i}
                        className={cn(
                          "w-[8px] bg-primary rounded-full transition-all duration-100",
                          voiceMode === "idle" ? "bg-muted" : "bg-primary",
                        )}
                        style={{
                          height: `${height}px`,
                          opacity: voiceMode === "idle" ? 0.3 : 0.7,
                        }}
                      ></div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 flex justify-center">
                  <div className="text-xs text-muted-foreground">
                    {voiceMode !== "idle" ? (
                      <Button variant="outline" size="sm" onClick={() => setVoiceMode("idle")}>
                        <MicOff className="h-3 w-3 mr-2" />
                        Cancel
                      </Button>
                    ) : (
                      "Try asking about portfolio performance, market trends, or client goals"
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <>
                <TabsContent
                  value="chat"
                  className="flex-1 flex flex-col overflow-hidden m-0 data-[state=active]:flex-1"
                >
                  <ScrollArea className="flex-1 p-4">
                    <div className="space-y-4">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[80%] rounded-lg p-3 ${
                              message.sender === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                            }`}
                          >
                            {renderMessageContent(message)}
                            <div
                              className={`text-xs mt-1 ${
                                message.sender === "user" ? "text-primary-foreground/70" : "text-muted-foreground"
                              }`}
                            >
                              {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </div>
                          </div>
                        </div>
                      ))}
                      {isLoading && (
                        <div className="flex justify-start">
                          <div className="bg-muted rounded-lg p-3">
                            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                          </div>
                        </div>
                      )}
                      <div ref={messagesEndRef} />
                    </div>
                  </ScrollArea>

                  <div className="p-4 border-t border-border flex-shrink-0">
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon">
                        <Paperclip className="h-5 w-5" />
                      </Button>
                      <div className="relative flex-1">
                        <Input
                          placeholder="Ask Terminal Six..."
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                          onKeyDown={handleKeyDown}
                          className="pr-10"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute right-1 top-1/2 transform -translate-y-1/2"
                          onClick={handleSendMessage}
                          disabled={inputValue.trim() === "" || isLoading}
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
                      <div>Powered by Six AI</div>
                      <div className="flex items-center">
                        <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                          Suggested: Rebalance portfolio
                        </Button>
                        <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                          Generate report
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="commands" className="flex-1 overflow-hidden m-0 data-[state=active]:flex-1">
                  <ScrollArea className="h-full p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="border border-border rounded-lg p-4">
                        <h3 className="font-medium mb-2">Portfolio Analysis</h3>
                        <div className="space-y-2 text-sm">
                          <div className="p-2 hover:bg-muted rounded cursor-pointer">/analyze portfolio</div>
                          <div className="p-2 hover:bg-muted rounded cursor-pointer">/compare benchmark</div>
                          <div className="p-2 hover:bg-muted rounded cursor-pointer">/risk assessment</div>
                        </div>
                      </div>

                      <div className="border border-border rounded-lg p-4">
                        <h3 className="font-medium mb-2">Portfolio Management</h3>
                        <div className="space-y-2 text-sm">
                          <div className="p-2 hover:bg-muted rounded cursor-pointer">/rebalance portfolio</div>
                          <div className="p-2 hover:bg-muted rounded cursor-pointer">/sell holdings</div>
                          <div className="p-2 hover:bg-muted rounded cursor-pointer">/buy recommendations</div>
                        </div>
                      </div>

                      <div className="border border-border rounded-lg p-4">
                        <h3 className="font-medium mb-2">Client Management</h3>
                        <div className="space-y-2 text-sm">
                          <div className="p-2 hover:bg-muted rounded cursor-pointer">/generate report</div>
                          <div className="p-2 hover:bg-muted rounded cursor-pointer">/schedule meeting</div>
                          <div className="p-2 hover:bg-muted rounded cursor-pointer">/update goals</div>
                        </div>
                      </div>

                      <div className="border border-border rounded-lg p-4">
                        <h3 className="font-medium mb-2">Documents</h3>
                        <div className="space-y-2 text-sm">
                          <div className="p-2 hover:bg-muted rounded cursor-pointer">/generate report</div>
                          <div className="p-2 hover:bg-muted rounded cursor-pointer">/create presentation</div>
                          <div className="p-2 hover:bg-muted rounded cursor-pointer">/draft email</div>
                        </div>
                      </div>

                      <div className="border border-border rounded-lg p-4">
                        <h3 className="font-medium mb-2">Tax Planning</h3>
                        <div className="space-y-2 text-sm">
                          <div className="p-2 hover:bg-muted rounded cursor-pointer">/tax-loss harvesting</div>
                          <div className="p-2 hover:bg-muted rounded cursor-pointer">/tax efficiency analysis</div>
                          <div className="p-2 hover:bg-muted rounded cursor-pointer">/capital gains projection</div>
                        </div>
                      </div>

                      <div className="border border-border rounded-lg p-4">
                        <h3 className="font-medium mb-2">Regulatory Compliance</h3>
                        <div className="space-y-2 text-sm">
                          <div className="p-2 hover:bg-muted rounded cursor-pointer">/compliance check</div>
                          <div className="p-2 hover:bg-muted rounded cursor-pointer">/regulatory updates</div>
                          <div className="p-2 hover:bg-muted rounded cursor-pointer">/disclosure requirements</div>
                        </div>
                      </div>
                    </div>
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="history" className="flex-1 overflow-hidden m-0 data-[state=active]:flex-1">
                  <ScrollArea className="h-full p-4">
                    <div className="space-y-4">
                      <div className="border border-border rounded-lg p-3">
                        <div className="flex justify-between items-center">
                          <h3 className="font-medium">Portfolio Rebalancing</h3>
                          <span className="text-xs text-muted-foreground">March 15, 2025</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          Generated rebalancing plan to free up $50,000 for house down payment
                        </p>
                      </div>

                      <div className="border border-border rounded-lg p-3">
                        <div className="flex justify-between items-center">
                          <h3 className="font-medium">Performance Analysis</h3>
                          <span className="text-xs text-muted-foreground">March 10, 2025</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          Analyzed YTD performance against benchmarks
                        </p>
                      </div>

                      <div className="border border-border rounded-lg p-3">
                        <div className="flex justify-between items-center">
                          <h3 className="font-medium">Tax Planning</h3>
                          <span className="text-xs text-muted-foreground">March 5, 2025</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          Generated tax-loss harvesting recommendations
                        </p>
                      </div>

                      <div className="border border-border rounded-lg p-3">
                        <div className="flex justify-between items-center">
                          <h3 className="font-medium">Goal Setting</h3>
                          <span className="text-xs text-muted-foreground">February 28, 2025</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          Updated investment goals to include house purchase
                        </p>
                      </div>

                      <div className="border border-border rounded-lg p-3">
                        <div className="flex justify-between items-center">
                          <h3 className="font-medium">Regulatory Compliance Check</h3>
                          <span className="text-xs text-muted-foreground">February 25, 2025</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          Verified portfolio compliance with updated regulations
                        </p>
                      </div>

                      <div className="border border-border rounded-lg p-3">
                        <div className="flex justify-between items-center">
                          <h3 className="font-medium">Client Risk Assessment</h3>
                          <span className="text-xs text-muted-foreground">February 20, 2025</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          Updated risk tolerance profile after annual review
                        </p>
                      </div>

                      <div className="border border-border rounded-lg p-3">
                        <div className="flex justify-between items-center">
                          <h3 className="font-medium">Estate Planning Discussion</h3>
                          <span className="text-xs text-muted-foreground">February 15, 2025</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          Reviewed trust structures and inheritance planning
                        </p>
                      </div>

                      <div className="border border-border rounded-lg p-3">
                        <div className="flex justify-between items-center">
                          <h3 className="font-medium">Market Downturn Strategy</h3>
                          <span className="text-xs text-muted-foreground">February 10, 2025</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          Prepared contingency plan for potential market volatility
                        </p>
                      </div>
                    </div>
                  </ScrollArea>
                </TabsContent>
              </>
            )}
          </Tabs>
        </div>
      </div>
    </>
  )
}

