"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Mic, Loader2, Mail, Lock, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import Cookies from "js-cookie"

interface LoginFormProps {
  onVoiceLoginToggle?: (active: boolean) => void
  isVoiceLoginActive?: boolean
}

export function LoginForm({ onVoiceLoginToggle, isVoiceLoginActive = false }: LoginFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
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

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    // Simulate login API call
    setTimeout(() => {
      // For demo purposes, accept any email with a valid format and password length >= 6
      if (/\S+@\S+\.\S+/.test(email) && password.length >= 6) {
        // Set auth cookie
        const expirationDays = rememberMe ? 30 : 1
        Cookies.set("auth_token", "demo_token_" + Date.now(), {
          expires: expirationDays,
          sameSite: "strict",
        })

        // Success
        toast({
          title: "Login successful",
          description: "Welcome to JIRA VoiceBot",
        })

        // Redirect to dashboard
        router.push("/dashboard")
      } else {
        // Failure
        toast({
          title: "Login failed",
          description: "Invalid email or password",
          variant: "destructive",
        })
        setIsLoading(false)
      }
    }, 1500)
  }

  const toggleVoiceLogin = () => {
    if (onVoiceLoginToggle) {
      onVoiceLoginToggle(!isVoiceLoginActive)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
            onChange={(e) => setEmail(e.target.value)}
            className={`pl-10 ${errors.email ? "border-destructive" : ""}`}
            disabled={isLoading || isVoiceLoginActive}
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
            onChange={(e) => setPassword(e.target.value)}
            className={`pl-10 ${errors.password ? "border-destructive" : ""}`}
            disabled={isLoading || isVoiceLoginActive}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-10 w-10 text-muted-foreground"
            onClick={() => setShowPassword(!showPassword)}
            disabled={isLoading || isVoiceLoginActive}
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
            disabled={isLoading || isVoiceLoginActive}
          />
          <Label htmlFor="remember-me" className="text-sm font-normal">
            Remember me
          </Label>
        </div>
        <Link href="/forgot-password" className="text-sm text-primary underline-offset-4 hover:underline">
          Forgot password?
        </Link>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading || isVoiceLoginActive}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isLoading ? "Signing in..." : "Sign in"}
      </Button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
        </div>
      </div>

      <Button type="button" variant="outline" className="w-full" onClick={toggleVoiceLogin} disabled={isLoading}>
        <Mic className="mr-2 h-4 w-4" />
        Voice Login
      </Button>
    </form>
  )
}
