import api from './api';

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

// Authentication API methods
export const authApi = {
  /**
   * Login with email and password
   * @param credentials User login credentials
   * @returns Promise with login response including tokens
   */
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/api/auth/login', credentials);
    return response.data;
  },

  /**
   * Logout the current user
   * @param refreshToken The refresh token to revoke
   * @returns Promise with logout result
   */
  logout: async (refreshToken: string): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/api/auth/logout', { refreshToken });
    return response.data;
  },

  /**
   * Refresh the access token using a refresh token
   * @param request Object containing refresh token
   * @returns Promise with new access token
   */
  refreshToken: async (request: RefreshTokenRequest): Promise<RefreshTokenResponse> => {
    const response = await api.post<RefreshTokenResponse>('/api/auth/refresh-token', request);
    return response.data;
  },

  /**
   * Get current user profile
   * @returns Promise with user profile
   */
  getCurrentUser: async (): Promise<UserProfile> => {
    const response = await api.get<UserProfile>('/api/auth/me');
    return response.data;
  },

  /**
   * Request password reset
   * @param request Object containing user email
   * @returns Promise with request result
   */
  forgotPassword: async (request: ForgotPasswordRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/api/auth/forgot-password', request);
    return response.data;
  },

  /**
   * Reset password with token
   * @param request Object containing token and new password
   * @returns Promise with reset result
   */
  resetPassword: async (request: ResetPasswordRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/api/auth/reset-password', request);
    return response.data;
  },
};

// User API methods
export const userApi = {
  /**
   * Get user profile
   * @returns Promise with user profile
   */
  getProfile: async (): Promise<UserProfile> => {
    const response = await api.get<UserProfile>('/api/users/profile');
    return response.data;
  },

  /**
   * Update user profile
   * @param profile Updated profile data
   * @returns Promise with updated profile
   */
  updateProfile: async (profile: Partial<UserProfile>): Promise<UserProfile> => {
    const response = await api.put<UserProfile>('/api/users/profile', profile);
    return response.data;
  },

  /**
   * Change user password
   * @param request Object containing current and new password
   * @returns Promise with change result
   */
  changePassword: async (request: ChangePasswordRequest): Promise<AuthResponse> => {
    const response = await api.put<AuthResponse>('/api/users/password', request);
    return response.data;
  },
}; 