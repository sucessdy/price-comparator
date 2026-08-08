export interface Message {
  id?: string | number;
  text: string;
  sender: "user" | "assistant";
  timestamp?: Date;
  status?: "sending" | "sent" | "error";
  chips?: string[];
   intent?: IntentType;
 type?: MessageType;


  data?: unknown; 
context?: Record<string, unknown>; 
}

export interface SuggestPrompt {
  _id?: number;
  icon: string;
  text: string;
  description?: string;
  category?: string;
}
export interface ChatInputProps {
  input: string;
  onInputChange: (value: string) => void;
  onSend: () => void;
  isLoading: boolean;
  placeholder?: string;
  onVoiceInput?: () => void;
}

export interface SuggestedPromptsProps {
  // _id: number;
  onSelect: (prompt: string) => void;
  prompts?: SuggestPrompt[];
}


export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
  budget?: number;
}
// types/assistant.ts

export const INTENT_TYPES = {
  COMPARE: "COMPARE",
  OPTIMIZE_CART: "OPTIMIZE_CART",
  SHOPPING_NEED: "SHOPPING_NEED",
  GENERAL: "GENERAL",
} as const;

export type IntentType = typeof INTENT_TYPES[keyof typeof INTENT_TYPES];



export const MESSAGE_TYPES = {
  TEXT: "text",
  COMPARISON: "comparison",
  SHOPPING_PLAN: "shopping-plan",
  RECOMMENDATION: "recommendation",
} as const;

export type MessageType =
  typeof MESSAGE_TYPES[keyof typeof MESSAGE_TYPES];