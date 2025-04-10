import { Card, CardContent } from "@/components/ui/card"
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react"

interface ReportMetricsProps {
  dateRange: {
    from: Date | undefined
    to: Date | undefined
  }
  projectFilter: string
}

export function ReportMetrics({ dateRange, projectFilter }: ReportMetricsProps) {
  // In a real app, these would be calculated based on the date range and project filter
  const metrics = [
    {
      label: "Total Tickets",
      value: "248",
      change: "+12%",
      trend: "up",
    },
    {
      label: "Resolved Tickets",
      value: "187",
      change: "+24%",
      trend: "up",
    },
    {
      label: "Avg. Resolution Time",
      value: "3.2 days",
      change: "-8%",
      trend: "up", // Decreasing resolution time is good
    },
    {
      label: "Open Bugs",
      value: "24",
      change: "-15%",
      trend: "up", // Decreasing bugs is good
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric, index) => (
        <Card key={index}>
          <CardContent className="p-6">
            <div className="text-sm font-medium text-muted-foreground">{metric.label}</div>
            <div className="mt-2 flex items-center">
              <span className="text-3xl font-bold">{metric.value}</span>
              <span
                className={`ml-2 flex items-center text-sm font-medium ${
                  metric.trend === "up" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                }`}
              >
                {metric.trend === "up" ? (
                  <ArrowUpIcon className="mr-1 h-4 w-4" />
                ) : (
                  <ArrowDownIcon className="mr-1 h-4 w-4" />
                )}
                {metric.change}
              </span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">Compared to previous period</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
