import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { sortChatsByRecent, getUserById, formatMessageDate } from '../data/mockData';
import { Search } from 'lucide-react';

export const ChatList = () => {
  const { chats, } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  
  // Sort chats by most recent message
  const sortedChats = sortChatsByRecent(chats);
  
  // Filter chats based on search term
  const filteredChats = sortedChats.filter(chat => {
    const otherParticipantId = chat.participants.find(id => id !== 'current');
    if (!otherParticipantId) return false;
    
    const user = getUserById(otherParticipantId);
    if (!user) return false;
    
    return user.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleChatClick = (userId: string) => {
    navigate(`/chat/${userId}`);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Search bar */}
      <div className="sticky top-0 z-10 px-4 py-3 border-b dark:border-gray-700 bg-white dark:bg-gray-900">
        <div className="relative">
          <input
            type="text"
            placeholder="Search conversations"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Search conversations"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
        </div>
      </div>
      
      {/* Chat list */}
      <div className="flex-1 overflow-y-auto">
        {filteredChats.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full px-4 text-center">
            <div className="text-gray-500 dark:text-gray-400 mb-2">No conversations found</div>
            <p className="text-sm text-gray-400 dark:text-gray-500">
              {searchTerm ? 'Try a different search term' : 'Start a new conversation to see it here'}
            </p>
          </div>
        ) : (
          <ul>
            {filteredChats.map(chat => {
              const otherParticipantId = chat.participants.find(id => id !== 'current');
              if (!otherParticipantId) return null;
              
              const user = getUserById(otherParticipantId);
              if (!user) return null;
              
              const lastMessage = chat.lastMessage;
              
              // Count unread messages
              const unreadCount = chat.messages.filter(msg => 
                msg.senderId !== 'current' && !msg.isRead
              ).length;
              
              return (
                <li key={chat.id} className="relative">
                  <div 
                    onClick={() => handleChatClick(user.id)}
                    className={`flex items-center px-4 py-3 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors duration-150 ${
                      unreadCount > 0 ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                    }`}
                  >
                    {/* Avatar with online indicator */}
                    <div className="relative group">
                      <div className="overflow-hidden rounded-full transition-transform duration-200 group-hover:scale-110">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-12 h-12 rounded-full object-cover border-2 border-transparent group-hover:border-blue-200 dark:group-hover:border-blue-900"
                        />
                      </div>
                      <span 
                        className={`absolute bottom-0 right-0 w-3 h-3 ${
                          user.online ? 'bg-green-500' : 'bg-gray-400'
                        } rounded-full border-2 border-white dark:border-gray-900 transition-all duration-200 group-hover:scale-125 group-hover:border-blue-100 dark:group-hover:border-blue-900`}
                      ></span>
                      
                      {/* Hover tooltip */}
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-20 pointer-events-none">
                        {user.online ? 'Online' : `Last seen ${user.lastSeen}`}
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-solid border-transparent border-t-gray-900 dark:border-t-gray-700"></div>
                      </div>
                    </div>
                    
                    {/* User info and last message */}
                    <div className="flex-1 min-w-0 ml-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                          {user.name}
                        </h3>
                        <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0 ml-1">
                          {lastMessage ? formatMessageDate(lastMessage.timestamp) : ''}
                        </span>
                      </div>
                      <p className={`text-sm truncate ${
                        unreadCount > 0 
                          ? 'text-gray-900 dark:text-white font-medium' 
                          : 'text-gray-500 dark:text-gray-400'
                      }`}>
                        {lastMessage?.senderId === 'current' && (
                          <span className="inline-flex items-center mr-1">
                            {lastMessage.status === 'sent' && <span className="text-xs">✓</span>}
                            {lastMessage.status === 'delivered' && <span className="text-xs">✓✓</span>}
                            {lastMessage.status === 'read' && <span className="text-xs text-blue-500">✓✓</span>}
                          </span>
                        )}
                        {lastMessage?.text || 'Start a conversation'}
                      </p>
                    </div>
                    
                    {/* Unread badge */}
                    {unreadCount > 0 && (
                      <span className="flex items-center justify-center min-w-[20px] h-5 px-1 rounded-full bg-blue-500 text-white text-xs font-medium ml-2 flex-shrink-0">
                        {unreadCount}
                      </span>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ChatList;
