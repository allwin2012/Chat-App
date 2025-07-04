import { useNavigate } from 'react-router-dom';
import { getUserById } from '../data/mockData';
import { ChevronLeft, EllipsisVertical, Phone, Video } from 'lucide-react';

interface ChatHeaderProps {
  userId: string;
  isTyping: boolean;
}

const ChatHeader = ({ userId, isTyping }: ChatHeaderProps) => {
  const navigate = useNavigate();
  const user = getUserById(userId);
  
  if (!user) return null;
  
  const handleBackClick = () => {
    navigate('/', { replace: false });
  };
  
  const handleVoiceCall = () => {
    navigate(`/call/voice/${userId}`);
  };
  
  const handleVideoCall = () => {
    navigate(`/call/video/${userId}`);
  };
  
  return (
    <div className="flex items-center px-4 py-3 bg-white dark:bg-gray-900 border-b dark:border-gray-700 shadow-sm z-10">
      <button 
        onClick={handleBackClick}
        className="mr-2 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="Go back to chat list"
      >
        <ChevronLeft size={24} className="text-gray-600 dark:text-gray-300" />
      </button>
      
      <div className="relative mr-3 group">
        <div className="overflow-hidden rounded-full transition-transform duration-200 group-hover:scale-110">
          <img 
            src={user.avatar} 
            alt={user.name} 
            className="w-10 h-10 rounded-full object-cover"
          />
        </div>
        <span className={`absolute bottom-0 right-0 w-3 h-3 ${user.online ? 'bg-green-500' : 'bg-gray-400'} rounded-full border-2 border-white dark:border-gray-900 transition-all duration-200 group-hover:scale-110 group-hover:border-blue-100 dark:group-hover:border-blue-900`}></span>
        
        {/* Hover tooltip */}
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-20 pointer-events-none">
          {user.online ? 'Online' : `Last seen ${user.lastSeen}`}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-solid border-transparent border-t-gray-900 dark:border-t-gray-700"></div>
        </div>
      </div>
      
      <div className="flex-1 min-w-0">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
          {user.name}
        </h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
          {isTyping ? (
            <span className="text-green-500 font-medium">typing...</span>
          ) : (
            user.online ? 'Online' : `Last seen ${user.lastSeen}`
          )}
        </p>
      </div>
      
      <div className="flex items-center space-x-1 md:space-x-3">
        <button 
          onClick={handleVoiceCall}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Voice call"
        >
          <Phone size={20} className="text-gray-600 dark:text-gray-300" />
        </button>
        <button 
          onClick={handleVideoCall}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Video call"
        >
          <Video size={20} className="text-gray-600 dark:text-gray-300" />
        </button>
        <button 
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="More options"
        >
          <EllipsisVertical size={20} className="text-gray-600 dark:text-gray-300" />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
