import { Link, useLocation, useNavigate } from 'react-router-dom';
import { House, Moon, Sun, User } from 'lucide-react';
import { useApp } from '../context/AppContext';

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, isDarkMode, toggleDarkMode } = useApp();
  
  const isInChatScreen = location.pathname.startsWith('/chat/');
  const isInCallScreen = location.pathname.startsWith('/call/');
  
  // Don't show non-essential UI in call screens
  if (isInCallScreen) {
    return null;
  }
  
  const handleNavigation = (path: string) => {
    navigate(path);
  };
  
  return (
    <div className="sticky top-0 z-20 flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-900 border-b dark:border-gray-700 shadow-sm">
      <Link 
        to="/" 
        className="text-xl font-bold text-blue-500 bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent hover:from-blue-600 hover:to-blue-700 transition-all duration-300"
      >
        Chatoo
      </Link>
      
      <div className="flex items-center space-x-1 md:space-x-2">
        {!isInChatScreen && (
          <button 
            onClick={() => handleNavigation('/')}
            className={`p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              location.pathname === '/' 
                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
                : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300'
            }`}
            aria-label="Home"
          >
            <House size={20} />
          </button>
        )}
        
        {!isInChatScreen && (
          <button 
            onClick={() => handleNavigation('/profile')}
            className={`p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              location.pathname === '/profile' 
                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
                : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300'
            }`}
            aria-label="Profile"
          >
            <User size={20} />
          </button>
        )}
        
        <button 
          onClick={toggleDarkMode}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        
        {!isInChatScreen && (
          <div className="relative group ml-1">
            <div 
              onClick={() => handleNavigation('/profile')}
              className="cursor-pointer overflow-hidden rounded-full transition-all duration-200 group-hover:scale-110 group-hover:ring-2 group-hover:ring-blue-500"
            >
              <img 
                src={currentUser.avatar} 
                alt={currentUser.name}
                className="w-8 h-8 rounded-full object-cover border-2 border-transparent group-hover:border-blue-100 dark:group-hover:border-blue-900"
              />
            </div>
            
            <span className={`absolute bottom-0 right-0 w-2 h-2 ${
              currentUser.online ? 'bg-green-500' : 'bg-gray-400'
            } rounded-full border-2 border-white dark:border-gray-900 transition-all duration-200 group-hover:scale-125 group-hover:border-blue-100 dark:group-hover:border-blue-900`}></span>
            
            {/* Hover tooltip */}
            <div className="absolute bottom-full right-0 mb-2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-20 pointer-events-none">
              {currentUser.name}
              <div className="absolute top-full right-2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-solid border-transparent border-t-gray-900 dark:border-t-gray-700"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navigation;
