import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { getUserById, getChatByUserId } from '../data/mockData';
import Navigation from '../components/Navigation';
import ChatHeader from '../components/ChatHeader';
import ChatMessages from '../components/ChatMessages';
import MessageInput from '../components/MessageInput';
import TypingIndicator from '../components/TypingIndicator';
import { ArrowUp } from 'lucide-react';

const ChatPage = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { chats, addMessage, markChatAsRead, isTyping } = useApp();
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  
  // If userId is not provided, redirect to home
  useEffect(() => {
    if (!userId) {
      navigate('/', { replace: true });
    }
  }, [userId, navigate]);
  
  // Get user and chat data
  const user = userId ? getUserById(userId) : null;
  const chat = userId ? getChatByUserId(userId, chats) : null;
  
  // If user doesn't exist, redirect to home
  useEffect(() => {
    if (userId && !user) {
      // User not found, redirect to home
      navigate('/', { replace: true });
    }
  }, [user, userId, navigate]);
  
  // Set document title
  useEffect(() => {
    document.title = user ? `Chat with ${user.name} | MochaChat` : 'MochaChat';
    
    // Cleanup when leaving page
    return () => {
      document.title = 'MochaChat';
    };
  }, [user]);
  
  // Mark messages as read when opening the chat
  useEffect(() => {
    if (chat) {
      markChatAsRead(chat.id);
    }
  }, [chat?.id, markChatAsRead]);
  
  // Handle scroll to detect when to show the scroll-to-top button
  useEffect(() => {
    const handleScroll = () => {
      if (messagesContainerRef.current) {
        const { scrollTop } = messagesContainerRef.current;
        setShowScrollToTop(scrollTop > 300);
      }
    };
    
    const messagesContainer = messagesContainerRef.current;
    if (messagesContainer) {
      messagesContainer.addEventListener('scroll', handleScroll);
      
      return () => {
        messagesContainer.removeEventListener('scroll', handleScroll);
      };
    }
  }, [messagesContainerRef]);
  
  // Scroll to top handler
  const scrollToTop = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };
  
  if (!user || !chat) return null;
  
  // Handle sending a new message
  const handleSendMessage = (text: string) => {
    const newMessage = {
      id: `msg-${chat.id}-${Date.now()}`,
      senderId: 'current',
      receiverId: userId,
      text,
      timestamp: new Date().toISOString(),
      status: 'sent' as const,
      isRead: false
    };
    
    addMessage(chat.id, newMessage);
    
    // Simulate reply after a delay
    if (Math.random() > 0.3) { // 70% chance of reply
      const delay = 1000 + Math.random() * 3000; // 1-4 seconds delay
      
      setTimeout(() => {
        const replyOptions = [
          "Got it, thanks!",
          "I'll get back to you on this.",
          "Thanks for letting me know.",
          "Sounds good!",
          "👍",
          "That works for me.",
          "I'm not sure about that...",
          "Can we discuss this later?",
          "Interesting point!",
          "Let me think about it."
        ];
        
        const replyText = replyOptions[Math.floor(Math.random() * replyOptions.length)];
        
        const replyMessage = {
          id: `msg-${chat.id}-${Date.now()}`,
          senderId: userId,
          receiverId: 'current',
          text: replyText,
          timestamp: new Date().toISOString(),
          status: 'sent' as const,
          isRead: true
        };
        
        addMessage(chat.id, replyMessage);
      }, delay);
    }
  };
  
  return (
    <div className="flex flex-col h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <Navigation />
      <ChatHeader userId={userId} isTyping={isTyping[userId] || false} />
      
      <div className="flex-1 overflow-hidden flex flex-col relative">
        <div ref={messagesContainerRef} className="flex-1 overflow-y-auto">
          <ChatMessages messages={chat.messages} />
          {isTyping[userId] && <TypingIndicator />}
        </div>
        
        {/* Scroll to top button */}
        {showScrollToTop && (
          <button
            onClick={scrollToTop}
            className="absolute bottom-20 right-4 p-3 rounded-full bg-blue-500 hover:bg-blue-600 text-white shadow-lg transition-all duration-300 animate-fade-in focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 z-10"
            aria-label="Scroll to top"
          >
            <ArrowUp size={18} />
          </button>
        )}
        
        <MessageInput 
          chatId={chat.id} 
          recipientId={userId}
          onSendMessage={handleSendMessage} 
        />
      </div>
    </div>
  );
};

export default ChatPage;
