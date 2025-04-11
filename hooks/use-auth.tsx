'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authApi, LoginRequest, UserProfile } from '@/lib/auth-api';
import { authUtils } from '@/lib/api';
import { useToast } from './use-toast';

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginRequest, rememberMe: boolean) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshUserProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();
  const { toast } = useToast();

  // Check if user is authenticated on initial load
  useEffect(() => {
    const loadUserProfile = async () => {
      if (authUtils.isAuthenticated()) {
        try {
          const userData = await authApi.getCurrentUser();
          setUser(userData);
        } catch (error) {
          console.error('Failed to fetch user profile:', error);
          // If we fail to get the user profile, clear auth tokens and redirect
          authUtils.clearAuthTokens();
          router.push('/login');
        }
      }
      setIsLoading(false);
    };

    loadUserProfile();
  }, [router]);

  const login = async (credentials: LoginRequest, rememberMe: boolean): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await authApi.login(credentials);
      
      // Store tokens in cookies
      authUtils.setAuthTokens(response.accessToken, response.refreshToken, rememberMe);
      
      // Fetch user profile after successful login
      const userData = await authApi.getCurrentUser();
      setUser(userData);
      
      toast({
        title: 'Login successful',
        description: `Welcome back${userData.firstName ? `, ${userData.firstName}` : ''}!`,
      });
      
      // Redirect to dashboard
      router.push('/dashboard');
      return true;
    } catch (error: any) {
      console.error('Login failed:', error);
      
      // Handle specific error messages from the backend
      const errorMessage = error.response?.data?.message || 'Invalid email or password';
      
      toast({
        title: 'Login failed',
        description: errorMessage,
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    try {
      const refreshToken = authUtils.getRefreshToken();
      if (refreshToken) {
        await authApi.logout(refreshToken);
      }
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      // Always clear local auth data regardless of API call result
      authUtils.clearAuthTokens();
      setUser(null);
      setIsLoading(false);
      router.push('/login');
    }
  };

  const refreshUserProfile = async (): Promise<void> => {
    if (authUtils.isAuthenticated()) {
      try {
        const userData = await authApi.getCurrentUser();
        setUser(userData);
      } catch (error) {
        console.error('Failed to refresh user profile:', error);
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        refreshUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 