import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Chat, Message, initialChats, currentUser, users} from '../data/mockData';

interface AppContextType {
  chats: Chat[];
  setChats: (chats: Chat[]) => void;
  currentUser: User;
  setCurrentUser: (user: User) => void;
  users: User[];
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  addMessage: (chatId: string, message: Message) => void;
  markChatAsRead: (chatId: string) => void;
  isTyping: { [key: string]: boolean };
  setIsTyping: (userId: string, typing: boolean) => void;
  updateUserProfile: (user: User) => void;
  resetChatHistory: () => void;
  errorMessage: string | null;
  setErrorMessage: (message: string | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  // Load data from localStorage or use initial data
  const [chats, setChats] = useState<Chat[]>(() => {
    const savedChats = localStorage.getItem('chats');
    return savedChats ? JSON.parse(savedChats) : initialChats;
  });
  
  const [currentUserState, setCurrentUserState] = useState<User>(() => {
    const savedUser = localStorage.getItem('currentUser');
    return savedUser ? JSON.parse(savedUser) : currentUser;
  });
  
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : false;
  });
  
  const [isTyping, setIsTypingState] = useState<{ [key: string]: boolean }>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Save data to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('chats', JSON.stringify(chats));
  }, [chats]);
  
  useEffect(() => {
    localStorage.setItem('currentUser', JSON.stringify(currentUserState));
  }, [currentUserState]);
  
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    
    // Apply dark mode to the document
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  // Add a new message to a chat
  const addMessage = (chatId: string, message: Message) => {
    setChats(prevChats => {
      return prevChats.map(chat => {
        if (chat.id === chatId) {
          // Check if message already exists to prevent duplicates
          const messageExists = chat.messages.some(msg => msg.id === message.id);
          if (messageExists) {
            return chat;
          }
          
          const updatedMessages = [...chat.messages, message];
          return {
            ...chat,
            messages: updatedMessages,
            lastMessage: message
          };
        }
        return chat;
      });
    });
  };

  // Mark all messages in a chat as read
  const markChatAsRead = (chatId: string) => {
    setChats(prevChats => {
      // Find the chat
      const chat = prevChats.find(c => c.id === chatId);
      
      // If chat not found or no unread messages, return unchanged state
      if (!chat) return prevChats;
      
      // Check if there are any unread messages
      const hasUnreadMessages = chat.messages.some(msg => 
        msg.senderId !== 'current' && !msg.isRead
      );
      
      // If no unread messages, skip the update to prevent unnecessary re-renders
      if (!hasUnreadMessages) return prevChats;
      
      // Otherwise proceed with the update
      return prevChats.map(chat => {
        if (chat.id === chatId) {
          const updatedMessages = chat.messages.map(msg => ({
            ...msg,
            isRead: true,
            status: msg.senderId === 'current' ? 'read' as const : msg.status
          }));
          
          return {
            ...chat,
            messages: updatedMessages,
            lastMessage: updatedMessages.length > 0 ? updatedMessages[updatedMessages.length - 1] : chat.lastMessage
          };
        }
        return chat;
      });
    });
  };

  // Set typing status for a user
  const setIsTyping = (userId: string, typing: boolean) => {
    // Only update if the value is actually changing to prevent unnecessary re-renders
    setIsTypingState(prev => {
      // If value is the same, don't trigger a re-render
      if (prev[userId] === typing) {
        return prev;
      }
      // Otherwise update with the new value
      return {
        ...prev,
        [userId]: typing
      };
    });
  };

  // Update user profile
  const updateUserProfile = (user: User) => {
    setCurrentUserState(user);
  };

  // Reset chat history
  const resetChatHistory = () => {
    setChats(initialChats);
  };

  return (
    <AppContext.Provider
      value={{
        chats,
        setChats,
        currentUser: currentUserState,
        setCurrentUser: setCurrentUserState,
        users,
        isDarkMode,
        toggleDarkMode,
        addMessage,
        markChatAsRead,
        isTyping,
        setIsTyping,
        updateUserProfile,
        resetChatHistory,
        errorMessage,
        setErrorMessage
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the context
export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
