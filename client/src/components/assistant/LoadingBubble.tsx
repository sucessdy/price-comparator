import React from 'react';

const LoadingBubble: React.FC = () => {
  return (
    <div className="flex justify-start animate-fadeIn">
      <div className="bg-white border border-gray-200 p-4 rounded-2xl rounded-bl-sm shadow-sm max-w-[80%]">
        <div className="flex items-center space-x-1">
          <div className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
          <div className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
          <div className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingBubble;