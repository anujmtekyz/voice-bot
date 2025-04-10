"use client"

import type React from "react"

import { useState } from "react"
import { Mail, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

interface ForgotPasswordFormProps {
  onEmailSent: (email: string) => void
}

export function ForgotPasswordForm({ onEmailSent }: ForgotPasswordFormProps) {
  const { toast } = useToast()
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Reset error
    setError(null)

    // Validate email
    if (!email) {
      setError("Email is required")
      return
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address")
      return
    }

    setIsLoading(true)

    // Simulate API call to send password reset email
    setTimeout(() => {
      setIsLoading(false)

      // In a real app, you would call your API to send a reset email
      // For demo purposes, we'll just simulate success
      toast({
        title: "Reset link sent",
        description: "Check your email for password reset instructions",
      })

      // Notify parent component that email was sent
      onEmailSent(email)
    }, 1500)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">
          Email address
          {error && <span className="ml-1 text-xs text-destructive">{error}</span>}
        </Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`pl-10 ${error ? "border-destructive" : ""}`}
            disabled={isLoading}
            autoComplete="email"
          />
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isLoading ? "Sending..." : "Send reset link"}
      </Button>
    </form>
  )
}
