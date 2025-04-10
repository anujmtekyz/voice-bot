"use client"

import { useTheme } from "next-themes"

interface VoiceCommandUsageChartProps {
  dateRange: {
    from: Date | undefined
    to: Date | undefined
  }
}

export function VoiceCommandUsageChart({ dateRange }: VoiceCommandUsageChartProps) {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  // Mock data - in a real app, this would come from an API
  const commands = [
    { name: "Show my tickets", count: 156 },
    { name: "Create a new bug", count: 89 },
    { name: "Assign ticket to", count: 72 },
    { name: "Change status to", count: 68 },
    { name: "Go to dashboard", count: 54 },
    { name: "Add a comment", count: 47 },
    { name: "Show project", count: 41 },
    { name: "Find high priority bugs", count: 32 },
  ]

  const maxValue = Math.max(...commands.map((cmd) => cmd.count))
  const barColor = isDark ? "#8b5cf6" : "#a78bfa"

  return (
    <div className="h-[300px] w-full">
      <div className="flex h-[250px] w-full flex-col">
        {commands.map((command, index) => (
          <div key={index} className="group relative mb-4 flex items-center">
            <div className="w-40 truncate text-sm">{command.name}</div>
            <div className="relative ml-2 flex h-6 flex-1">
              <div
                className="rounded-md transition-all"
                style={{
                  width: `${(command.count / maxValue) * 100}%`,
                  backgroundColor: barColor,
                }}
              />

              {/* Count */}
              <div className="absolute left-2 top-1/2 -translate-y-1/2 text-xs font-medium text-white">
                {command.count}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
