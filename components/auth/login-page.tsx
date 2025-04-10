"use client"

import { useState } from "react"
import Link from "next/link"
import { Mic } from "lucide-react"
import { LoginForm } from "./login-form"
import { ThemeToggle } from "@/components/theme-toggle"
import { Logo } from "@/components/ui/logo"

export function LoginPage() {
  const [isVoiceLoginActive, setIsVoiceLoginActive] = useState(false)

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center justify-between border-b p-4">
        <Logo size="md" />
        <ThemeToggle />
      </header>

      <main className="flex flex-1 items-center justify-center p-4">
        <div className="grid w-full gap-8 md:grid-cols-2 lg:max-w-6xl">
          {/* Left side - Branding and info */}
          <div className="flex flex-col justify-center space-y-6 p-4 md:p-8">
            <div className="space-y-2">
              <h1 className="text-balance">JIRA VoiceBot</h1>
              <p className="text-muted-foreground">Voice-enabled JIRA integration for efficient ticket management</p>
            </div>

            <div className="space-y-4 rounded-lg border bg-card p-6 shadow-sm">
              <h3 className="font-medium">Voice-Powered Productivity</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start">
                  <span className="mr-3 rounded-full bg-primary/10 p-1">
                    <Mic className="h-3 w-3 text-primary" />
                  </span>
                  <span>Create and manage tickets using voice commands</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3 rounded-full bg-primary/10 p-1">
                    <Mic className="h-3 w-3 text-primary" />
                  </span>
                  <span>Navigate the interface hands-free</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3 rounded-full bg-primary/10 p-1">
                    <Mic className="h-3 w-3 text-primary" />
                  </span>
                  <span>Dictate comments and descriptions</span>
                </li>
              </ul>
            </div>

            {isVoiceLoginActive && (
              <div className="flex flex-col items-center justify-center space-y-4 rounded-lg border bg-card p-6 text-center shadow-sm">
                <div className="relative">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                    <Mic className="h-8 w-8 text-primary" />
                  </div>
                  <span className="absolute right-0 top-0 flex h-5 w-5 animate-pulse items-center justify-center rounded-full bg-red-500"></span>
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium">Voice Authentication</h3>
                  <p className="text-sm text-muted-foreground">Say "My voice is my password"</p>
                  <div className="flex justify-center space-x-2">
                    <div className="flex items-center space-x-1">
                      <span className="h-2 w-2 animate-pulse rounded-full bg-primary"></span>
                      <span className="h-2 w-2 animate-pulse rounded-full bg-primary animation-delay-200"></span>
                      <span className="h-2 w-2 animate-pulse rounded-full bg-primary animation-delay-500"></span>
                    </div>
                  </div>
                </div>
                <button
                  className="text-sm text-muted-foreground underline"
                  onClick={() => setIsVoiceLoginActive(false)}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          {/* Right side - Login form */}
          <div className="flex flex-col justify-center rounded-lg border bg-card p-6 shadow-sm md:p-8">
            <div className="mb-6 space-y-2 text-center">
              <h2>Sign In</h2>
              <p className="text-sm text-muted-foreground">Enter your credentials to access your account</p>
            </div>

            <LoginForm
              onVoiceLoginToggle={(active) => setIsVoiceLoginActive(active)}
              isVoiceLoginActive={isVoiceLoginActive}
            />

            <div className="mt-6 text-center text-sm">
              <p className="text-muted-foreground">
                Don't have an account?{" "}
                <Link href="#" className="font-medium text-primary underline-offset-4 hover:underline">
                  Contact your administrator
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t py-4 text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} JIRA VoiceBot. All rights reserved.</p>
      </footer>
    </div>
  )
}
