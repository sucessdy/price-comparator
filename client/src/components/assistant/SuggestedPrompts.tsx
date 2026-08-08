import React, { useState } from 'react';
import { type SuggestedPromptsProps, type SuggestPrompt } from './assistant.types';

const defaultPrompts: SuggestPrompt[] = [
  { 
    icon: '🍝', 
    text: 'Plan dinner under ₹800',
    description: 'Budget-friendly dinner ideas',
    category: 'meal'
  },
  { 
    icon: '🥗', 
    text: 'Healthy groceries for a week',
    description: 'Nutritious weekly shopping',
    category: 'health'
  },
  { 
    icon: '🛒', 
    text: 'Weekly grocery shopping',
    description: 'Complete weekly list',
    category: 'shopping'
  },
  { 
    icon: '💪', 
    text: 'High-protein foods',
    description: 'Protein-rich groceries',
    category: 'diet'
  },
  { 
    icon: '👶', 
    text: 'Baby essentials',
    description: 'Baby care products',
    category: 'family'
  },
];

const SuggestedPrompts: React.FC<SuggestedPromptsProps> = ({
  onSelect,
  prompts = defaultPrompts
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="mt-8">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
          Suggested Prompts
        </h3>
        <div className="flex-1 h-px bg-gray-200"></div>
        <span className="text-xs text-gray-400">Click to start</span>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {prompts.map((prompt, index) => (
          <button
            key={index}
            onClick={() => onSelect(prompt.text)}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            className={`group relative p-4 bg-white rounded-xl border border-gray-200 hover:border-blue-300 transition-all duration-300 text-left ${
              hoveredIndex === index ? 'shadow-lg transform -translate-y-1' : 'shadow-sm hover:shadow-md'
            }`}
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl flex-shrink-0">{prompt.icon}</span>
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-800 group-hover:text-blue-600 transition-colors">
                  {prompt.text}
                </div>
                {prompt.description && (
                  <div className="text-xs text-gray-400 mt-1">
                    {prompt.description}
                  </div>
                )}
              </div>
              <svg 
                className={`w-4 h-4 text-gray-300 transition-all duration-300 ${
                  hoveredIndex === index ? 'text-blue-500 transform translate-x-1' : ''
                }`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SuggestedPrompts;