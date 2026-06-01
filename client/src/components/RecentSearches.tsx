import { Clock } from "lucide-react";
import { useState } from "react";

type Props = {
  onSelect: (product: string) => void;
};

export default function RecentSearches({
  onSelect,
}: Props) {
  const [recent] = useState<string[]>(() => {
    try {
      const saved =
        localStorage.getItem(
          "recentSearches"
        );

      if (!saved) return [];

      const parsed =
        JSON.parse(saved);

      return Array.isArray(parsed)
        ? parsed
        : [];
    } catch {
      return [];
    }
  });

  if (recent.length === 0)
    return null;

  return (
    <div className="max-w-3xl mx-auto mt-12">
      <div className="flex items-center gap-2 mb-6">
        <Clock
          size={20}
          className="text-purple-400"
        />

        <h3 className="text-slate-300 font-semibold">
          Recent Searches
        </h3>
      </div>

      <div className="flex flex-wrap gap-3">
        {recent.map((item) => (
          <button
            key={item}
            onClick={() => onSelect(item)}
            className="
              px-5 py-2
              bg-white/10
              backdrop-blur-sm
              rounded-full
              text-slate-300
              hover:bg-purple-500/30
              hover:text-white
              transition-all
              duration-300
            "
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}