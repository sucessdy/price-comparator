import React, { useState } from 'react';
import { type SuggestPrompt  } from './assistant';

interface LandingPageProps {
  onSend: (message: string) => void;
  setInput: (value: string) => void;
  input: string;
  isLoading: boolean;
}

const quickPrompts: SuggestPrompt[] = [
  { 
    icon: '🍝', 
    text: 'Compare milk',
    description: 'See store prices',
  },
  { 
    icon: '🥬', 
    text: 'milk, bread, eggs',
    description: 'Optimize a cart',
  },
  { 
    icon: '🥛', 
    text: '2 milk, bread',
    description: 'Include quantities',
  },
  { 
    icon: '💪', 
  text: 'Compare bread',
    description: 'Find the best price',
  },
  { 
    icon: '👶', 
    text: 'milk and eggs',
    description: 'Plan two products',
  },
  { 
    icon: '🎉', 
  text: 'Compare eggs',
    description: 'View live prices',}
];

const LandingPage: React.FC<LandingPageProps> = ({
  onSend,
  setInput,
  input,
  isLoading
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const handlePromptClick = (prompt: string) => {
    setInput(prompt);
    setTimeout(() => onSend(prompt), 100);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 animate-fadeIn">
      <div className="text-center mb-12">
        <div className="relative inline-block">
          <div className="absolute inset-0 blur-3xl `bg-linear-to-r from-[#6C63FF] to-[#FF6B9D] opacity-20  *:animate-pulse-glow"></div>
          <div className="relative text-7xl mb-6 animate-float">🛒</div>
        </div>
        <h1 className="text-6xl font-bold mb-3 tracking-tight">
          <span className="gradient-text">Smart Grocery</span>
        </h1>
        <p className="text-xl text-[rgba(255,255,255,0.6)] max-w-md mx-auto font-light">
          Your AI shopping assistant
        </p>
      </div>

      <div className="w-full max-w-2xl glass rounded-3xl p-6 glow">
        <div className="relative">
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-2xl text-[rgba(255,255,255,0.4)]">
            ✨
          </div>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onSend(input)}
            placeholder="What do you need today?"
            className="w-full pl-14 pr-20 py-4 text-lg bg-transparent border-0 outline-none text-white placeholder-[rgba(255,255,255,0.4)]"
            disabled={isLoading}
          />
          <button
            onClick={() => onSend(input)}
            disabled={!input.trim() || isLoading}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 px-5 py-2.5 bg-gradient-to-r from-[#6C63FF] to-[#8B83FF] text-white rounded-xl font-medium hover:shadow-lg hover:shadow-[#6C63FF]/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : (
              'Ask AI'
            )}
          </button>
        </div>
      </div>

      <div className="mt-10 w-full max-w-3xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[rgba(255,255,255,0.1)]"></div>
          <span className="text-xs font-medium uppercase tracking-wider text-[rgba(255,255,255,0.3)]">
            Quick Actions
          </span>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[rgba(255,255,255,0.1)]"></div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {quickPrompts.map((prompt, index) => (
            <button
              key={index}
              onClick={() => handlePromptClick(prompt.text)}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={`glass glass-hover rounded-2xl p-4 text-left transition-all duration-300 ${
                hoveredIndex === index ? 'glow' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{prompt.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-white truncate">
                    {prompt.text}
                  </div>
                  <div className="text-xs text-[rgba(255,255,255,0.4)] truncate">
                    {prompt.description}
                  </div>
                </div>
              
          
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LandingPage;