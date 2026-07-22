

import React from 'react';
import { type Message } from './assistant';



interface MessageBubbleProps {
  message: Message;
  isLast?: boolean;
     isFirst?: boolean;

}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message}) => {
 
  const isUser = message.sender === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-fadeIn`}>
      <div className={`max-w-[85%] ${isUser ? 'items-end' : 'items-start'}`}>
        {!isUser && (
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#6C63FF] to-[#8B83FF] flex items-center justify-center text-xs text-white font-medium">
              AI
            </div>
            <span className="text-xs text-[rgba(255,255,255,0.4)] font-medium">
              Assistant
            </span>
          </div>
        )}

        <div
          className={`p-4 rounded-2xl ${
            isUser
              ? 'bg-gradient-to-br from-[#6C63FF] to-[#8B83FF] text-white rounded-br-sm shadow-lg shadow-[#6C63FF]/20'
              : 'glass text-white rounded-bl-sm'
          }`}
        >
          <div className="whitespace-pre-line text-[15px] leading-relaxed">
            {message.text}
          </div>

   
          {message.chips && message.chips.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {message.chips.map((chip, index) => (
                <span
                  key={index}
                  className={`px-3 py-1 text-xs font-medium rounded-full ${
                    isUser
                      ? 'bg-[rgba(255,255,255,0.2)] text-white'
                      : 'bg-[rgba(108,99,255,0.15)] text-[#8B83FF] border border-[rgba(108,99,255,0.2)]'
                  }`}
                >
                  {chip}
                </span>
              ))}
            </div>
          )}
        </div>


       
        {message.timestamp && (
       
             <div className={`text-xs text-[rgba(255,255,255,0.3)] mt-1 ${isUser ? 'text-right' : ''}`}>
           
             {message.timestamp.toString()}
            {message.status === 'sending' && (
              <span className="ml-2 text-[#8B83FF]">● Sending...</span>
            )}
            {message.status === 'error' && (
              <span className="ml-2 text-[#FF6B9D]">⚠️ Failed</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble; 