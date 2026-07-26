// src/components/assistant/ChatPage.tsx
import React, { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';
import LoadingBubble from './LoadingBubble';
import {type  Message } from './assistant.types';

interface ChatPageProps {
  messages: Message[];
  isLoading: boolean;
  onBack: () => void;
  onClear?: () => void;
}

const ChatPage: React.FC<ChatPageProps> = ({
  messages,
  isLoading,
  onBack,
  onClear
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div className="flex flex-col h-[calc(100vh-80px)]">
      <div className="glass sticky top-0 z-10 py-3 px-6 border-b border-[rgba(255,255,255,0.05)]">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-[rgba(255,255,255,0.6)] hover:text-white transition-colors group"
          >
            <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="font-medium">Smart Grocery</span>
          </button>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[rgba(108,99,255,0.2)] border border-[rgba(108,99,255,0.2)]">
              <div className="w-1.5 h-1.5 rounded-full bg-[#6C63FF] animate-pulse"></div>
              <span className="text-xs font-medium text-[#8B83FF]">Active</span>
            </div>
            {onClear && (
              <button
                onClick={onClear}
                className="p-1.5 text-[rgba(255,255,255,0.4)] hover:text-[rgba(255,255,255,0.8)] transition-colors rounded-full hover:bg-[rgba(255,255,255,0.05)]"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 scrollbar-thin">
        {messages.map((message, index) => (
          <MessageBubble
            key={message.id}
            message={message}
            isLast={index === messages.length - 1}
          />
        ))}
        {isLoading && <LoadingBubble />}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default ChatPage;