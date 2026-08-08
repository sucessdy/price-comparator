// src/components/assistant/ChatInput.tsx
import React, { useRef, useEffect } from 'react';
import { type ChatInputProps } from './assistant.types';;

const ChatInput: React.FC<ChatInputProps> = ({
  input,
  onInputChange,
  onSend,
  isLoading = false,
  placeholder = 'Type your message...'
  , 
  onVoiceInput, 
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [input]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>): void => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
   <div className="glass border-t border-[rgba(255,255,255,0.05)] px-4 py-3  rounded-2xl shadow-lg border border-gray-200 p-3 transition-all focus-within:ring-2 focus-within:ring-blue-400">
      <div className=" max-w-4xl mx-auto gap-3">
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) =>  onInputChange(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder={placeholder}
            disabled={isLoading}
            className="w-full resize-none border-0 focus:ring-0 p-2 text-gray-100 placeholder-gray-400 min-h-15 max-h-30 outline-none text-[15px]"
            rows={1}
          />
        </div>
        
        <div className="flex items-center gap-2">
          {onVoiceInput && (
            <button
              onClick={onVoiceInput}
              className="p-2.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-full transition-colors"
              title="Voice input"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </button>
          )}

          <button
            onClick={onSend}
            disabled={!input.trim() ||   isLoading}
            className="px-6 py-2.5 bg-linear-to-r from-blue-500 to-blue-600 text-white font-medium rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-md hover:shadow-lg"
          >

    
            {  isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Sending</span>
              </>
            ) : (
              <>
                <span>Send</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </>
            )}
          </button>
        </div>
      </div>
    </div>

  );
};

export default ChatInput;