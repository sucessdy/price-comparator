// src/components/assistant/AssistantHero.tsx
import React, { useState } from "react";
import ChatInput from "./ChatInput";
import SuggestedPrompts from "./SuggestedPrompts";
import { useUser } from "../../context/useUser";
import { type Message } from "./assistant";

const AssistantHero: React.FC = () => {
  const { user } = useUser();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSend = async (): Promise<void> => {
    if (!input.trim() || isLoading) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now(),
      text: input,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate API call
    try {
      // Mock assistant response
      const mockResponse = await new Promise<string>((resolve) => {
        setTimeout(() => {
          const budget = user.preferences.budget || 800;
          const meal = input.toLowerCase().includes("dinner")
            ? "Dinner"
            : "General";
          resolve(
            `I understood:\nBudget: ₹${budget}\nMeal: ${meal}\nPriority: Best Value\n\nI'm finding the best shopping plan for you...`,
          );
        }, 800);
      });

      const assistantMessage: Message = {
        id: Date.now() + 1,
        text: mockResponse,
        sender: "assistant",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error getting assistant response:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          👋 Hi {user.name}
        </h1>
        <p className="text-xl text-gray-600">
          {user.preferences.budget
            ? `What do you need today? (Budget: ₹${user.preferences.budget})`
            : "What do you need today?"}
        </p>
      </div>

      {/* Chat Messages */}
      <div className="mb-6 space-y-4 min-h-50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`p-4 rounded-lg ${
              msg.sender === "user"
                ? "bg-blue-500 text-white ml-auto max-w-[80%]"
                : "bg-gray-100 text-gray-800 max-w-[80%]"
            }`}
          >
            <div className="whitespace-pre-line">{msg.text}</div>
            {msg.timestamp && (
              <div className="text-xs opacity-50 mt-1">
                {msg.timestamp.toLocaleTimeString()}
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="bg-gray-100 text-gray-800 p-4 rounded-lg max-w-[80%]">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <ChatInput
        input={input}
        setInput={setInput}
        onSend={handleSend}
        loading={isLoading}
        placeholder={`I need groceries for dinner under ₹${user.preferences.budget || 800}...`}
      />

      {/* Suggested Prompts */}
      {messages.length === 0 && (
        <SuggestedPrompts _id={0} onSelect={setInput} />
      )}
    </div>
  );
};

export default AssistantHero;
