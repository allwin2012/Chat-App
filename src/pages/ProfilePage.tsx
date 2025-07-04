import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Navigation from '../components/Navigation';
import { LogOut, Pencil, Trash2 } from 'lucide-react';

const ProfilePage = () => {
  const { currentUser, updateUserProfile, resetChatHistory } = useApp();
  const navigate = useNavigate();
  
  const [name, setName] = useState(currentUser.name);
  const [status, setStatus] = useState(currentUser.status);
  const [online, setOnline] = useState(currentUser.online);
  const [isEditing, setIsEditing] = useState(false);
  
  // Set document title
  useEffect(() => {
    document.title = 'Your Profile | Chat';
  }, []);
  
  const handleSaveProfile = () => {
    updateUserProfile({
      ...currentUser,
      name,
      status,
      online
    });
    
    setIsEditing(false);
  };
  
  const handleResetChatHistory = () => {
    if (window.confirm('Are you sure you want to reset all chat history? This cannot be undone.')) {
      resetChatHistory();
      navigate('/');
    }
  };
  
  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      // In a real app, this would clear authentication state
      alert('In a real app, this would log you out!');
    }
  };
  
  return (
    <div className="flex flex-col h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <Navigation />
      
      <div className="flex-1 overflow-auto p-4">
        <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="relative h-32 bg-gradient-to-r from-blue-500 to-teal-400">
            <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
              <div className="relative">
                <img 
                  src={currentUser.avatar} 
                  alt={currentUser.name}
                  className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 object-cover"
                />
                {!isEditing && (
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="absolute bottom-0 right-0 p-2 bg-blue-500 rounded-full text-white hover:bg-blue-600 shadow-md"
                  >
                    <Pencil size={16} />
                  </button>
                )}
              </div>
            </div>
          </div>
          
          <div className="pt-16 px-6 pb-6">
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-600 dark:text-gray-300">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-600 dark:text-gray-300">
                    Status
                  </label>
                  <input
                    type="text"
                    id="status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="What's on your mind?"
                  />
                </div>
                
                <div className="flex items-center">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={online}
                      onChange={(e) => setOnline(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    <span className="ml-3 text-sm font-medium text-gray-600 dark:text-gray-300">
                      Show as online
                    </span>
                  </label>
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    onClick={() => {
                      setName(currentUser.name);
                      setStatus(currentUser.status);
                      setOnline(currentUser.online);
                      setIsEditing(false);
                    }}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveProfile}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <h1 className="text-xl font-bold mt-2">{currentUser.name}</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">{currentUser.status}</p>
                <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                  {online ? 'Online' : 'Offline'}
                </p>
                
                <div className="mt-8 border-t dark:border-gray-700 pt-6 flex flex-col space-y-3">
                  <button
                    onClick={handleResetChatHistory}
                    className="flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md text-sm font-medium text-red-600 dark:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <Trash2 size={16} className="mr-2" />
                    Reset Chat History
                  </button>
                  
                  <button
                    onClick={handleLogout}
                    className="flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <LogOut size={16} className="mr-2" />
                    Log Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
