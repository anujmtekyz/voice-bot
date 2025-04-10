// Script to test just the SystemStatus component integration
const { execSync } = require('child_process');

console.log('Testing System Status Component Integration');

// Set environment variables to mock or point to actual backend
process.env.NEXT_PUBLIC_API_URL = 'http://localhost:3001';

try {
  // Run the backend first (assumes it's not already running)
  const backendProcess = execSync('cd server && pnpm start:dev', { 
    stdio: 'inherit',
    detached: true
  });
  
  console.log('Backend started...');
  
  // Wait for backend to start
  setTimeout(() => {
    try {
      // Run the component test
      execSync('jest __tests__/components/system-status.test.tsx', { 
        stdio: 'inherit' 
      });
      
      console.log('Component tests completed successfully!');
    } catch (error) {
      console.error('Error running component tests:', error.message);
      process.exit(1);
    } finally {
      // Cleanup: Stop the backend
      process.kill(-backendProcess.pid);
    }
  }, 5000);
} catch (error) {
  console.error('Error starting backend:', error.message);
  process.exit(1);
} 