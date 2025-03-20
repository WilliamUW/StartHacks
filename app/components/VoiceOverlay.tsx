import React from "react"
import { Mic, MicOff, Loader2, Volume2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { VoiceMode } from "@/app/types"

interface VoiceOverlayProps {
    voiceMode: VoiceMode
    onToggleVoice: () => void
    audioData?: number[]
}

export function VoiceOverlay({ voiceMode, onToggleVoice, audioData }: VoiceOverlayProps) {
    return (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="w-full max-w-md p-6 space-y-6">
                <div className="flex justify-center">
                    {voiceMode === "idle" && (
                        <Button
                            size="lg"
                            variant="outline"
                            className="w-16 h-16 rounded-full"
                            onClick={onToggleVoice}
                        >
                            <Mic className="h-6 w-6" />
                        </Button>
                    )}
                    {voiceMode === "listening" && (
                        <div className="relative">
                            <Button
                                size="lg"
                                variant="destructive"
                                className="w-16 h-16 rounded-full"
                                onClick={onToggleVoice}
                            >
                                <MicOff className="h-6 w-6" />
                            </Button>
                            {audioData && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="flex items-center gap-1">
                                        {audioData.map((value, index) => (
                                            <div
                                                key={index}
                                                className="w-1 bg-white rounded-full"
                                                style={{ height: `${value}%` }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                    {voiceMode === "processing" && (
                        <div className="text-center">
                            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                            <p className="text-sm text-muted-foreground">Processing your voice...</p>
                        </div>
                    )}
                    {voiceMode === "speaking" && (
                        <div className="text-center">
                            <Volume2 className="h-8 w-8 mx-auto mb-2" />
                            <p className="text-sm text-muted-foreground">Speaking...</p>
                        </div>
                    )}
                </div>

                <div className="text-center space-y-2">
                    <p className="text-sm font-medium">Try saying:</p>
                    <div className="flex flex-wrap gap-2 justify-center">
                        <span className="text-sm text-muted-foreground">"Show me John Smith's portfolio"</span>
                        <span className="text-sm text-muted-foreground">"What's the price of AAPL?"</span>
                        <span className="text-sm text-muted-foreground">"Generate a report"</span>
                    </div>
                </div>
            </div>
        </div>
    )
} 