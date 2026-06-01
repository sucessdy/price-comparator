import {  ShoppingBag, TrendingUp } from "lucide-react";

type Props = {
  recentSearches: string[];
  onSelect: (product: string) => void;
};

export default function EmptyState({ recentSearches, onSelect }: Props) {
  const suggestions = ["iPhone 15", "MacBook Pro", "Sony Headphones", "Nike Shoes"];

  return (
    <div className="max-w-3xl mx-auto mt-16 px-4 text-center">
      <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-12">
        <div className="flex justify-center mb-6">
          <div className="bg-purple-500/20 rounded-full p-6">
            <ShoppingBag size={64} className="text-purple-400" />
          </div>
        </div>
        
        <h3 className="text-2xl font-semibold text-white mb-3">
          No products yet
        </h3>
        
        <p className="text-slate-400 mb-8">
          Search for a product above to compare prices across platforms
        </p>

        {recentSearches.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <TrendingUp size={18} className="text-purple-400" />
              <span className="text-sm text-slate-400">Recent Searches</span>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              {recentSearches.map((item) => (
                <button
                  key={item}
                  onClick={() => onSelect(item)}
                  className="px-4 py-2 bg-white/10 rounded-full text-sm hover:bg-purple-500/30 transition-all"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        )}

        <div>
          <p className="text-sm text-slate-500 mb-3">Try searching for:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => onSelect(suggestion)}
                className="px-3 py-1.5 bg-slate-800 rounded-lg text-xs text-slate-400 hover:bg-purple-600 hover:text-white transition-all"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}