"use client"

import { AlertTriangle, Bell, Calendar, CheckCircle2, Clock, ShieldAlert, TrendingDown, Users, X } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { useState } from "react"

type NotificationType = "urgent" | "client" | "market" | "compliance" | "task"
type NotificationPriority = "critical" | "high" | "medium" | "low"

interface Notification {
  id: string
  type: NotificationType
  priority: NotificationPriority
  title: string
  description: string
  time: string
  deadline?: string
  clientName?: string
  isRead: boolean
  actions?: {
    primary?: string
    secondary?: string
  }
}

const notifications: Notification[] = [
  {
    id: "1",
    type: "urgent",
    priority: "critical",
    title: "Portfolio Rebalancing Required",
    description: "Jane Appleseed's portfolio is 15% off target allocation due to recent market volatility.",
    time: "2 hours ago",
    deadline: "Today",
    clientName: "Jane Appleseed",
    isRead: false,
    actions: {
      primary: "Rebalance Now",
      secondary: "Review Details",
    },
  },
  {
    id: "2",
    type: "compliance",
    priority: "high",
    title: "KYC Update Required",
    description: "Sarah Janeson's KYC documentation will expire in 5 days.",
    time: "1 day ago",
    deadline: "5 days",
    clientName: "Sarah Janeson",
    isRead: false,
    actions: {
      primary: "Send Reminder",
      secondary: "View Documents",
    },
  },
  {
    id: "3",
    type: "market",
    priority: "high",
    title: "Market Correction Alert",
    description: "Technology sector experiencing 8% correction. 5 client portfolios affected.",
    time: "3 hours ago",
    deadline: "Today",
    isRead: false,
    actions: {
      primary: "View Affected Portfolios",
      secondary: "Dismiss",
    },
  },
  {
    id: "4",
    type: "client",
    priority: "medium",
    title: "Client Meeting Preparation",
    description: "Prepare quarterly review for Michael Chen scheduled for tomorrow.",
    time: "Yesterday",
    deadline: "Tomorrow",
    clientName: "Michael Chen",
    isRead: true,
    actions: {
      primary: "Prepare Review",
      secondary: "Reschedule",
    },
  },
  {
    id: "5",
    type: "task",
    priority: "medium",
    title: "Tax Loss Harvesting Opportunity",
    description: "Potential tax savings of $12,450 identified across 3 client portfolios.",
    time: "2 days ago",
    deadline: "This week",
    isRead: true,
    actions: {
      primary: "Review Opportunities",
      secondary: "Dismiss",
    },
  },
  {
    id: "6",
    type: "compliance",
    priority: "high",
    title: "Regulatory Filing Deadline",
    description: "Form ADV annual update due in 7 days.",
    time: "3 days ago",
    deadline: "7 days",
    isRead: false,
    actions: {
      primary: "Start Filing",
      secondary: "Assign to Team",
    },
  },
  {
    id: "7",
    type: "client",
    priority: "critical",
    title: "Client Withdrawal Request",
    description: "Emma Wilson requested a $50,000 withdrawal for house down payment.",
    time: "4 hours ago",
    deadline: "2 days",
    clientName: "Emma Wilson",
    isRead: false,
    actions: {
      primary: "Process Request",
      secondary: "Contact Client",
    },
  },
  {
    id: "8",
    type: "market",
    priority: "medium",
    title: "Interest Rate Change",
    description: "Federal Reserve announced 0.25% rate increase. Bond portfolios may be affected.",
    time: "1 day ago",
    deadline: "This week",
    isRead: true,
    actions: {
      primary: "Assess Impact",
      secondary: "Dismiss",
    },
  },
  {
    id: "9",
    type: "task",
    priority: "low",
    title: "Client Birthday",
    description: "David Rodriguez's birthday is in 3 days.",
    time: "Today",
    deadline: "3 days",
    clientName: "David Rodriguez",
    isRead: true,
    actions: {
      primary: "Send Message",
      secondary: "Set Reminder",
    },
  },
]

