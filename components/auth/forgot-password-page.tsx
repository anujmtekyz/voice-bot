"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Logo } from "@/components/ui/logo"
import { ThemeToggle } from "@/components/theme-toggle"
import { ForgotPasswordForm } from "./forgot-password-form"
import { Button } from "@/components/ui/button"

export function ForgotPasswordPage() {
  const [emailSent, setEmailSent] = useState(false)
  const [email, setEmail] = useState("")

  const handleEmailSent = (sentEmail: string) => {
    setEmail(sentEmail)
    setEmailSent(true)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center justify-between border-b p-4">
        <Logo size="md" />
        <ThemeToggle />
      </header>

      <main className="flex flex-1 items-center justify-center p-4">
        <div className="w-full max-w-md space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-bold tracking-tight">Reset your password</h1>
            <p className="text-muted-foreground">
              {emailSent
                ? "Check your email for reset instructions"
                : "Enter your email address and we'll send you a link to reset your password"}
            </p>
          </div>

          {emailSent ? (
            <div className="space-y-6">
              <div className="rounded-lg border bg-card p-6 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h2 className="mb-2 text-xl font-semibold">Email Sent</h2>
                <p className="mb-4 text-muted-foreground">We've sent a password reset link to:</p>
                <p className="mb-4 font-medium">{email}</p>
                <p className="text-sm text-muted-foreground">
                  Please check your inbox and follow the instructions to reset your password. If you don't see the
                  email, check your spam folder.
                </p>
              </div>

              <div className="flex flex-col space-y-2">
                <Button onClick={() => setEmailSent(false)}>Try a different email</Button>
                <Button variant="outline" asChild>
                  <Link href="/login">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to login
                  </Link>
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <ForgotPasswordForm onEmailSent={handleEmailSent} />

              <div className="text-center">
                <Button variant="link" asChild>
                  <Link href="/login" className="flex items-center justify-center">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to login
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="border-t py-4 text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} JIRA VoiceBot. All rights reserved.</p>
      </footer>
    </div>
  )
}
