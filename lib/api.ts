import axios, {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import Cookies from "js-cookie";

const TOKEN_COOKIE_NAME = "token";
const REFRESH_TOKEN_COOKIE_NAME = "refresh_token";

// Create a simple in-memory token store
const tokenStore = {
  accessToken: null as string | null,
  setAccessToken: (token: string | null) => {
    tokenStore.accessToken = token;
  },
  getAccessToken: () => tokenStore.accessToken,
};

// Export the token store for use in other modules
export const authTokenStore = tokenStore;

// Create an axios instance with default config
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001",
  headers: {
    "Content-Type": "application/json",
  },
  // Enable sending cookies with requests
  withCredentials: true,
});

// Add request interceptor to include auth token in all requests
api.interceptors.request.use((config) => {
  const token = tokenStore.getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Flag to prevent multiple redirects
let isRedirecting = false;

// Keep the response interceptor for handling 401s and token refresh
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    // Only attempt refresh if:
    // - We got a 401 Unauthorized error
    // - The request has not been retried before
    // - We're not already trying to refresh the token
    // - We have a refresh token available
    // - We're not already redirecting
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== "/api/auth/refresh-token" &&
      Cookies.get(REFRESH_TOKEN_COOKIE_NAME) &&
      !isRedirecting
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken = Cookies.get(REFRESH_TOKEN_COOKIE_NAME);
        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        // Attempt to refresh the token
        const response = await api.post("/api/auth/refresh-token", {
          refreshToken: refreshToken,
        });

        if (response.data && response.data.accessToken) {
          // Update the Authorization header and retry the original request
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
          } else {
            originalRequest.headers = {
              Authorization: `Bearer ${response.data.accessToken}`,
            };
          }

          // When token refresh succeeds, update the in-memory token
          tokenStore.setAccessToken(response.data.accessToken);

          return api(originalRequest);
        } else {
          // If response doesn't contain token, handle as error
          throw new Error("Invalid refresh token response");
        }
      } catch (refreshError) {
        // If refresh fails, clear auth cookies and redirect to login
        console.error("Token refresh failed:", refreshError);
        authUtils.clearAuthTokens();

        if (typeof window !== "undefined" && !isRedirecting) {
          isRedirecting = true;
          // Use a timeout to prevent navigation during render
          setTimeout(() => {
            window.location.href = "/login?session=expired";
            isRedirecting = false;
          }, 100);
        }
      }
    }

    return Promise.reject(error);
  }
);

// Define response types matching backend interfaces
export interface SystemHealth {
  status: "ok" | "error";
  timestamp: string;
  database: {
    status: "ok" | "error";
    message: string;
  };
  services: {
    redis: {
      status: "ok" | "error";
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
    const response = await api.get<SystemHealth>("/api/system/status");
    return response.data;
  },

  /**
   * Get system version information
   * @returns Promise with system version information
   */
  getVersion: async (): Promise<SystemVersion> => {
    const response = await api.get<SystemVersion>("/api/system/version");
    return response.data;
  },
};

// Helper functions to manage auth cookies and tokens
export const authUtils = {
  /**
   * Set authentication tokens (refresh token in cookie, access token in memory)
   */
  setAuthTokens: (
    accessToken: string,
    refreshToken: string,
    rememberMe: boolean = false
  ) => {
    if (!accessToken || !refreshToken) {
      console.error("Attempted to set empty tokens", {
        accessToken: !!accessToken,
        refreshToken: !!refreshToken,
      });
      return;
    }

    // Set access token in memory
    tokenStore.setAccessToken(accessToken);

    // Set refresh token in cookie for persistence
    const expirationDays = rememberMe ? 30 : 1;
    Cookies.set(REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
      expires: expirationDays,
      sameSite: "strict",
    });
  },

  /**
   * Clear authentication tokens
   */
  clearAuthTokens: () => {
    tokenStore.setAccessToken(null);
    Cookies.remove(REFRESH_TOKEN_COOKIE_NAME);
  },

  /**
   * Check if user is authenticated (has token in memory)
   */
  isAuthenticated: () => {
    return !!tokenStore.getAccessToken();
  },

