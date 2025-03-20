import React from "react"

interface MessageTimestampProps {
    timestamp: Date
}

export function MessageTimestamp({ timestamp }: MessageTimestampProps) {
    return (
        <span>
            {timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </span>
    )
} 