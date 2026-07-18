// src/components/assistant/MessageBubble.tsx
import React from 'react';
import { type Message } from './assistant';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.sender === 'user';

  return (
    <div
      className={`p-4 rounded-lg ${
        isUser
          ? 'bg-blue-500 text-white ml-auto max-w-[80%]'
          : 'bg-gray-100 text-gray-800 max-w-[80%]'
      }`}
    >
      <div className="whitespace-pre-line">{message.text}</div>
      {message.timestamp && (
        <div className={`text-xs mt-1 ${isUser ? 'text-blue-100' : 'text-gray-400'}`}>
          {message.timestamp.toLocaleTimeString()}
        </div>
      )}
    </div>
  );
};

export default MessageBubble;