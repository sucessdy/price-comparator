import { useState, useEffect } from "react";
import { useUser } from "../context/useUser";
import { sendAssistantMessage } from "../services/assistant.service";
import type { Message } from "../components/assistant/assistant.types";
import { createAssistantMessage } from "../utils/createAssistantMessage";

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

export function useAssistant() {
  const { user, updateUser } = useUser();
  const [input, setInput] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>(loadSavedMessages);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (messages.length === 0) {
      localStorage.removeItem("chatConversation");
      return;
    }
    localStorage.setItem("chatConversation", JSON.stringify(messages));
  }, [messages]);

  const handleSendMessage = async (text: string): Promise<void> => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now(),
      text: text.trim(),
      sender: "user",
      timestamp: new Date(),
      status: "sending",
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await sendAssistantMessage(text);
      const assistantResponse = createAssistantMessage(response);

      if (response.budget && !user.preferences.budget) {
        updateUser({
          preferences: { ...user.preferences, budget: response.budget },
        });
      }

      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          ...updated[updated.length - 1],
          status: "sent",
        };
        return [...updated, assistantResponse];
      });
    } catch (error) {
      console.error("Error:", error);
      const message =
        error instanceof Error
          ? error.message
          : "Sorry, I encountered an error. Please try again.";

      const errorMessage: Message = {
        id: Date.now() + 1,
        text: message,
        sender: "assistant",
        timestamp: new Date(),
      };

      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          ...updated[updated.length - 1],
          status: "error",
        };
        return [...updated, errorMessage];
      });
    } finally {
      setIsLoading(false);
    }
  };

  const clearConversation = () => {
    setMessages([]);
    localStorage.removeItem("chatConversation");
  };

  return {
    input,
    setInput,
    messages,
    isLoading,
    handleSendMessage,
    clearConversation,
  };
}
