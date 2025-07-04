import { useState, useRef, useEffect } from 'react';
import { Mic, Paperclip, Send, Smile } from 'lucide-react';
import { useApp } from '../context/AppContext';
import AttachmentModal from './AttachmentModal';

interface MessageInputProps {
  chatId: string;
  recipientId: string;
  onSendMessage: (text: string) => void;
}

const MessageInput = ({ chatId, recipientId, onSendMessage }: MessageInputProps) => {
  const [message, setMessage] = useState('');
  const [rows, setRows] = useState(1);
  const [showAttachmentModal, setShowAttachmentModal] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { isTyping, setIsTyping } = useApp();
  
  // Auto-resize textarea based on content
  useEffect(() => {
    if (inputRef.current) {
      // Store the scroll position
      const scrollPosition = inputRef.current.scrollTop;
      
      // Reset height to auto to get the proper scrollHeight
      inputRef.current.style.height = 'auto';
      
      // Set a min height of one row
      const minHeight = 24; // min height for single row
      const maxHeight = 120; // max height (5 rows)
      
      // Calculate new height
      const newHeight = Math.max(
        minHeight,
        Math.min(inputRef.current.scrollHeight, maxHeight)
      );
      
      // Apply the new height
      inputRef.current.style.height = `${newHeight}px`;
      
      // Restore scroll position
      inputRef.current.scrollTop = scrollPosition;
      
      // Calculate rows based on height
      const singleRowHeight = 24;
      const calculatedRows = Math.ceil(newHeight / singleRowHeight);
      setRows(calculatedRows);
    }
  }, [message]);
  
  // Simulate "typing" indicator on recipient side
  useEffect(() => {
    // Only create timeout if message changed
    const typingTimeout = setTimeout(() => {
      // Set typing status based on message length
      setIsTyping(recipientId, message.length > 0);
    }, 500);
    
    // Clear timeout when component unmounts or dependencies change
    return () => {
      clearTimeout(typingTimeout);
    };
  }, [message, recipientId, setIsTyping]);
  
  // Clear typing indicator when component unmounts
  useEffect(() => {
    return () => {
      setIsTyping(recipientId, false);
    };
  }, [recipientId, setIsTyping]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage('');
      
      // Reset textarea height
      if (inputRef.current) {
        inputRef.current.style.height = '24px'; // Reset to single row
      }
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };
  
  const handleAttachmentSelect = (option: string) => {
    // In a real app, this would handle different attachment types
    console.log(`Selected attachment option: ${option}`);
    
    // Mock attachment message
    const attachmentMessages = {
      'image': '📷 [Image attachment]',
      'document': '📄 [Document attachment]',
      'video': '🎥 [Video attachment]',
      'browse': '📎 [File attachment]'
    };
    
    onSendMessage(attachmentMessages[option as keyof typeof attachmentMessages] || 'Attachment');
  };
  
  return (
    <>
      <form 
        onSubmit={handleSubmit}
        className="flex items-end bg-white dark:bg-gray-900 px-4 py-3 border-t dark:border-gray-700"
      >
        <div className="flex items-center mr-2">
          <button 
            type="button" 
            onClick={() => setShowAttachmentModal(true)}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 relative"
            aria-label="Attach file"
          >
            <Paperclip size={20} />
            <span className="absolute bottom-0 right-0 w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
          </button>
        </div>
        
        <div ref={containerRef} className="flex-1 relative min-h-[40px]">
          <textarea
            ref={inputRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message"
            rows={1}
            className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full resize-none text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[40px] max-h-[120px] overflow-y-auto"
            style={{ lineHeight: '24px' }}
          />
          
          <button 
            type="button" 
            className="absolute right-4 bottom-[50%] translate-y-[50%] p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
            aria-label="Add emoji"
          >
            <Smile size={20} />
          </button>
        </div>
        
        <div className="flex items-center ml-2">
          {message.trim() ? (
            <button 
              type="submit"
              className="p-3 rounded-full bg-blue-500 hover:bg-blue-600 text-white"
              aria-label="Send message"
            >
              <Send size={18} />
            </button>
          ) : (
            <button 
              type="button" 
              className="p-3 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400"
              aria-label="Voice message"
            >
              <Mic size={20} />
            </button>
          )}
        </div>
      </form>
      
      <AttachmentModal 
        isOpen={showAttachmentModal}
        onClose={() => setShowAttachmentModal(false)}
        onSelectOption={handleAttachmentSelect}
      />
    </>
  );
};

export default MessageInput;
