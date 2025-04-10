import { Mic } from "lucide-react"
import { cn } from "@/lib/utils"

interface LogoProps {
  className?: string
  size?: "sm" | "md" | "lg"
  showText?: boolean
}

export function Logo({ className, size = "md", showText = true }: LogoProps) {
  const sizeClasses = {
    sm: "h-6",
    md: "h-8",
    lg: "h-10",
  }

  return (
    <div className={cn("flex items-center", className)}>
      <div className="relative">
        <div className={cn("flex items-center justify-center rounded-lg bg-primary p-1", sizeClasses[size])}>
          <Mic
            className={cn("text-primary-foreground", size === "sm" ? "h-4 w-4" : size === "md" ? "h-5 w-5" : "h-6 w-6")}
          />
        </div>
        <div className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-red-500"></div>
      </div>

      {showText && (
        <span
          className={cn(
            "ml-2 font-medium tracking-tight",
            size === "sm" ? "text-lg" : size === "md" ? "text-xl" : "text-2xl",
          )}
        >
          VoiceBot
        </span>
      )}
    </div>
  )
}
