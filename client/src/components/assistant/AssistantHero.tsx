import React, { useEffect, useState } from 'react';
import LandingPage from './LandingPage';
import ChatPage from './ChatPage';
import ChatInput from './ChatInput';
import { useUser } from '../../context/useUser';
import { sendMessage } from '../../services/assistant.service';
import { type  Message } from './assistant';

const loadSavedMessages = (): Message[] => {
  try {
    const saved = localStorage.getItem("chatConversation");
    const parsed: unknown = saved ? JSON.parse(saved) : [];

    if (!Array.isArray(parsed)) return [];

    return parsed.map((message) => ({
      ...message,
      timestamp: message.timestamp ? new Date(message.timestamp) : undefined,
      status: message.status === "sending" ? "error" : message.status,
    }));
  } catch {
    return [];
  }
};

const AssistantHero: React.FC = () => {
  const { user, updateUser } = useUser();
  const [input, setInput] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>(loadSavedMessages);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isChatActive, setIsChatActive] = useState<boolean>(() => loadSavedMessages().length > 0);

  useEffect(() => {
    if (messages.length === 0) {
      localStorage.removeItem("chatConversation");
      return;
    }

    localStorage.setItem("chatConversation", JSON.stringify(messages));
  }, [messages]);

  const handleSend = async (text: string): Promise<void> => {
    if (!text.trim() || isLoading) return;

    if (!isChatActive) {
      setIsChatActive(true);
    }

    const userMessage: Message = {
      id: Date.now(),
      text: text.trim(),
      sender: 'user',
      timestamp: new Date(),
      status: 'sending'
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await sendMessage(text);

      const chips: string[] = [];
      if (response.budget) chips.push(`₹${response.budget}`);
      if (response.priority) chips.push(response.priority);
      if (response.intent) chips.push(response.intent);

      const assistantMessage: Message = {
        id: Date.now() + 1,
        text: response.message,
        sender: 'assistant',
        timestamp: new Date(),
      
        chips: chips.length > 0 ? chips : undefined
      };
      if (response.budget && !user.preferences.budget) {
        updateUser({
          preferences: { ...user.preferences, budget: response.budget }
        });
      }

      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = { ...updated[updated.length - 1], status: 'sent' };
        return [...updated, assistantMessage];
      });
    } catch (error) {
      console.error('Error:', error);
      const message = error instanceof Error
        ? error.message
        : 'Sorry, I encountered an error. Please try again.';
      
      const errorMessage: Message = {
        id: Date.now() + 1,
        text: message,
        sender: 'assistant',
        timestamp: new Date()
      };

      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = { ...updated[updated.length - 1], status: 'error' };
        return [...updated, errorMessage];
      });
    } finally {
      setIsLoading(false);
    }
  };                   

  const handleBack = () => {
    setIsChatActive(false);
    setMessages([]);
    localStorage.removeItem('chatConversation');
  };

  const handleClear = () => {
    setMessages([]);
    localStorage.removeItem('chatConversation');
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#0A0A0F] relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#6C63FF] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse-glow"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#FF6B9D] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse-glow" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-gradient-to-r from-[#6C63FF] to-[#FF6B9D] rounded-full mix-blend-multiply filter blur-3xl opacity-5"></div>
      </div>

      <div className="relative z-10">
        {!isChatActive ? (
          <LandingPage
            onSend={handleSend}
            setInput={setInput}
            input={input}
            isLoading={isLoading}
          />
        ) : (
          <>
            <ChatPage
              messages={messages}
              isLoading={isLoading}
              onBack={handleBack}
              onClear={handleClear}
            />
            <ChatInput
              input={input}
              setInput={setInput}
              onSend={() => handleSend(input)}
              isLoading={isLoading}
              placeholder="Ask about groceries..."
            />
          </>
        )}
      </div>
    </div>
  );
};

export default AssistantHero;
