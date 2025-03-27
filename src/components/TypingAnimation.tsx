import React from 'react';

interface TypingAnimationProps {
  isDarkMode: boolean;
}

const TypingAnimation: React.FC<TypingAnimationProps> = ({ isDarkMode }) => {
  return (
    <div className="flex space-x-2 items-center p-2">
      <div className={`w-2 h-2 ${isDarkMode ? 'bg-gray-500' : 'bg-gray-400'} rounded-full animate-bounce [animation-delay:-0.3s]`}></div>
      <div className={`w-2 h-2 ${isDarkMode ? 'bg-gray-500' : 'bg-gray-400'} rounded-full animate-bounce [animation-delay:-0.15s]`}></div>
      <div className={`w-2 h-2 ${isDarkMode ? 'bg-gray-500' : 'bg-gray-400'} rounded-full animate-bounce`}></div>
    </div>
  );
};

export default TypingAnimation;