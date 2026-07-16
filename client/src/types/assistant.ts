export interface Message {
  id: string | number;
 text: string;
  sender: "user" | "assistant";
  timestamp: Date;
}

export interface suggestPrompt {
  icon: string;
  text: string;
  category: string;
}
export interface ChatInputProps {
  input: string;
  setInput: (value : string) => void;
  onSend: () => void;
  loading: boolean;
 placeholder?: string;
}
export  interface SuggestedPromptsProps { 

    onSelect : (prompt : string) =>void; 
    prompts ? : suggestPrompt[] ;

 }
