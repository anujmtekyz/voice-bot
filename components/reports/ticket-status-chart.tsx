"use client"

import { useTheme } from "next-themes"
import { useRef, useEffect } from "react"

interface TicketStatusChartProps {
  projectFilter: string
}

export function TicketStatusChart({ projectFilter }: TicketStatusChartProps) {
  const { theme } = useTheme()
  const isDark = theme === "dark"
  const isMounted = useRef(false)

  useEffect(() => {
    isMounted.current = true
    return () => {
      isMounted.current = false
    }
  }, [])

  // Mock data - in a real app, this would come from an API
  const statuses = [
    { name: "To Do", value: 35, color: isDark ? "#3b82f6" : "#60a5fa" },
    { name: "In Progress", value: 25, color: isDark ? "#eab308" : "#facc15" },
    { name: "In Review", value: 15, color: isDark ? "#8b5cf6" : "#a78bfa" },
    { name: "Done", value: 25, color: isDark ? "#22c55e" : "#4ade80" },
  ]

  const total = statuses.reduce((sum, status) => sum + status.value, 0)

  return (
    <div className="h-[300px] w-full">
      <div className="flex h-[250px] w-full items-end justify-around">
        {statuses.map((status, index) => (
          <div key={index} className="flex flex-col items-center">
            <div
              className="w-16 rounded-t-md transition-all"
              style={{
                height: `${(status.value / total) * 250}px`,
                backgroundColor: status.color,
              }}
            />
            <div className="mt-2 text-center text-sm font-medium">{status.name}</div>
            <div className="text-sm text-muted-foreground">{status.value}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
