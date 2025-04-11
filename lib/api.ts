import axios, { AxiosError, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import Cookies from 'js-cookie';

const TOKEN_COOKIE_NAME = 'auth_token';
const REFRESH_TOKEN_COOKIE_NAME = 'refresh_token';

// Create an axios instance with default config
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  headers: {
    'Content-Type': 'application/json',
  },
  // Enable sending cookies with requests
  withCredentials: true,
});

// Add request interceptor to attach auth token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = Cookies.get(TOKEN_COOKIE_NAME);
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// Add response interceptor to handle token refresh on 401 errors
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
    
    // Only attempt refresh if:
    // - We got a 401 Unauthorized error
    // - The request has not been retried before
    // - We're not already trying to refresh the token
    // - We have a refresh token available
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== '/api/auth/refresh-token' &&
      Cookies.get(REFRESH_TOKEN_COOKIE_NAME)
    ) {
      originalRequest._retry = true;
      
      try {
        // Attempt to refresh the token
        const response = await api.post('/api/auth/refresh-token', {
          refreshToken: Cookies.get(REFRESH_TOKEN_COOKIE_NAME),
        });
        
        // If successful, update the token cookie
        if (response.data.accessToken) {
          Cookies.set(TOKEN_COOKIE_NAME, response.data.accessToken);
          
          // Update the Authorization header and retry the original request
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
          } else {
            originalRequest.headers = {
              Authorization: `Bearer ${response.data.accessToken}`,
            };
          }
          
          return api(originalRequest);
        }
      } catch (refreshError) {
        // If refresh fails, clear auth cookies and redirect to login
        Cookies.remove(TOKEN_COOKIE_NAME);
        Cookies.remove(REFRESH_TOKEN_COOKIE_NAME);
        
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      }
    }
    
    return Promise.reject(error);
  }
);

// Define response types matching backend interfaces
export interface SystemHealth {
  status: 'ok' | 'error';
  timestamp: string;
  database: {
    status: 'ok' | 'error';
    message: string;
  };
  services: {
    redis: {
      status: 'ok' | 'error';
      message: string;
    };
  };
}

export interface SystemVersion {
  version: string;
  environment: string;
  nodeVersion: string;
  nestVersion: string;
}

// System API methods
export const systemApi = {
  /**
   * Get system health status
   * @returns Promise with system health information
   */
  getStatus: async (): Promise<SystemHealth> => {
    const response = await api.get<SystemHealth>('/api/system/status');
    return response.data;
  },

  /**
   * Get system version information
   * @returns Promise with system version information
   */
  getVersion: async (): Promise<SystemVersion> => {
    const response = await api.get<SystemVersion>('/api/system/version');
    return response.data;
  }
};

// Helper functions to manage auth cookies
export const authUtils = {
  /**
   * Set authentication tokens in cookies
   */
  setAuthTokens: (accessToken: string, refreshToken: string, rememberMe: boolean = false) => {
    const expirationDays = rememberMe ? 30 : 1;
    Cookies.set(TOKEN_COOKIE_NAME, accessToken, {
      expires: expirationDays,
      sameSite: 'strict',
    });
    Cookies.set(REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
      expires: expirationDays,
      sameSite: 'strict', 
    });
  },

  /**
   * Clear authentication tokens from cookies
   */
  clearAuthTokens: () => {
    Cookies.remove(TOKEN_COOKIE_NAME);
    Cookies.remove(REFRESH_TOKEN_COOKIE_NAME);
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: () => {
    return !!Cookies.get(TOKEN_COOKIE_NAME);
  },

  /**
   * Get current auth token
   */
  getAuthToken: () => {
    return Cookies.get(TOKEN_COOKIE_NAME);
  },

  /**
   * Get current refresh token
   */
  getRefreshToken: () => {
    return Cookies.get(REFRESH_TOKEN_COOKIE_NAME);
  },
};

// Export the api instance for use in other services
export default api; 