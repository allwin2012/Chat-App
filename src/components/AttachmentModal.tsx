import { useState, useRef, useEffect } from 'react';
import { FileImage, FileText, Film, Upload, X } from 'lucide-react';

interface AttachmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectOption: (option: string) => void;
}

const AttachmentModal = ({ isOpen, onClose, onSelectOption }: AttachmentModalProps) => {
  const [closing, setClosing] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  
  // Handle click outside to close
  useEffect(() => {
    if (!isOpen) return;
    
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        handleClose();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);
  
  // Handle ESC key to close
  useEffect(() => {
    if (!isOpen) return;
    
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose();
      }
    };
    
    document.addEventListener('keydown', handleEscKey);
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen]);
  
  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      setClosing(false);
      onClose();
    }, 200);
  };
  
  const handleOptionSelect = (option: string) => {
    onSelectOption(option);
    handleClose();
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center bg-black bg-opacity-30 backdrop-blur-sm transition-opacity duration-200">
      <div 
        ref={modalRef}
        className={`bg-white dark:bg-gray-800 rounded-t-xl sm:rounded-xl shadow-xl w-full max-w-sm sm:max-w-md transition-transform duration-200 transform ${
          closing ? 'translate-y-full sm:scale-95 opacity-0' : 'translate-y-0 sm:scale-100 opacity-100'
        }`}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Add Attachment
          </h3>
          <button
            onClick={handleClose}
            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-4 grid grid-cols-2 gap-3">
          <button
            onClick={() => handleOptionSelect('image')}
            className="flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-900 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors duration-200"
          >
            <div className="w-12 h-12 flex items-center justify-center bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-full mb-2">
              <FileImage size={24} />
            </div>
            <span className="text-sm font-medium text-gray-900 dark:text-white">Image</span>
          </button>
          
          <button
            onClick={() => handleOptionSelect('document')}
            className="flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-900 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors duration-200"
          >
            <div className="w-12 h-12 flex items-center justify-center bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-full mb-2">
              <FileText size={24} />
            </div>
            <span className="text-sm font-medium text-gray-900 dark:text-white">Document</span>
          </button>
          
          <button
            onClick={() => handleOptionSelect('video')}
            className="flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-900 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors duration-200"
          >
            <div className="w-12 h-12 flex items-center justify-center bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-full mb-2">
              <Film size={24} />
            </div>
            <span className="text-sm font-medium text-gray-900 dark:text-white">Video</span>
          </button>
          
          <button
            onClick={() => handleOptionSelect('browse')}
            className="flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-900 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors duration-200"
          >
            <div className="w-12 h-12 flex items-center justify-center bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-full mb-2">
              <Upload size={24} />
            </div>
            <span className="text-sm font-medium text-gray-900 dark:text-white">Browse</span>
          </button>
        </div>
        
        <div className="px-4 py-3 border-t dark:border-gray-700 flex justify-end">
          <button
            onClick={handleClose}
            className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 font-medium transition-colors duration-200"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AttachmentModal;
