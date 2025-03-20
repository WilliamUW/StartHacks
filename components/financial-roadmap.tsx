"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Home,
  GraduationCap,
  Briefcase,
  Car,
  Baby,
  Plane,
  Heart,
  Sailboat,
  PiggyBank,
  Plus,
  Trash2,
  Calendar,
  DollarSign,
  Target,
  ChevronRight,
  ChevronLeft,
  Edit,
  Check,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useTheme } from "@/components/theme-provider"

// Define milestone types and interfaces
type MilestoneType =
  | "retirement"
  | "house"
  | "education"
  | "career"
  | "vehicle"
  | "family"
  | "travel"
  | "health"
  | "boat"
  | "savings"
  | "custom"

interface Milestone {
  id: string
  type: MilestoneType
  title: string
  year: number
  amount: number
  progress: number
  description?: string
  completed: boolean
  color?: string
}

// Default milestones
const defaultMilestones: Milestone[] = [
  {
    id: "1",
    type: "house",
    title: "House Down Payment",
    year: 2026,
    amount: 150000,
    progress: 67,
    description: "Save for 20% down payment on a $750,000 home",
    completed: false,
    color: "#3b82f6", // blue
  },
  {
    id: "2",
    type: "education",
    title: "Children's College Fund",
    year: 2030,
    amount: 250000,
    progress: 35,
    description: "Fund education for two children",
    completed: false,
    color: "#10b981", // green
  },
  {
    id: "3",
    type: "retirement",
    title: "Early Retirement",
    year: 2045,
    amount: 3500000,
    progress: 28,
    description: "Achieve financial independence",
    completed: false,
    color: "#8b5cf6", // purple
  },
  {
    id: "4",
    type: "travel",
    title: "World Tour",
    year: 2027,
    amount: 50000,
    progress: 45,
    description: "Six-month sabbatical to travel the world",
    completed: false,
    color: "#f59e0b", // amber
  },
  {
    id: "5",
    type: "boat",
    title: "Sailboat Purchase",
    year: 2032,
    amount: 120000,
    progress: 15,
    description: "Buy a 38-foot sailboat for weekend trips",
    completed: false,
    color: "#ef4444", // red
  },
]

// Get icon for milestone type
const getMilestoneIcon = (type: MilestoneType) => {
  switch (type) {
    case "retirement":
      return <PiggyBank />
    case "house":
      return <Home />
    case "education":
      return <GraduationCap />
    case "career":
      return <Briefcase />
    case "vehicle":
      return <Car />
    case "family":
      return <Baby />
    case "travel":
      return <Plane />
    case "health":
      return <Heart />
    case "boat":
      return <Sailboat />
    case "savings":
      return <PiggyBank />
    default:
      return <Target />
  }
}

