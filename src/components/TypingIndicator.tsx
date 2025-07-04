const TypingIndicator = () => {
  return (
    <div className="flex justify-start mb-4 animate-fade-in">
      <div className="max-w-[70%] px-4 py-3 rounded-2xl shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-tl-none">
        <div className="flex space-x-2 items-center">
          <div 
            className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500" 
            style={{ animation: 'typingBounce 0.6s infinite', animationDelay: '0ms' }}
          ></div>
          <div 
            className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500" 
            style={{ animation: 'typingBounce 0.6s infinite', animationDelay: '150ms' }}
          ></div>
          <div 
            className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500" 
            style={{ animation: 'typingBounce 0.6s infinite', animationDelay: '300ms' }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
