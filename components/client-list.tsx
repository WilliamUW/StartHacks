"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bell, Clock, Search, Settings, Star, Users } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ModeToggle } from "@/components/mode-toggle"
import { NotificationSummary } from "@/components/notification-summary"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { useState } from "react"

const clients = [
  {
    id: 1,
    name: "Jane Appleseed",
    image: "/clients/client1.png",
    portfolioValue: "$2.4M",
    returnRate: 13.2,
    lastContact: "2 days ago",
    priority: "high",
    hasUpdate: true,
  },
  {
    id: 2,
    name: "Sarah Janeson",
    image: "/clients/client2.png",
    portfolioValue: "$1.8M",
    returnRate: 8.7,
    lastContact: "1 week ago",
    priority: "medium",
    hasUpdate: false,
  },
  {
    id: 3,
    name: "Michael Chen",
    image: "/clients/client3.png",
    portfolioValue: "$3.2M",
    returnRate: -2.1,
    lastContact: "3 days ago",
    priority: "medium",
    hasUpdate: true,
  },
  {
    id: 4,
    name: "Emma Wilson",
    image: "/clients/client4.png",
    portfolioValue: "$950K",
    returnRate: 5.4,
    lastContact: "Today",
    priority: "high",
    hasUpdate: false,
  },
  {
    id: 5,
    name: "David Rodriguez",
    image: "/clients/client5.png",
    portfolioValue: "$1.2M",
    returnRate: 10.8,
    lastContact: "Yesterday",
    priority: "low",
    hasUpdate: false,
  },
  {
    id: 6,
    name: "Jennifer Lee",
    image: "/clients/client6.png",
    portfolioValue: "$4.7M",
    returnRate: 7.3,
    lastContact: "4 days ago",
    priority: "high",
    hasUpdate: true,
  },
  {
    id: 7,
    name: "Robert Taylor",
    image: "/clients/client7.png",
    portfolioValue: "$2.1M",
    returnRate: -1.2,
    lastContact: "1 week ago",
    priority: "medium",
    hasUpdate: false,
  },
  {
    id: 8,
    name: "Patricia Garcia",
    image: "/clients/client8.png",
    portfolioValue: "$3.5M",
    returnRate: 9.1,
    lastContact: "Yesterday",
    priority: "high",
    hasUpdate: true,
  },
]

export default function ClientList() {
  const [selectedClient, setSelectedClient] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")

  const filteredClients = clients.filter((client) => client.name.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div className="w-80 border-r border-border bg-card flex flex-col h-full">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
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
              <p className="text-xs text-muted-foreground">Wealth Management</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 relative">
                  <Bell className="h-5 w-5 text-muted-foreground hover:text-foreground cursor-pointer" />
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] flex items-center justify-center text-primary-foreground">
                    3
                  </span>
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-80 p-0">
                <NotificationSummary onViewAll={() => {}} />
              </PopoverContent>
            </Popover>
            <ModeToggle />
            <Settings className="h-5 w-5 text-muted-foreground hover:text-foreground cursor-pointer" />
          </div>
        </div>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search clients..."
            className="pl-9 bg-background"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="flex px-4 py-2 border-b border-border text-sm">
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-primary/10 text-primary">
          <Users className="h-4 w-4" />
          <span>All</span>
        </button>
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md ml-2 hover:bg-muted">
          <Star className="h-4 w-4" />
          <span>Priority</span>
        </button>
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md ml-2 hover:bg-muted">
          <Clock className="h-4 w-4" />
          <span>Recent</span>
        </button>
      </div>

      <ScrollArea className="flex-1">
        <div className="px-2 py-2">
          {filteredClients.map((client) => (
            <div
              key={client.id}
              className={cn(
                "flex items-center p-3 rounded-lg mb-1 cursor-pointer relative",
                selectedClient === client.id ? "bg-primary text-primary-foreground" : "hover:bg-muted",
              )}
              onClick={() => setSelectedClient(client.id)}
            >
              <Avatar className="h-10 w-10 mr-3">
                <AvatarImage src={client.image} alt={client.name} />
                <AvatarFallback>
                  {client.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium truncate">{client.name}</h3>
                  {client.hasUpdate && (
                    <span
                      className={cn(
                        "w-2 h-2 rounded-full bg-blue-500",
                        selectedClient === client.id ? "bg-primary-foreground" : "bg-blue-500",
                      )}
                    ></span>
                  )}
                </div>
                <div className="flex items-center text-xs mt-1">
                  <span
                    className={cn(
                      "mr-3",
                      selectedClient === client.id ? "text-primary-foreground/80" : "text-muted-foreground",
                    )}
                  >
                    {client.portfolioValue}
                  </span>
                  <Badge
                    variant={selectedClient === client.id ? "outline" : "secondary"}
                    className={cn(
                      client.returnRate >= 0 ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500",
                      selectedClient === client.id && "border-primary-foreground/30 bg-transparent",
                    )}
                  >
                    {client.returnRate >= 0 ? "+" : ""}
                    {client.returnRate}%
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}

