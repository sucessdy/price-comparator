import React from 'react';
import MessageBubble from './MessageBubble';
import LoadingBubble from './LoadingBubble';
import { type Message } from './assistant.types';

interface ConversationProps {
  conversation: Message[];
  isLoading: boolean;
  onCompare : (productName: string)=> void 
  onAddToPlan : (productName : string) => void
}

const Conversation: React.FC<ConversationProps> = ({ conversation, isLoading , onCompare , onAddToPlan}) => {
  return ( 
    <div className="mb-6 space-y-4 min-h-[200px]">
      {conversation.map((message) => (
        <MessageBubble key={message.id} message={message} onCompare={onCompare} onAddToPlan={onAddToPlan}/>
      ))}
      {isLoading && <LoadingBubble />}
    </div>
  );
};

export default Conversation;