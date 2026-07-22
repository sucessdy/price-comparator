import { useState } from "react";
import { ChevronDown, ChevronUp, Trophy } from "lucide-react";
import type { PlatformAlternative } from "../types/product";
type Props = { 
  alternatives :PlatformAlternative[], 
  currentBest : PlatformAlternative, 
  savings :number 
}
export default function AlternativesComparison({
  alternatives,
  currentBest,
  
}: Props) {
  const [isExpanded, setIsExpanded] = useState(false);

  const otherOptions = alternatives.filter((alt) => alt.platform !== currentBest.platform).sort((a, b) => a.totalCost - b.totalCost);

  if (otherOptions.length === 0) {
    return null;
  }

  return (
    <div className="mt-6">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 bg-white/5 rounded-xl border border-white/10 flex items-center justify-between"
      >
        <span className="text-white font-medium">Why This Recommendation?</span>

        {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>

      {isExpanded && (
        <div className="mt-3 space-y-2">
          <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Trophy size={16} className="text-yellow-400" />

              <span className="text-green-300 font-medium">Recommended</span>
            </div>

            <div className="flex justify-between">
              <span className="capitalize text-white">
                {currentBest.platform}
              </span>

              <span className="text-green-400 font-bold">
                ₹{currentBest.totalCost}
              </span>
            </div>
          </div>


          {otherOptions.slice(0, 5).map((alt) => {
            const difference = alt.totalCost - currentBest.totalCost;

            return (
              <div
                key={alt.platform}
                className="flex justify-between items-center p-4 bg-white/5 rounded-xl"
              >
                <span className="capitalize text-white">{alt.platform}</span>

                <div className="text-right">
                  <p className="text-white">₹{alt.totalCost}</p>

                  <p className="text-red-400 text-xs">+₹{difference}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
