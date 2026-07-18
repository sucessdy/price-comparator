// src/components/assistant/SuggestedPrompts.tsx
import React from 'react';
import { type SuggestedPromptsProps,type SuggestPrompt } from './assistant';
const defaultPrompts: SuggestPrompt[] = [
  { _id : 1 ,  icon: '🍝', text: 'Plan dinner under ₹800' },
  {  _id : 2 ,  icon: '🥗', text: 'Healthy groceries for a week' },
  {  _id : 3  ,icon: '🛒', text: 'Weekly grocery shopping' },
  {  _id : 4 ,icon: '💪', text: 'High-protein foods' },
  {  _id : 5  , icon: '👶', text: 'Baby essentials' },
];

const SuggestedPrompts: React.FC<SuggestedPromptsProps> = ({
  onSelect,
  prompts = defaultPrompts
}) => {
  return (
    <div className="mt-8">
      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">
        Suggested Prompts
      </h3>
      <div className="flex flex-wrap gap-3">
        {prompts.map((prompt) => (
          <button
            key={prompt._id}
            onClick={() => onSelect(prompt.text)}
            className="px-4 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-full text-sm text-gray-700 transition-colors flex items-center gap-2 hover:shadow-sm"
          >
            <span>{prompt.icon}</span>
            {prompt.text}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SuggestedPrompts;