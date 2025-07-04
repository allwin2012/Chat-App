import { useEffect } from 'react';
import ChatList from '../components/ChatList';
import Navigation from '../components/Navigation';

const HomePage = () => {
  // Set document title
  useEffect(() => {
    document.title = 'MochaChat';
  }, []);
  
  return (
    <div className="flex flex-col h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <Navigation />
      <div className="flex-1 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent dark:from-blue-900/10 dark:to-transparent pointer-events-none" aria-hidden="true"></div>
        
        <div className="relative h-full">
          <ChatList />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
