"use client"

import { useTheme } from "next-themes"
import { useRef, useEffect } from "react"

interface TicketTrendChartProps {
  dateRange: {
    from: Date | undefined
    to: Date | undefined
  }
  projectFilter: string
}

export function TicketTrendChart({ dateRange, projectFilter }: TicketTrendChartProps) {
  const { theme } = useTheme()
  const isDark = theme === "dark"
  const isMounted = useRef(false)

  useEffect(() => {
    isMounted.current = true
    return () => {
      isMounted.current = false
    }
  }, [])

  // Mock data - in a real app, this would come from an API based on the date range
  const data = [
    { month: "Jan", created: 45, resolved: 32 },
    { month: "Feb", created: 52, resolved: 41 },
    { month: "Mar", created: 48, resolved: 45 },
    { month: "Apr", created: 61, resolved: 55 },
    { month: "May", created: 55, resolved: 58 },
    { month: "Jun", created: 67, resolved: 62 },
    { month: "Jul", created: 71, resolved: 68 },
    { month: "Aug", created: 69, resolved: 73 },
    { month: "Sep", created: 58, resolved: 65 },
    { month: "Oct", created: 65, resolved: 61 },
    { month: "Nov", created: 51, resolved: 55 },
    { month: "Dec", created: 48, resolved: 52 },
  ]

  const maxValue = Math.max(...data.map((item) => Math.max(item.created, item.resolved)))

  const createdColor = isDark ? "#3b82f6" : "#60a5fa"
  const resolvedColor = isDark ? "#22c55e" : "#4ade80"

  return (
    <div className="h-[300px] w-full">
      <div className="flex h-[250px] w-full flex-col">
        <div className="flex h-full w-full items-end">
          {data.map((item, index) => (
            <div key={index} className="group relative flex h-full flex-1 flex-col items-center justify-end">
              <div
                className="w-4 rounded-t-sm transition-all"
                style={{
                  height: `${(item.resolved / maxValue) * 100}%`,
                  backgroundColor: resolvedColor,
                  marginBottom: `${(item.created - item.resolved) > 0 ? 4 : 0}px`,
                }}
              />
              {item.created - item.resolved > 0 && (
                <div
                  className="w-4 rounded-t-sm transition-all"
                  style={{
                    height: `${((item.created - item.resolved) / maxValue) * 100}%`,
                    backgroundColor: createdColor,
                  }}
                />
              )}

              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 mb-2 hidden -translate-x-1/2 rounded-md bg-background p-2 text-xs shadow-md group-hover:block">
                <div className="font-medium">{item.month}</div>
                <div className="flex items-center">
                  <div className="mr-1 h-2 w-2 rounded-full" style={{ backgroundColor: createdColor }}></div>
                  <span>Created: {item.created}</span>
                </div>
                <div className="flex items-center">
                  <div className="mr-1 h-2 w-2 rounded-full" style={{ backgroundColor: resolvedColor }}></div>
                  <span>Resolved: {item.resolved}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-2 flex w-full justify-between px-2">
          {data.map((item, index) => (
            <div key={index} className="text-xs text-muted-foreground">
              {item.month}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-center space-x-6">
        <div className="flex items-center">
          <div className="mr-2 h-3 w-3 rounded-sm" style={{ backgroundColor: createdColor }} />
          <span className="text-sm">Created</span>
        </div>
        <div className="flex items-center">
          <div className="mr-2 h-3 w-3 rounded-sm" style={{ backgroundColor: resolvedColor }} />
          <span className="text-sm">Resolved</span>
        </div>
      </div>
    </div>
  )
}
