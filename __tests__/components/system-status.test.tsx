import { render, screen, waitFor } from '@testing-library/react';
import { SystemStatus } from '@/components/system-status';
import * as api from '@/lib/api';
import { SystemHealth, SystemVersion } from '@/lib/api';

// Mock the API
jest.mock('@/lib/api', () => ({
  systemApi: {
    getStatus: jest.fn(),
    getVersion: jest.fn(),
  },
}));

describe('SystemStatus Component', () => {
  const mockHealth: SystemHealth = {
    status: 'ok',
    timestamp: '2023-04-01T12:00:00Z',
    database: {
      status: 'ok',
      message: 'Database connection is active',
    },
    services: {
      redis: {
        status: 'ok',
        message: 'Redis connection is active',
      },
    },
  };

  const mockVersion: SystemVersion = {
    version: '1.0.0',
    environment: 'test',
    nodeVersion: 'v18.15.0',
    nestVersion: '11.0.0',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (api.systemApi.getStatus as jest.Mock).mockResolvedValue(mockHealth);
    (api.systemApi.getVersion as jest.Mock).mockResolvedValue(mockVersion);
  });

  it('should render loading state initially', () => {
    render(<SystemStatus />);
    
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('should render system status information when data is loaded', async () => {
    render(<SystemStatus />);
    
    // Wait for the component to finish loading
    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });
    
    // Check that API methods were called
    expect(api.systemApi.getStatus).toHaveBeenCalled();
    expect(api.systemApi.getVersion).toHaveBeenCalled();
    
    // Check that health data is rendered
    expect(screen.getByText('System Status')).toBeInTheDocument();
    expect(screen.getByText('System Health')).toBeInTheDocument();
    expect(screen.getByText('Database')).toBeInTheDocument();
    expect(screen.getByText('Redis')).toBeInTheDocument();
    expect(screen.getByText('Database connection is active')).toBeInTheDocument();
    expect(screen.getByText('Redis connection is active')).toBeInTheDocument();
    
    // Check that version data is rendered
    expect(screen.getByText('Version Information')).toBeInTheDocument();
    expect(screen.getByText('App Version')).toBeInTheDocument();
    expect(screen.getByText('1.0.0')).toBeInTheDocument();
    expect(screen.getByText('test')).toBeInTheDocument();
    expect(screen.getByText('v18.15.0')).toBeInTheDocument();
    expect(screen.getByText('11.0.0')).toBeInTheDocument();
  });

  it('should render error state when API fails', async () => {
    // Mock API failure
    const errorMessage = 'Failed to load system status. Please try again later.';
    (api.systemApi.getStatus as jest.Mock).mockRejectedValue(new Error('API Error'));
    
    render(<SystemStatus />);
    
    // Wait for the error state to be rendered
    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });
}); 