export default function NotificationCenter() {
  const [activeNotifications, setActiveNotifications] = useState<Notification[]>(notifications)
  const [activeTab, setActiveTab] = useState<string>("all")
  const [isOpen, setIsOpen] = useState(false)

  const unreadCount = activeNotifications.filter((n) => !n.isRead).length

  const markAsRead = (id: string) => {
    setActiveNotifications((prev) =>
      prev.map((notification) => (notification.id === id ? { ...notification, isRead: true } : notification)),
    )
  }

  const dismissNotification = (id: string) => {
    setActiveNotifications((prev) => prev.filter((notification) => notification.id !== id))
  }

  const filteredNotifications =
    activeTab === "all" ? activeNotifications : activeNotifications.filter((n) => n.type === activeTab)

  const getTypeIcon = (type: NotificationType) => {
    switch (type) {
      case "urgent":
        return <AlertTriangle className="h-5 w-5 text-red-400 dark:text-red-500" />
      case "client":
        return <Users className="h-5 w-5 text-muted-foreground" />
      case "market":
        return <TrendingDown className="h-5 w-5 text-muted-foreground" />
      case "compliance":
        return <ShieldAlert className="h-5 w-5 text-muted-foreground" />
      case "task":
        return <Calendar className="h-5 w-5 text-muted-foreground" />
    }
  }

  const getPriorityBadge = (priority: NotificationPriority) => {
    switch (priority) {
      case "critical":
        return (
          <Badge variant="outline" className="bg-red-500/10 text-red-400 dark:text-red-500 border-red-200/50 dark:border-red-800/50">
            Critical
          </Badge>
        )
      case "high":
        return (
          <Badge variant="outline" className="bg-muted text-muted-foreground border-border/50">
            High
          </Badge>
        )
      case "medium":
        return (
          <Badge variant="outline" className="bg-muted text-muted-foreground border-border/50">
            Medium
          </Badge>
        )
      case "low":
        return (
          <Badge variant="outline" className="bg-muted text-muted-foreground border-border/50">
            Low
          </Badge>
        )
    }
  }

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        className="relative hover:bg-muted/50"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className="h-5 w-5 text-muted-foreground" />
        {unreadCount > 0 && (
          <Badge
            className="absolute -top-1 -right-1 h-4 min-w-[16px] px-1 flex items-center justify-center bg-red-500 text-white text-[10px]"
          >
            {unreadCount}
          </Badge>
        )}
      </Button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          <Card className="absolute right-0 top-full mt-2 z-50 w-[480px] shadow-lg animate-in fade-in slide-in-from-top-2 border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <CardHeader className="pb-3 border-b border-border/50">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Bell className="h-5 w-5 text-muted-foreground mr-2" />
                  <CardTitle className="text-lg">Action Center</CardTitle>
                  {unreadCount > 0 && <Badge className="ml-2 bg-red-500 text-white">{unreadCount}</Badge>}
                </div>
                <Button variant="outline" size="sm" className="hover:bg-muted/50">
                  Mark All Read
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Tabs defaultValue="all" onValueChange={setActiveTab}>
                <div className="px-4">
                  <TabsList className="grid grid-cols-6 mb-4 bg-muted/50">
                    <TabsTrigger value="all" className="text-xs data-[state=active]:bg-background">
                      All
                      {unreadCount > 0 && (
                        <Badge variant="secondary" className="ml-1 text-[10px] px-1 bg-background/80">
                          {unreadCount}
                        </Badge>
                      )}
                    </TabsTrigger>
                    <TabsTrigger value="urgent" className="text-xs data-[state=active]:bg-background">
                      Urgent
                      <Badge variant="secondary" className="ml-1 text-[10px] px-1 bg-background/80">
                        {activeNotifications.filter((n) => n.type === "urgent" && !n.isRead).length || 0}
                      </Badge>
                    </TabsTrigger>
                    <TabsTrigger value="client" className="text-xs data-[state=active]:bg-background">
                      Clients
                    </TabsTrigger>
                    <TabsTrigger value="market" className="text-xs data-[state=active]:bg-background">
                      Market
                    </TabsTrigger>
                    <TabsTrigger value="compliance" className="text-xs data-[state=active]:bg-background">
                      Compliance
                    </TabsTrigger>
                    <TabsTrigger value="task" className="text-xs data-[state=active]:bg-background">
                      Tasks
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value={activeTab} className="m-0">
                  <ScrollArea className="h-[400px]">
                    <div className="px-4 pb-4 space-y-3">
                      {filteredNotifications.length > 0 ? (
                        filteredNotifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={cn(
                              "p-3 rounded-lg transition-colors",
                              notification.isRead
                                ? "bg-card hover:bg-muted/30"
                                : notification.type === "urgent"
                                  ? "bg-red-500/5 hover:bg-red-500/10"
                                  : "bg-muted/30 hover:bg-muted/50",
                            )}
                          >
                            <div className="flex items-start gap-3">
                              <div className="flex-shrink-0 mt-1">{getTypeIcon(notification.type)}</div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <h4 className={cn(
                                    "font-medium",
                                    notification.type === "urgent" ? "text-red-400 dark:text-red-500" : "text-foreground"
                                  )}>
                                    {notification.title}
                                  </h4>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 -mr-1 opacity-50 hover:opacity-100 hover:bg-muted/50"
                                    onClick={() => dismissNotification(notification.id)}
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
                                </div>
                                <p className="text-sm text-muted-foreground mt-1">{notification.description}</p>

                                <div className="flex flex-wrap items-center gap-2 mt-2">
                                  {notification.clientName && (
                                    <Badge variant="secondary" className="text-xs bg-muted/50">
                                      <Users className="h-3 w-3 mr-1 text-muted-foreground" />
                                      {notification.clientName}
                                    </Badge>
                                  )}

                                  {getPriorityBadge(notification.priority)}

                                  {notification.deadline && (
                                    <Badge variant="outline" className="text-xs bg-muted/50">
                                      <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
                                      Due: {notification.deadline}
                                    </Badge>
                                  )}
                                </div>

                                <div className="flex items-center justify-between mt-3">
                                  <div className="text-xs text-muted-foreground flex items-center">
                                    <Clock className="h-3 w-3 mr-1" />
                                    {notification.time}
                                  </div>

                                  <div className="flex gap-2">
                                    {notification.actions?.secondary && (
                                      <Button variant="ghost" size="sm" className="h-7 text-xs hover:bg-muted/50">
                                        {notification.actions.secondary}
                                      </Button>
                                    )}
                                    {notification.actions?.primary && (
                                      <Button
                                        size="sm"
                                        className={cn(
                                          "h-7 text-xs",
                                          notification.type === "urgent"
                                            ? "bg-red-500 hover:bg-red-600 text-white"
                                            : "bg-muted hover:bg-muted/80 text-muted-foreground"
                                        )}
                                      >
                                        {notification.actions.primary}
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="flex flex-col items-center justify-center py-8 text-center">
                          <CheckCircle2 className="h-12 w-12 text-muted-foreground/30 mb-3" />
                          <h3 className="font-medium text-lg text-foreground">All caught up!</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            No {activeTab === "all" ? "" : activeTab} notifications to display.
                          </p>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}

