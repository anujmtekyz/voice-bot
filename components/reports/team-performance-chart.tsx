"use client"

import { useTheme } from "next-themes"

interface TeamPerformanceChartProps {
  dateRange: {
    from: Date | undefined
    to: Date | undefined
  }
}

export function TeamPerformanceChart({ dateRange }: TeamPerformanceChartProps) {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  // Mock data - in a real app, this would come from an API
  const teamMembers = [
    { name: "John Doe", resolved: 42, inProgress: 5 },
    { name: "Jane Smith", resolved: 38, inProgress: 7 },
    { name: "Mike Johnson", resolved: 31, inProgress: 4 },
    { name: "Sarah Williams", resolved: 45, inProgress: 3 },
    { name: "David Brown", resolved: 28, inProgress: 6 },
  ]

  const maxValue = Math.max(...teamMembers.map((member) => member.resolved + member.inProgress))

  const resolvedColor = isDark ? "#22c55e" : "#4ade80"
  const inProgressColor = isDark ? "#eab308" : "#facc15"

  return (
    <div className="h-[300px] w-full">
      <div className="flex h-[250px] w-full flex-col">
        {teamMembers.map((member, index) => (
          <div key={index} className="group relative mb-4 flex items-center">
            <div className="w-24 truncate text-sm">{member.name}</div>
            <div className="relative ml-2 flex h-6 flex-1">
              <div
                className="rounded-l-md transition-all"
                style={{
                  width: `${(member.resolved / maxValue) * 100}%`,
                  backgroundColor: resolvedColor,
                }}
              />
              <div
                className="rounded-r-md transition-all"
                style={{
                  width: `${(member.inProgress / maxValue) * 100}%`,
                  backgroundColor: inProgressColor,
                }}
              />

              {/* Values */}
              <div className="absolute left-2 top-1/2 -translate-y-1/2 text-xs font-medium text-white">
                {member.resolved}
              </div>
              {member.inProgress > 0 && (
                <div
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-medium text-black dark:text-black"
                  style={{
                    right: member.inProgress > 2 ? 2 : undefined,
                    left: member.inProgress <= 2 ? `calc(${(member.resolved / maxValue) * 100}% + 4px)` : undefined,
                  }}
                >
                  {member.inProgress}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-center space-x-6">
        <div className="flex items-center">
          <div className="mr-2 h-3 w-3 rounded-sm" style={{ backgroundColor: resolvedColor }} />
          <span className="text-sm">Resolved</span>
        </div>
        <div className="flex items-center">
          <div className="mr-2 h-3 w-3 rounded-sm" style={{ backgroundColor: inProgressColor }} />
          <span className="text-sm">In Progress</span>
        </div>
      </div>
    </div>
  )
}
