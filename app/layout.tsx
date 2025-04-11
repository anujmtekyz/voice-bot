import type React from "react"
import type { Metadata } from "next"
import { Outfit } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/hooks/use-auth"

// Load Outfit font - a modern, clean sans-serif
const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
})

export const metadata: Metadata = {
  title: "JIRA Voicebot",
  description: "Voice-enabled JIRA integration for efficient ticket management",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // Add error handling for ResizeObserver errors
  if (typeof window !== "undefined") {
    const errorHandler = (e: ErrorEvent) => {
      if (e.message.includes("ResizeObserver") || e.error?.message.includes("ResizeObserver")) {
        e.stopImmediatePropagation()
      }
    }

    window.addEventListener("error", errorHandler)
    window.addEventListener("unhandledrejection", (e) => {
      if (e.reason?.message?.includes("ResizeObserver")) {
        e.stopImmediatePropagation()
      }
    })
  }

  return (
    <html lang="en" suppressHydrationWarning className={outfit.variable}>
      <body className="font-sans">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}


import './globals.css'