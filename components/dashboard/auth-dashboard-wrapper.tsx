"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'

interface AuthDashboardWrapperProps {
  children: React.ReactNode
}

export function AuthDashboardWrapper({ children }: AuthDashboardWrapperProps) {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  console.log(`AuthDashboardWrapper Rendering: isLoading=${isLoading}, isAuthenticated=${isAuthenticated}`);

  useEffect(() => {
    console.log(`AuthDashboardWrapper useEffect triggered: isLoading=${isLoading}, isAuthenticated=${isAuthenticated}`);
    // Only perform check/redirect when auth loading is complete
    if (!isLoading) {
      console.log(`AuthDashboardWrapper useEffect: !isLoading condition met.`);
      if (!isAuthenticated) {
        console.log('AuthDashboardWrapper useEffect: !isAuthenticated condition met. Redirecting to login')
        router.replace('/login')
      } else {
        console.log('AuthDashboardWrapper useEffect: isAuthenticated condition met. No redirect needed.')
      }
    } else {
        console.log('AuthDashboardWrapper useEffect: isLoading condition met. Waiting for loading to complete.');
    }
  }, [isLoading, isAuthenticated, router])

  // Show loading indicator ONLY while useAuth is initializing
  if (isLoading) {
    console.log('AuthDashboardWrapper: Rendering loading indicator because isLoading is true.');
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Loading dashboard...</h2>
          <p className="text-muted-foreground">Please wait while we prepare your workspace</p>
        </div>
      </div>
    )
  }

  // If loading is finished and user IS NOT authenticated, the useEffect initiated a redirect,
  // so rendering null briefly here prevents rendering children before redirect happens.
  if (!isLoading && !isAuthenticated) {
     console.log('AuthDashboardWrapper: Rendering null because !isLoading && !isAuthenticated (redirect pending/intended).');
     return null;
  }
  
  // Otherwise, loading is done and user is authenticated.
  console.log('AuthDashboardWrapper: Rendering children because !isLoading && isAuthenticated.');
  return <>{children}</>
} 