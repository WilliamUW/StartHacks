import { ReactNode } from "react"

export type MessageType =
    | "text"
    | "thinking"
    | "client-info"
    | "stock-info"
    | "portfolio-info"
    | "excel-preview"
    | "powerpoint-preview"
    | "financial-advice"
    | "command-result"
    | "error"

export type VoiceMode = "idle" | "listening" | "processing" | "speaking"

export interface ThinkingStep {
    id: string
    content: string
    status: "loading" | "complete" | "error"
    result?: string
    data?: any
}

export interface Message {
    id: string
    content: string
    type: MessageType
    sender: "user" | "agent"
    timestamp: Date
    data?: any
    thinking?: ThinkingStep[]
}

export interface SuggestedCommand {
    command: string
    description: string
    icon: ReactNode
    category: string
} 