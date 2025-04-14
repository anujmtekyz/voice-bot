import { Toaster } from 'react-hot-toast';

export const ToastProvider = () => {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3000,
        style: {
          background: '#333',
          color: '#fff',
        },
        success: {
          duration: 3000,
          style: {
            background: '#10B981',
            color: '#fff',
          },
        },
        error: {
          duration: 4000,
          style: {
            background: '#EF4444',
            color: '#fff',
          },
        },
      }}
    />
  );
}; 