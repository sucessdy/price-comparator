export interface Message {
  id?: string | number;
  text: string;
  sender: "user" | "assistant";
  timestamp?: Date;
  status?: "sending" | "sent" | "error";
  chips?: string[];
  type?: "text" | "shopping-plan" | "comparison" | "recommendation";
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
  setInput: (value: string) => void;
  onSend: () => void;
   isLoading: boolean;
  placeholder?: string;
  onVoiceInput?: () => void;
}
export interface SuggestedPromptsProps {
  _id: number;
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

