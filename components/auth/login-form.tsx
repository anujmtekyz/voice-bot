"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Loader2, Mail, Lock, Eye, EyeOff, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface LoginFormProps {
}

export function LoginForm({}: LoginFormProps) {
  const { toast } = useToast()
  const { login, isLoading: authLoading } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [loginError, setLoginError] = useState<string | null>(null)
  const [errors, setErrors] = useState<{
    email?: string
    password?: string
  }>({})

  const validateForm = () => {
    const newErrors: {
      email?: string
      password?: string
    } = {}

    if (!email) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email"
    }

    if (!password) {
      newErrors.password = "Password is required"
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError(null)

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      // Use the auth hook's login method
      const success = await login({ email, password }, rememberMe)
      
      // Only clear loading state if the login failed
      if (!success) {
        setLoginError("Invalid email or password. Please check your credentials and try again.")
        setIsLoading(false)
      }
      // Redirect is handled by the auth hook on success
    } catch (error: any) {
      console.error("Login error:", error)
      setLoginError(
        error.response?.data?.message || 
        "An unexpected error occurred. Please try again."
      )
      setIsLoading(false)
    }
  }

  // Derive combined loading state from local and auth context
  const isFormLoading = isLoading || authLoading

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {loginError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {loginError}
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="email">
          Email
          {errors.email && <span className="ml-1 text-xs text-destructive">{errors.email}</span>}
        </Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              setLoginError(null)
            }}
            className={`pl-10 ${errors.email ? "border-destructive" : ""}`}
            disabled={isFormLoading}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">
          Password
          {errors.password && <span className="ml-1 text-xs text-destructive">{errors.password}</span>}
        </Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              setLoginError(null)
            }}
            className={`pl-10 ${errors.password ? "border-destructive" : ""}`}
            disabled={isFormLoading}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-10 w-10 text-muted-foreground"
            onClick={() => setShowPassword(!showPassword)}
            disabled={isFormLoading}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="remember-me"
            checked={rememberMe}
            onCheckedChange={(checked) => setRememberMe(checked as boolean)}
            disabled={isFormLoading}
          />
          <Label htmlFor="remember-me" className="text-sm font-normal">
            Remember me
          </Label>
        </div>
        <Link href="/forgot-password" className="text-sm text-primary underline-offset-4 hover:underline">
          Forgot password?
        </Link>
      </div>

      <Button type="submit" className="w-full" disabled={isFormLoading}>
        {isFormLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isFormLoading ? "Signing in..." : "Sign in"}
      </Button>
    </form>
  )
}
