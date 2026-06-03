import { Search, Loader2 } from "lucide-react";

type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
  loading?: boolean;
};

export default function SearchBar({ value, onChange, onSearch, loading }: SearchBarProps) {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !loading && value.trim()) {
      onSearch();
    }
  };

  return (
    <div className="flex justify-center gap-4 px-4 max-w-4xl mx-auto">
      <div className="relative flex-1">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Search for a product... (e.g., iPhone 15, MacBook Pro)"
          className="w-full rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md pl-12 pr-5 py-4 text-white placeholder:text-slate-400 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
          autoFocus
        />
      </div>
      
      <button
        onClick={onSearch}
        disabled={loading || !value.trim()}
        className="rounded-2xl bg-linear-to-r from-purple-600 to-pink-600 px-8 py-4 text-white font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100 flex items-center gap-2"
      >
        {loading ? <Loader2 className="animate-spin" size={20} /> : <Search size={20} />}
        {loading ? "Searching..." : "Search"}
      </button>
    </div>
  );
}