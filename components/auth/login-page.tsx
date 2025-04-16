"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Mic, AlertTriangle, ArrowRight } from "lucide-react"
import { LoginForm } from "./login-form"
import { ThemeToggle } from "@/components/theme-toggle"
import { Logo } from "@/components/ui/logo"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function LoginPage() {
  const { login } = useAuth()
  const { toast } = useToast()
  const searchParams = useSearchParams()
  const [sessionExpired, setSessionExpired] = useState(false)
  const [callbackUrl, setCallbackUrl] = useState<string | null>(null)

  useEffect(() => {
    // Check if redirected from session expiry
    const session = searchParams?.get('session')
    if (session === 'expired') {
      setSessionExpired(true)
      toast({
        title: "Session expired",
        description: "Your session has expired. Please sign in again.",
        variant: "destructive",
      })
    }
    
    // Check if there's a callback URL
    const callback = searchParams?.get('callbackUrl')
    if (callback) {
      setCallbackUrl(decodeURI(callback))
    }
  }, [searchParams, toast])

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
          </div>

          {/* Right side - Login form */}
          <div className="flex flex-col justify-center rounded-lg border bg-card p-6 shadow-sm md:p-8">
            <div className="mb-6 space-y-2 text-center">
              <h2>Sign In</h2>
              <p className="text-sm text-muted-foreground">Enter your credentials to access your account</p>
            </div>

            {sessionExpired && (
              <Alert variant="destructive" className="mb-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Your session has expired. Please sign in again.
                </AlertDescription>
              </Alert>
            )}

            {callbackUrl && (
              <Alert className="mb-4">
                <ArrowRight className="h-4 w-4" />
                <AlertDescription>
                  Sign in to continue to {callbackUrl.replace(/^\//, '')}
                </AlertDescription>
              </Alert>
            )}

            <LoginForm />

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
