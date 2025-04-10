"use client"

import { useTheme } from "next-themes"
import { useRef, useEffect } from "react"

interface TicketPriorityChartProps {
  projectFilter: string
}

export function TicketPriorityChart({ projectFilter }: TicketPriorityChartProps) {
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
  const priorities = [
    { name: "High", value: 15, color: isDark ? "#ef4444" : "#f87171" },
    { name: "Medium", value: 45, color: isDark ? "#eab308" : "#facc15" },
    { name: "Low", value: 40, color: isDark ? "#3b82f6" : "#60a5fa" },
  ]

  const total = priorities.reduce((sum, priority) => sum + priority.value, 0)
  let startAngle = 0

  return (
    <div className="flex h-[300px] w-full items-center justify-center">
      <div className="relative h-[200px] w-[200px]">
        <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
          {priorities.map((priority, index) => {
            const percentage = (priority.value / total) * 100
            const angle = (percentage / 100) * 360
            const endAngle = startAngle + angle

            // Calculate the SVG arc path
            const x1 = 50 + 40 * Math.cos((startAngle * Math.PI) / 180)
            const y1 = 50 + 40 * Math.sin((startAngle * Math.PI) / 180)
            const x2 = 50 + 40 * Math.cos((endAngle * Math.PI) / 180)
            const y2 = 50 + 40 * Math.sin((endAngle * Math.PI) / 180)

            const largeArcFlag = angle > 180 ? 1 : 0

            const pathData = [`M 50 50`, `L ${x1} ${y1}`, `A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2}`, `Z`].join(" ")

            const result = <path key={index} d={pathData} fill={priority.color} stroke="transparent" strokeWidth="1" />

            startAngle += angle
            return result
          })}
        </svg>
        <div className="absolute left-0 top-0 flex h-full w-full flex-col items-center justify-center">
          <span className="text-3xl font-bold">{total}</span>
          <span className="text-sm text-muted-foreground">Total Tickets</span>
        </div>
      </div>
      <div className="ml-8 space-y-2">
        {priorities.map((priority, index) => (
          <div key={index} className="flex items-center">
            <div className="mr-2 h-3 w-3 rounded-sm" style={{ backgroundColor: priority.color }} />
            <span className="text-sm">
              {priority.name}: {priority.value} ({Math.round((priority.value / total) * 100)}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
