import { useState, useEffect } from "react";
import { useUser } from "../context/useUser";
import { sendAssistantMessage } from "../services/assistant.service";

import { compareProduct } from "../api/productApi";

import {
  INTENT_TYPES,
  type Message,
} from "../components/assistant/assistant.types";
import {
  createAssistantMessage,
  type AssistantResponse,
} from "../utils/createAssistantMessage";
import type { CartItem } from "../types/product";

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
  const [shoppingPlan, setShoppingPlan] = useState<CartItem[]>([]);

  const handleCompare = async (productName: string): Promise<void> => {
    const name = productName.trim();
    if (!name || isLoading) return;
    setIsLoading(true);

    try {
      const response = await compareProduct(productName);

      const assistantResponse: AssistantResponse = {
        message: `Here are the price comparisons for ${name}.`,
        priority: "lowest-price",
        intent: INTENT_TYPES.COMPARE,
        data: response.data,
      };
      const assistantMessage = createAssistantMessage(assistantResponse);
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to compare this product. Please try again";
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          text: message,
          sender: "assistant",
          timestamp: new Date(),
          status: "error",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };
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
    
  // const handleAddToPlan = (productName: string): void => {
  //   const name = productName.trim().toLowerCase()  ;
  //   if (!name) return ;
  //   setShoppingPlan((prev) => { 
  //     const existingProduct = prev.find((item)=> item.name === name) ;
  //     if (existingProduct) {
  //       return prev.map((item)=> 
  //       item.name === name ? {...item, quantity : item.quantity + 1} : item
  //       )
  //     }
  //     return [...prev, {name , quantity: 1}] ; 
  //   })
  // };

  const handleAddToPlan = (productName: string): void => {
  const name = productName.trim().toLowerCase();

  if (!name) return;

  setShoppingPlan((previous) => {
    const existingProduct = previous.find((item) => item.name === name);

    if (existingProduct) {
      return previous.map((item) =>
        item.name === name
          ? { ...item, quantity: item.quantity + 1 }
          : item,
      );
    }

    return [...previous, { name, quantity: 1 }];
  });

  setMessages((previous) => [
    ...previous,
    {
      id: Date.now(),
      text: `Added ${name} to your shopping plan.`,
      sender: "assistant",
      timestamp: new Date(),
      status: "sent",
    },
  ]);
}; 
  return {
   input,
  setInput,
  messages,
  isLoading,
  shoppingPlan,
  handleSendMessage,
  handleCompare,
  handleAddToPlan,
  clearConversation,
  };
}
