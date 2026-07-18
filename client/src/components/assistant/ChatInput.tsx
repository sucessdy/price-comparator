// src/components/assistant/ChatInput.tsx
import React, { useRef, useEffect } from 'react';
import { type ChatInputProps } from './assistant';;

const ChatInput: React.FC<ChatInputProps> = ({
  input,
  setInput,
  onSend,
  loading = false,
  placeholder = 'Type your message...'
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
    <div className="flex items-end gap-3 bg-white rounded-xl shadow-sm border border-gray-200 p-3">
      <div className="flex-1">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder={placeholder}
          disabled={loading}
          className="w-full resize-none border-0 focus:ring-0 p-2 text-gray-700 placeholder-gray-400 min-h-15 max-h-50 outline-none"
          rows={1}
        />
      </div>
      <button
        onClick={onSend}
        disabled={!input.trim() || loading}
        className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
      >
        {loading ? (
          <>
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Sending...
          </>
        ) : (
          'Send'
        )}
      </button>
    </div>
  );
};

export default ChatInput;