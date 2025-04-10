import { ArrowDownIcon, ArrowRightIcon, ArrowUpIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface MetricCardProps {
  title: string
  value: string
  trend: string
  trendType: "positive" | "negative" | "neutral"
  description: string
}

export function MetricCard({ title, value, trend, trendType, description }: MetricCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="text-sm font-medium text-muted-foreground">{title}</div>
        <div className="mt-2 flex items-center">
          <span className="text-3xl font-bold">{value}</span>
          {trend !== "0" && (
            <span
              className={cn(
                "ml-2 flex items-center text-sm font-medium",
                trendType === "positive" && "text-green-600 dark:text-green-400",
                trendType === "negative" && "text-red-600 dark:text-red-400",
              )}
            >
              {trendType === "positive" && <ArrowUpIcon className="mr-1 h-4 w-4" />}
              {trendType === "negative" && <ArrowDownIcon className="mr-1 h-4 w-4" />}
              {trendType === "neutral" && <ArrowRightIcon className="mr-1 h-4 w-4" />}
              {trend}
            </span>
          )}
        </div>
        <p className="mt-1 text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}