export default function FinancialRoadmap() {
  const [milestones, setMilestones] = useState<Milestone[]>(defaultMilestones)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editingMilestone, setEditingMilestone] = useState<Milestone | null>(null)
  const [currentYear] = useState(2025)
  const [startYear, setStartYear] = useState(2025)
  const [endYear, setEndYear] = useState(2050)
  const [viewMode, setViewMode] = useState<"timeline" | "cards">("timeline")
  const [animateTimeline, setAnimateTimeline] = useState(false)
  const timelineRef = useRef<HTMLDivElement>(null)
  const { theme } = useTheme()
  const isDarkMode = theme === "dark"

  // Sort milestones by year
  const sortedMilestones = [...milestones].sort((a, b) => a.year - b.year)

  // Calculate timeline positions
  const getTimelinePosition = (year: number) => {
    const range = endYear - startYear
    return ((year - startYear) / range) * 100
  }

  // Handle milestone edit
  const handleEditMilestone = (milestone: Milestone) => {
    setEditingMilestone({ ...milestone })
    setEditDialogOpen(true)
  }

  // Handle add new milestone
  const handleAddMilestone = () => {
    setEditingMilestone({
      id: "",
      type: "custom",
      title: "New Goal",
      year: currentYear + 5,
      amount: 50000,
      progress: 0,
      description: "",
      completed: false,
      color: "#3b82f6",
    })
    setEditDialogOpen(true)
  }

  // Handle milestone save
  const handleSaveMilestone = () => {
    if (!editingMilestone) return

    if (editingMilestone.id) {
      // Update existing milestone
      setMilestones(milestones.map((m) => (m.id === editingMilestone.id ? editingMilestone : m)))
    } else {
      // Add new milestone
      setMilestones([
        ...milestones,
        {
          ...editingMilestone,
          id: Date.now().toString(),
          progress: 0,
          completed: false,
        },
      ])
    }

    setEditDialogOpen(false)
    setEditingMilestone(null)
  }

  // Handle milestone delete
  const handleDeleteMilestone = (id: string) => {
    setMilestones(milestones.filter((m) => m.id !== id))
    setEditDialogOpen(false)
    setEditingMilestone(null)
  }

  // Trigger timeline animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimateTimeline(true)
    }, 200) // Changed from 500

    return () => clearTimeout(timer)
  }, [])

  // Timeline scroll controls
  const scrollTimeline = (direction: "left" | "right") => {
    if (!timelineRef.current) return

    const scrollAmount = timelineRef.current.clientWidth * 0.5
    timelineRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    })
  }

  return (
    <div className="relative">
      {/* Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 w-full md:w-auto">
          <Tabs
            value={viewMode}
            onValueChange={(value) => setViewMode(value as "timeline" | "cards")}
            className="w-full md:w-auto"
          >
            <TabsList>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
              <TabsTrigger value="cards">Cards</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <span className="text-sm text-muted-foreground whitespace-nowrap">Year Range:</span>
            <div className="flex items-center gap-1 w-full">
              <Input
                type="number"
                className="w-20 h-9 text-sm"
                value={startYear}
                onChange={(e) => setStartYear(Number(e.target.value))}
              />
              <span className="text-sm">to</span>
              <Input
                type="number"
                className="w-20 h-9 text-sm"
                value={endYear}
                onChange={(e) => setEndYear(Number(e.target.value))}
              />
            </div>
          </div>
        </div>

        <Button onClick={handleAddMilestone} className="w-full md:w-auto">
          <Plus className="h-4 w-4 mr-1" /> Add Goal
        </Button>
      </div>

      {/* Timeline View */}
      {viewMode === "timeline" && (
        <div className="relative mb-8">
          <Button
            variant="outline"
            size="icon"
            className="absolute -left-4 top-1/2 transform -translate-y-1/2 z-10 rounded-full"
            onClick={() => scrollTimeline("left")}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div ref={timelineRef} className="relative overflow-x-auto pb-8 pt-20" style={{ scrollbarWidth: "none" }}>
            {/* Timeline track */}
            <div
              className="absolute h-2 bg-muted rounded-full"
              style={{
                width: "calc(100% - 40px)",
                left: "20px",
                top: "80px",
              }}
            >
              {/* Current year marker */}
              <div
                className="absolute w-4 h-4 rounded-full bg-primary border-4 border-background"
                style={{
                  left: `${getTimelinePosition(currentYear)}%`,
                  top: "-6px",
                }}
              >
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                  <Badge variant="outline" className="bg-primary/10 text-primary">
                    Current: {currentYear}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Timeline content */}
            <div className="relative" style={{ minWidth: "1000px", height: "200px" }}>
              {/* Year markers */}
              {Array.from({ length: Math.ceil((endYear - startYear) / 5) + 1 }).map((_, i) => {
                const year = startYear + i * 5
                const position = getTimelinePosition(year)
                return (
                  <div
                    key={year}
                    className="absolute transform -translate-x-1/2"
                    style={{ left: `${position}%`, top: "90px" }}
                  >
                    <div className="h-4 w-1 bg-muted-foreground/30 mb-1"></div>
                    <div className="text-xs text-muted-foreground">{year}</div>
                  </div>
                )
              })}

              {/* Milestones */}
              {sortedMilestones.map((milestone) => {
                const position = getTimelinePosition(milestone.year)
                return (
                  <motion.div
                    key={milestone.id}
                    initial={{ y: 20, opacity: 0 }}
                    animate={animateTimeline ? { y: 0, opacity: 1 } : {}}
                    transition={{ duration: 0.2, delay: position / 500 }} // Changed from 0.5 duration and 200 divisor
                    className="absolute transform -translate-x-1/2"
                    style={{
                      left: `${position}%`,
                      top: position % 10 > 5 ? "10px" : "40px",
                    }}
                  >
                    <div
                      className={cn(
                        "flex flex-col items-center cursor-pointer transition-transform hover:scale-105",
                        "hover:z-10",
                      )}
                      onClick={() => handleEditMilestone(milestone)}
                    >
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center mb-2"
                        style={{
                          backgroundColor: milestone.color ? `${milestone.color}20` : "var(--primary)",
                          color: milestone.color || "var(--primary)",
                        }}
                      >
                        {getMilestoneIcon(milestone.type)}
                      </div>
                      <div className="text-xs font-medium text-center max-w-[100px] truncate">{milestone.title}</div>
                      <div className="text-xs text-muted-foreground">{milestone.year}</div>

                      {/* Progress indicator */}
                      <div className="mt-1 w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${milestone.progress}%`,
                            backgroundColor: milestone.color || "var(--primary)",
                          }}
                        ></div>
                      </div>
                      <div className="text-xs text-muted-foreground">${milestone.amount.toLocaleString()}</div>
                    </div>

                    {/* Connecting line to timeline */}
                    <div
                      className="absolute w-1 bg-muted-foreground/20"
                      style={{
                        height: position % 10 > 5 ? "60px" : "30px",
                        bottom: "-10px",
                        left: "50%",
                        transform: "translateX(-50%)",
                      }}
                    ></div>
                  </motion.div>
                )
              })}
            </div>
          </div>

          <Button
            variant="outline"
            size="icon"
            className="absolute -right-4 top-1/2 transform -translate-y-1/2 z-10 rounded-full"
            onClick={() => scrollTimeline("right")}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Cards View */}
      {viewMode === "cards" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedMilestones.map((milestone) => (
            <motion.div
              key={milestone.id}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.15 }} // Changed from 0.3
            >
              <Card
                className={cn("overflow-hidden cursor-pointer transition-all hover:shadow-md", "border-l-4")}
                style={{ borderLeftColor: milestone.color || "var(--primary)" }}
                onClick={() => handleEditMilestone(milestone)}
              >
                <div className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center mr-2"
                        style={{
                          backgroundColor: milestone.color ? `${milestone.color}20` : "var(--primary)",
                          color: milestone.color || "var(--primary)",
                        }}
                      >
                        {getMilestoneIcon(milestone.type)}
                      </div>
                      <div>
                        <h3 className="font-medium">{milestone.title}</h3>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3 mr-1" />
                          {milestone.year}
                          <span className="mx-1">•</span>
                          <DollarSign className="h-3 w-3 mr-1" />
                          {milestone.amount.toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <Badge variant={milestone.completed ? "default" : "outline"}>
                      {milestone.completed ? "Completed" : `${milestone.progress}%`}
                    </Badge>
                  </div>

                  {milestone.description && (
                    <p className="text-sm text-muted-foreground mb-3">{milestone.description}</p>
                  )}

                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500" // Changed from duration-1000
                      style={{
                        width: `${milestone.progress}%`,
                        backgroundColor: milestone.color || "var(--primary)",
                      }}
                    ></div>
                  </div>

                  <div className="flex justify-end mt-3">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingMilestone?.id ? "Edit Financial Goal" : "Add Financial Goal"}</DialogTitle>
          </DialogHeader>

          {editingMilestone && (
            <div className="space-y-4 py-2">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Goal Type</label>
                <div className="grid grid-cols-5 gap-2">
                  {[
                    { type: "house", label: "House" },
                    { type: "education", label: "Education" },
                    { type: "retirement", label: "Retirement" },
                    { type: "travel", label: "Travel" },
                    { type: "boat", label: "Boat" },
                    { type: "vehicle", label: "Vehicle" },
                    { type: "family", label: "Family" },
                    { type: "health", label: "Health" },
                    { type: "savings", label: "Savings" },
                    { type: "custom", label: "Custom" },
                  ].map((item) => (
                    <Button
                      key={item.type}
                      type="button"
                      variant={editingMilestone.type === item.type ? "default" : "outline"}
                      className="h-auto py-2 px-1 flex flex-col items-center gap-1"
                      onClick={() =>
                        setEditingMilestone({
                          ...editingMilestone,
                          type: item.type as MilestoneType,
                        })
                      }
                    >
                      {getMilestoneIcon(item.type as MilestoneType)}
                      <span className="text-xs">{item.label}</span>
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-1.5 block">Title</label>
                <Input
                  value={editingMilestone.title}
                  onChange={(e) =>
                    setEditingMilestone({
                      ...editingMilestone,
                      title: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1.5 block">Target Year</label>
                <Input
                  type="number"
                  value={editingMilestone.year}
                  onChange={(e) =>
                    setEditingMilestone({
                      ...editingMilestone,
                      year: Number(e.target.value),
                    })
                  }
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1.5 block">Target Amount ($)</label>
                <Input
                  type="number"
                  value={editingMilestone.amount}
                  onChange={(e) =>
                    setEditingMilestone({
                      ...editingMilestone,
                      amount: Number(e.target.value),
                    })
                  }
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1.5 block">Description (optional)</label>
                <Textarea
                  value={editingMilestone.description || ""}
                  onChange={(e) =>
                    setEditingMilestone({
                      ...editingMilestone,
                      description: e.target.value,
                    })
                  }
                  rows={3}
                />
              </div>

              <div>
                <div className="flex justify-between mb-1.5">
                  <label className="text-sm font-medium">Progress ({editingMilestone.progress}%)</label>
                  <label className="text-sm text-muted-foreground">
                    ${Math.round(editingMilestone.amount * (editingMilestone.progress / 100)).toLocaleString()} of $
                    {editingMilestone.amount.toLocaleString()}
                  </label>
                </div>
                <Slider
                  value={[editingMilestone.progress]}
                  min={0}
                  max={100}
                  step={1}
                  onValueChange={(value) =>
                    setEditingMilestone({
                      ...editingMilestone,
                      progress: value[0],
                    })
                  }
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1.5 block">Color</label>
                <div className="flex gap-2 mt-2">
                  {[
                    "#3b82f6", // blue
                    "#10b981", // green
                    "#8b5cf6", // purple
                    "#f59e0b", // amber
                    "#ef4444", // red
                    "#06b6d4", // cyan
                    "#ec4899", // pink
                  ].map((color) => (
                    <button
                      key={color}
                      type="button"
                      className={cn(
                        "w-8 h-8 rounded-full transition-all",
                        editingMilestone.color === color && "ring-2 ring-offset-2 ring-offset-background ring-ring",
                      )}
                      style={{ backgroundColor: color }}
                      onClick={() =>
                        setEditingMilestone({
                          ...editingMilestone,
                          color,
                        })
                      }
                    >
                      {editingMilestone.color === color && <Check className="h-4 w-4 text-white mx-auto" />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="completed"
                  checked={editingMilestone.completed}
                  onChange={(e) =>
                    setEditingMilestone({
                      ...editingMilestone,
                      completed: e.target.checked,
                      progress: e.target.checked ? 100 : editingMilestone.progress,
                    })
                  }
                  className="h-4 w-4 rounded border-gray-300"
                />
                <label htmlFor="completed" className="text-sm">
                  Mark as completed
                </label>
              </div>
            </div>
          )}

          <DialogFooter className="flex justify-between items-center">
            <div>
              {editingMilestone?.id && (
                <Button variant="destructive" onClick={() => handleDeleteMilestone(editingMilestone.id)}>
                  <Trash2 className="h-4 w-4 mr-1" /> Delete
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveMilestone}>Save</Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

