import api from "./api";
import { authTokenStore } from "./api";

// Auth API Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
}

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  jiraEmail?: string;
  jiraServerUrl?: string;
  isEmailVerified: boolean;
  lastLoginAt?: string;
  createdAt: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

// Backend response wrapper format
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  timestamp: string;
  statusCode: number;
}

// Authentication API methods
export const authApi = {
  /**
   * Login with email and password
   * @param credentials User login credentials
   * @returns Promise with login response including tokens
   */
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    // Note the generic type is now ApiResponse<LoginResponse>
    const response = await api.post<ApiResponse<LoginResponse>>(
      "/api/auth/login",
      credentials
    );

    // Check if we have a nested data property with tokens
    if (response.data && response.data.data) {
      return response.data.data; // Return the nested data object with tokens
    }

    // Fallback to direct response (though unlikely based on the API response format)
    return response.data as unknown as LoginResponse;
  },

  /**
   * Logout the current user
   * @param refreshToken The refresh token to revoke
   * @returns Promise with logout result
   */
  logout: async (refreshToken: string): Promise<AuthResponse> => {
    const response = await api.post<ApiResponse<AuthResponse>>(
      "/api/auth/logout",
      {
        refreshToken,
      }
    );

    if (response.data && response.data.data) {
      return response.data.data;
    }

    return response.data as unknown as AuthResponse;
  },

  /**
   * Refresh the access token using a refresh token
   * @param request Object containing refresh token
   * @returns Promise with new access token
   */
  refreshToken: async (
    request: RefreshTokenRequest
  ): Promise<RefreshTokenResponse> => {
    const response = await api.post<ApiResponse<RefreshTokenResponse>>(
      "/api/auth/refresh-token",
      request
    );

    // Check if we have a nested data property with token
    if (response.data && response.data.data) {
      return response.data.data; // Return the nested data object with access token
    }

    // Fallback to direct response
    return response.data as unknown as RefreshTokenResponse;
  },

  /**
   * Get current user profile with explicit token
   * @returns Promise with user profile
   */
  getCurrentUser: async (): Promise<UserProfile> => {
    // Get the token directly from the token store
    const token = authTokenStore.getAccessToken();

    if (!token) {
      throw new Error("No authentication token available");
    }

    const response = await api.get<ApiResponse<UserProfile>>("/api/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Check if we have a nested data property with user profile
    if (response.data && response.data.data) {
      return response.data.data; // Return the nested data object with user profile
    }

    // Fallback to direct response
    return response.data as unknown as UserProfile;
  },

  /**
   * Request password reset
   * @param request Object containing user email
   * @returns Promise with request result
   */
  forgotPassword: async (
    request: ForgotPasswordRequest
  ): Promise<AuthResponse> => {
    const response = await api.post<ApiResponse<AuthResponse>>(
      "/api/auth/forgot-password",
      request
    );

    if (response.data && response.data.data) {
      return response.data.data;
    }

    return response.data as unknown as AuthResponse;
  },

  /**
   * Reset password with token
   * @param request Object containing token and new password
   * @returns Promise with reset result
   */
  resetPassword: async (
    request: ResetPasswordRequest
  ): Promise<AuthResponse> => {
    const response = await api.post<ApiResponse<AuthResponse>>(
      "/api/auth/reset-password",
      request
    );

    if (response.data && response.data.data) {
      return response.data.data;
    }

    return response.data as unknown as AuthResponse;
  },
};

// User API methods
export const userApi = {
  /**
   * Get user profile with explicit token
   * @returns Promise with user profile
   */
  getProfile: async (): Promise<UserProfile> => {
    const token = authTokenStore.getAccessToken();

    if (!token) {
      throw new Error("No authentication token available");
    }

    const response = await api.get<ApiResponse<UserProfile>>(
      "/api/users/profile",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data && response.data.data) {
      return response.data.data;
    }

    return response.data as unknown as UserProfile;
  },

  /**
   * Update user profile with explicit token
   * @param profile Updated profile data
   * @returns Promise with updated profile
   */
  updateProfile: async (
    profile: Partial<UserProfile>
  ): Promise<UserProfile> => {
    const token = authTokenStore.getAccessToken();

    if (!token) {
      throw new Error("No authentication token available");
    }

    const response = await api.put<ApiResponse<UserProfile>>(
      "/api/users/profile",
      profile,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data && response.data.data) {
      return response.data.data;
    }

    return response.data as unknown as UserProfile;
  },

  /**
   * Change user password with explicit token
   * @param request Object containing current and new password
   * @returns Promise with change result
   */
  changePassword: async (
    request: ChangePasswordRequest
  ): Promise<AuthResponse> => {
    const token = authTokenStore.getAccessToken();

    if (!token) {
      throw new Error("No authentication token available");
    }

    const response = await api.put<ApiResponse<AuthResponse>>(
      "/api/users/password",
      request,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data && response.data.data) {
      return response.data.data;
    }

    return response.data as unknown as AuthResponse;
  },
};
