export interface  Message  {
  id: string | number;
 text: string;
  sender: "user" | "assistant";
  timestamp: Date;
}

export interface SuggestPrompt {
  _id?: number;
  icon: string;
  text: string;
  category?: string;
}
export interface ChatInputProps {
  input: string;
  setInput: (value : string) => void;
  onSend: () => void;
  loading: boolean;
 placeholder?: string;
}
export  interface SuggestedPromptsProps { 
_id : number;  
    onSelect : (prompt : string) =>void; 
    prompts ? : SuggestPrompt[] ;

 }
