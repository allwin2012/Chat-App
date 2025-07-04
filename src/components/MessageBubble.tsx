import { formatMessageTime } from '../data/mockData';

interface MessageBubbleProps {
  text: string;
  timestamp: string;
  isCurrentUser: boolean;
  status?: 'sent' | 'delivered' | 'read';
}

const MessageBubble = ({ text, timestamp, isCurrentUser, status }: MessageBubbleProps) => {
  return (
    <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-4 animate-slide-in-up`}>
      <div 
        className={`max-w-[70%] sm:max-w-[60%] px-4 py-2 rounded-2xl shadow-sm ${
          isCurrentUser 
            ? 'bg-blue-500 text-white rounded-tr-none bg-gradient-to-br from-blue-500 to-blue-600' 
            : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-tl-none dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-700'
        }`}
      >
        <p className="whitespace-pre-wrap break-words">{text}</p>
        <div className={`flex items-center justify-end text-xs mt-1 ${
          isCurrentUser ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
        }`}>
          <span>{formatMessageTime(timestamp)}</span>
          
          {isCurrentUser && status && (
            <span className="ml-1">
              {status === 'sent' && <span>✓</span>}
              {status === 'delivered' && <span>✓✓</span>}
              {status === 'read' && <span className="text-blue-100">✓✓</span>}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
