"use client"

import { useTheme } from "next-themes"

export function ProjectCompletionChart() {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  // Mock data - in a real app, this would come from an API
  const projects = [
    { name: "Payment System", completed: 65, remaining: 35 },
    { name: "User Management", completed: 80, remaining: 20 },
    { name: "Frontend", completed: 45, remaining: 55 },
    { name: "Backend", completed: 70, remaining: 30 },
    { name: "Documentation", completed: 90, remaining: 10 },
  ]

  const completedColor = isDark ? "#22c55e" : "#4ade80"
  const remainingColor = isDark ? "#94a3b8" : "#cbd5e1"

  return (
    <div className="h-[300px] w-full">
      <div className="flex h-[250px] w-full flex-col">
        {projects.map((project, index) => (
          <div key={index} className="group relative mb-4 flex items-center">
            <div className="w-32 truncate text-sm">{project.name}</div>
            <div className="relative ml-2 flex h-6 flex-1 rounded-md bg-muted">
              <div
                className="rounded-l-md transition-all"
                style={{
                  width: `${project.completed}%`,
                  backgroundColor: completedColor,
                }}
              />

              {/* Percentage */}
              <div className="absolute left-2 top-1/2 -translate-y-1/2 text-xs font-medium text-white">
                {project.completed}%
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
