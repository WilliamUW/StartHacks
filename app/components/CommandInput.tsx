import React, { forwardRef } from "react"
import { Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SuggestedCommand } from "@/app/types"
import { cn } from "@/lib/utils"

interface CommandInputProps {
    inputValue: string
    isLoading: boolean
    showCommandAutocomplete: boolean
    filteredCommands: SuggestedCommand[]
    selectedCommandIndex: number
    onInputChange: (value: string) => void
    onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void
    onSubmit: () => void
    onCommandSelect: (command: string) => void
}

export const CommandInput = forwardRef<HTMLInputElement, CommandInputProps>(
    (
        {
            inputValue,
            isLoading,
            showCommandAutocomplete,
            filteredCommands,
            selectedCommandIndex,
            onInputChange,
            onKeyDown,
            onSubmit,
            onCommandSelect,
        },
        ref
    ) => {
        return (
            <div className="relative">
                <div className="flex gap-2">
                    <Input
                        ref={ref}
                        value={inputValue}
                        onChange={(e) => onInputChange(e.target.value)}
                        onKeyDown={onKeyDown}
                        placeholder="Type a command (e.g. /client) or ask a question..."
                        className="flex-1"
                        disabled={isLoading}
                    />
                    <Button
                        onClick={onSubmit}
                        disabled={!inputValue.trim() || isLoading}
                        size="icon"
                    >
                        <Send className="h-4 w-4" />
                    </Button>
                </div>

                {showCommandAutocomplete && filteredCommands.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-background border rounded-md shadow-lg z-10">
                        {filteredCommands.map((command, index) => (
                            <button
                                key={command.command}
                                className={`w-full px-4 py-2 text-left flex items-center gap-2 hover:bg-muted ${index === selectedCommandIndex ? "bg-muted" : ""
                                    }`}
                                onClick={() => onCommandSelect(command.command)}
                            >
                                {command.icon}
                                <div className="flex-1">
                                    <div className="font-medium">{command.command}</div>
                                    <div className="text-sm text-muted-foreground">{command.description}</div>
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        )
    }
)

CommandInput.displayName = "CommandInput" 