import { useState, useCallback } from 'react';
import Toast from '../components/Toast';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastOptions {
  type?: ToastType;
  duration?: number;
}

interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
  duration: number;
}

export const useToast = () => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  
  const showToast = useCallback((message: string, options: ToastOptions = {}) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newToast: ToastItem = {
      id,
      message,
      type: options.type || 'info',
      duration: options.duration || 3000
    };
    
    setToasts(prev => [...prev, newToast]);
    
    return id;
  }, []);
  
  const hideToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);
  
  const ToastContainer = useCallback(() => {
    if (toasts.length === 0) return null;
    
    return (
      <>
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            onClose={() => hideToast(toast.id)}
          />
        ))}
      </>
    );
  }, [toasts, hideToast]);
  
  return {
    showToast,
    hideToast,
    ToastContainer
  };
};
