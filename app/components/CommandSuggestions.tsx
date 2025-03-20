import React from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { SuggestedCommand } from "@/app/types"

interface CommandSuggestionsProps {
    suggestedCommands: SuggestedCommand[]
    coreCommands: SuggestedCommand[]
    onCommandClick: (command: string) => void
}

export function CommandSuggestions({
    suggestedCommands,
    coreCommands,
    onCommandClick,
}: CommandSuggestionsProps) {
    const categories = ["All", "Clients", "Market", "Documents", "Analysis"]

    return (
        <Tabs defaultValue="All" className="w-full">
            <TabsList className="w-full justify-start">
                {categories.map((category) => (
                    <TabsTrigger key={category} value={category}>
                        {category}
                    </TabsTrigger>
                ))}
            </TabsList>

            {categories.map((category) => (
                <TabsContent key={category} value={category}>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                        {(category === "All" ? [...suggestedCommands, ...coreCommands] : suggestedCommands)
                            .filter((cmd) => category === "All" || cmd.category === category)
                            .map((command) => (
                                <Button
                                    key={command.command}
                                    variant="outline"
                                    className="h-auto p-4 flex items-start gap-3 text-left"
                                    onClick={() => onCommandClick(command.command)}
                                >
                                    <div className="mt-1">{command.icon}</div>
                                    <div>
                                        <div className="font-medium">{command.command}</div>
                                        <div className="text-sm text-muted-foreground">{command.description}</div>
                                    </div>
                                </Button>
                            ))}
                    </div>
                </TabsContent>
            ))}
        </Tabs>
    )
} 