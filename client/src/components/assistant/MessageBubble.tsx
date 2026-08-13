

import React from 'react';
import { MESSAGE_TYPES, type Message  ,  type Recommendation } from './assistant.types';
import CompareCard from './cards/CompareCard';
import CartCard from './cards/CartCard';
import type { OptimizeCartResponse, ProductComparison } from '../../types/product';
import RecommendationCard from './cards/RecommendationCard';

interface MessageBubbleProps {
  message: Message;
  isLast?: boolean;
     isFirst?: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message}) => {
 
  const isUser = message.sender === 'user';
  const hasComparisonCard = !isUser &&
  message.type === MESSAGE_TYPES.COMPARISON &&
  message.data !== undefined;


  const hasCartCard =
  !isUser &&
  message.type === MESSAGE_TYPES.SHOPPING_PLAN &&
  message.data !== undefined;


const hasRecommendationCard =
  !isUser &&
  message.type === MESSAGE_TYPES.RECOMMENDATION &&
  message.data !== undefined;

const hasRichCard = hasComparisonCard || hasCartCard || hasRecommendationCard; 

const recommendations = message.data as Recommendation[]; 
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-fadeIn`}>
      <div className={`max-w-[85%] ${isUser ? 'items-end' : 'items-start'}`}>
        {!isUser && (
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-6 h-6 rounded-full bg-linear-to-br from-[#6C63FF] to-[#8B83FF] flex items-center justify-center text-xs text-white font-medium">
              AI
            </div>
            <span className="text-xs text-[rgba(255,255,255,0.4)] font-medium">
              Assistant
            </span>
          </div>
        )}
        <div
          className={`p-4 rounded-2xl ${
            isUser
              ? 'bg-linear-to-br from-[#6C63FF] to-[#8B83FF] text-white rounded-br-sm shadow-lg shadow-[#6C63FF]/20'
              : 'glass text-white rounded-bl-sm'
          }`}
        >
      
          {!hasRichCard && ( 
            <div className='whitespace-pre-line text-[15px] leading-relaxed'> {message.text}</div>
          )}

          {hasComparisonCard && ( 
  <CompareCard  comparison={message.data as ProductComparison} />
)}

{hasCartCard && (
  <CartCard result={message.data as OptimizeCartResponse} />
)}

 {hasRecommendationCard && recommendations.map((recommendation) => (
  <RecommendationCard   key={recommendation.id}
      recommendation={recommendation}/>
 ))}
        </div>
        {message.timestamp && ( 
       
             <div className={`text-xs text-[rgba(255,255,255,0.3)] mt-1 ${isUser ? 'text-right' : ''}`}>
           
             {message.timestamp.toLocaleTimeString().toString()} 
            {message.status === 'sending' && (
              <span className="ml-2 text-[#8B83FF]">● Sending...</span>
            )}
            {message.status === 'error' && (
              <span className="ml-2 text-[#FF6B9D]">⚠️ Failed</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble; 
