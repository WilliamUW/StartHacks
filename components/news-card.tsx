import { ExternalLink } from "lucide-react"

interface NewsCardProps {
  title: string
  source: string
  time: string
  impact: string
}

export default function NewsCard({ title, source, time, impact }: NewsCardProps) {
  return (
    <div className="flex flex-col p-3 rounded-lg border border-border bg-card hover:bg-muted/50 cursor-pointer transition-colors">
      <div className="flex justify-between items-start">
        <h4 className="font-medium">{title}</h4>
        <ExternalLink className="h-4 w-4 text-muted-foreground flex-shrink-0 ml-2" />
      </div>
      <div className="flex items-center text-xs text-muted-foreground mt-1">
        <span>{source}</span>
        <span className="mx-2">•</span>
        <span>{time}</span>
      </div>
      <div className="mt-2 text-sm">
        <span className="text-primary font-medium">Impact: </span>
        {impact}
      </div>
    </div>
  )
}

