import { useApp } from '../context/AppContext';
import { useState, useRef, useEffect } from 'react';
import { Mic, Paperclip, Send, Smile } from 'lucide-react';
import AttachmentModal from './AttachmentModal';

interface MessageInputProps {
  chatId: string;
  recipientId: string; // Made required
  onSendMessage: (text: string) => void;
}

const MessageInput = ({ recipientId, onSendMessage }: MessageInputProps) => {
  const [message, setMessage] = useState('');
  const [showAttachmentModal, setShowAttachmentModal] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { setIsTyping } = useApp(); // Only using setIsTyping

  // Auto-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      const scrollPosition = inputRef.current.scrollTop;
      inputRef.current.style.height = 'auto';

      const minHeight = 24;
      const maxHeight = 120;
      const newHeight = Math.max(
        minHeight,
        Math.min(inputRef.current.scrollHeight, maxHeight)
      );

      inputRef.current.style.height = `${newHeight}px`;
      inputRef.current.scrollTop = scrollPosition;
    }
  }, [message]);

  // Typing simulation
  useEffect(() => {
    const typingTimeout = setTimeout(() => {
      if (recipientId) {
        setIsTyping(recipientId, message.length > 0);
      }
    }, 500);

    return () => clearTimeout(typingTimeout);
  }, [message, recipientId, setIsTyping]);

  useEffect(() => {
    return () => {
      if (recipientId) {
        setIsTyping(recipientId, false);
      }
    };
  }, [recipientId, setIsTyping]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage('');
      if (inputRef.current) inputRef.current.style.height = '24px';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleAttachmentSelect = (option: string) => {
    const attachmentMessages = {
      image: '📷 [Image attachment]',
      document: '📄 [Document attachment]',
      video: '🎥 [Video attachment]',
      browse: '📎 [File attachment]'
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
