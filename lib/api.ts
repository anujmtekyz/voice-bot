import axios from 'axios';

// Create an axios instance with default config
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  headers: {
    'Content-Type': 'application/json',
  },
});

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

// Export the api instance for use in other services
export default api; 