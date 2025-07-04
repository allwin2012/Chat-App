import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
  onClose?: () => void;
}

const Toast = ({ message, type = 'info', duration = 3000, onClose }: ToastProps) => {
  const [isVisible, setIsVisible] = useState(true);
  
  // Automatically hide the toast after duration
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onClose) {
        setTimeout(onClose, 300); // Allow time for exit animation
      }
    }, duration);
    
    return () => clearTimeout(timer);
  }, [duration, onClose]);
  
  // Handle manual close
  const handleClose = () => {
    setIsVisible(false);
    if (onClose) {
      setTimeout(onClose, 300); // Allow time for exit animation
    }
  };
  
  // Get appropriate styling based on toast type
  const getToastStyle = () => {
    switch (type) {
      case 'success':
        return 'bg-green-500 border-green-600';
      case 'error':
        return 'bg-red-500 border-red-600';
      case 'warning':
        return 'bg-yellow-500 border-yellow-600';
      case 'info':
      default:
        return 'bg-blue-500 border-blue-600';
    }
  };
  
  return (
    <div 
      className={`fixed top-4 left-1/2 transform -translate-x-1/2 max-w-sm w-full p-4 rounded-md shadow-lg border-l-4 text-white ${getToastStyle()} transition-all duration-300 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
      } z-50`}
      role="alert"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">{message}</div>
        <button 
          onClick={handleClose} 
          className="ml-4 p-1 rounded-full hover:bg-white/20 transition-colors duration-200"
          aria-label="Close notification"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

export default Toast;