  /**
   * Get current auth token from memory
   */
  getAuthToken: () => {
    return tokenStore.getAccessToken();
  },

  /**
   * Get current refresh token
   */
  getRefreshToken: () => {
    return Cookies.get(REFRESH_TOKEN_COOKIE_NAME);
  },
};

// Voice settings API types
export interface VoiceSettingsResponse {
  success: boolean;
  message: string;
  data: {
    voiceType: string;
    voiceSpeed: number;
    voiceActivation: boolean;
    sensitivity: number;
    language: string;
    voiceResponseEnabled: boolean;
    voiceResponseVolume: number;
    ambientAwareness: boolean;
    wakeWord: string;
    customCommands: Array<{
      phrase: string;
      action: string;
    }>;
    privacySettings: {
      storeHistory: boolean;
      historyRetentionDays: number;
      filterSensitiveInfo: boolean;
    };
  };
}

export interface UpdateVoiceSettingsRequest {
  voiceType?: string;
  voiceSpeed?: number;
  voiceActivation?: boolean;
  sensitivity?: number;
  language?: string;
  voiceResponseEnabled?: boolean;
  voiceResponseVolume?: number;
  ambientAwareness?: boolean;
  wakeWord?: string;
  customCommands?: Array<{
    phrase: string;
    action: string;
  }>;
  privacySettings?: {
    storeHistory?: boolean;
    historyRetentionDays?: number;
    filterSensitiveInfo?: boolean;
  };
}

// Voice settings API methods
export const voiceApi = {
  /**
   * Get user voice settings
   * @returns Promise with user voice settings
   */
  getSettings: async (): Promise<VoiceSettingsResponse> => {
    const response = await api.get<VoiceSettingsResponse>(
      "/api/voice/settings"
    );
    return response.data;
  },

  /**
   * Update user voice settings
   * @param settings Settings to update
   * @returns Promise with updated settings
   */
  updateSettings: async (
    settings: UpdateVoiceSettingsRequest
  ): Promise<VoiceSettingsResponse> => {
    const response = await api.put<VoiceSettingsResponse>(
      "/api/voice/settings",
      settings
    );
    return response.data;
  },

  /**
   * Get available voice types
   * @returns Promise with available voice types
   */
  getVoiceTypes: async (): Promise<{
    success: boolean;
    message: string;
    data: string[];
  }> => {
    const response = await api.get<{
      success: boolean;
      message: string;
      data: string[];
    }>("/api/voice/settings/voice-types");
    return response.data;
  },

  /**
   * Test voice with current settings
   * @param params Parameters for voice testing
   * @param params.text Text to speak
   * @param params.voiceId Voice ID to use for testing
   * @param params.pitch Voice pitch adjustment
   * @param params.speed Voice speed adjustment
   * @returns Promise with status and audio data
   */
  testVoice: async (params: {
    text: string;
    voiceId?: string;
    pitch?: number;
    speed?: number;
  }): Promise<{
    success: boolean;
    audioData?: string;
  }> => {
    const response = await api.post<{
      success: boolean;
      audioData?: string;
    }>("/api/voice/settings/test", params);
    return response.data;
  },
};

// Voice transcription API methods
export const voiceTranscriptionApi = {
  /**
   * Transcribe voice audio to text
   * @param audioData Base64 encoded audio data
   * @param format Audio format (e.g., 'webm', 'mp3')
   * @returns Promise with transcription result
   */
  transcribe: async (
    audioData: string,
    format: string = "webm"
  ): Promise<{
    success: boolean;
    message: string;
    text?: string;
  }> => {
    const response = await api.post<{
      success: boolean;
      message: string;
      text?: string;
    }>("/api/voice/transcribe", { audioData, format });
    return response.data;
  },

  /**
   * Process voice command
   * @param text Command text to process
   * @returns Promise with command processing result
   */
  processCommand: async (
    text: string
  ): Promise<{
    success: boolean;
    message: string;
    command?: string;
    action?: string;
    data?: any;
  }> => {
    const response = await api.post<{
      success: boolean;
      message: string;
      command?: string;
      action?: string;
      data?: any;
    }>("/api/voice/command", { text });
    return response.data;
  },
};

// Export the api instance for use in other services
export default api;
