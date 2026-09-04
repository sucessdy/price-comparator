import React from "react";
import { type Recommendation } from "../assistant.types";
export interface RecommendationCardProps {
  recommendation: Recommendation;
   onCompare: (productName : string) => void;
 onAddToPlan: (productName: string) => void;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({
  recommendation,
  onCompare, 
  onAddToPlan, 

}) => {
  return (
    <div className="mt-3 rounded-2xl border border-[rgba(108,99,255,0.2)] bg-[rgba(108,99,255,0.05)] p-4">

      {/* Header */}
      <div className="mb-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-[#8B83FF]">
          Best Match
        </p>

        <h3 className="mt-1 text-base font-semibold text-white">
          {recommendation.name}
        </h3>

        {recommendation.brand && (
          <p className="text-sm text-white/50">
            {recommendation.brand}
          </p>
        )}
      </div>

      {/* Price */}
      <div className="flex items-center justify-between">
        <span 
        className="text-sm text-white/60">
          Best price
        </span>

        <span className="text-xl font-bold text-white">
          ₹{recommendation.price}
        </span>
      </div>

      {recommendation.platform && (
        <p className="mt-1 text-xs text-white/40">
          Available on {recommendation.platform}
        </p>
      )}

      {/* Why */}
      <div className="mt-4">
        <p className="text-sm font-medium text-white">
          Why I recommend it
        </p>

        <p className="mt-1 text-sm leading-relaxed text-white/60">
          {recommendation.reason}
        </p>
      </div>

      {/* Pros */}
      {recommendation.pros && recommendation.pros.length > 0 && (
        <div className="mt-3 space-y-1">
          {recommendation.pros.map((pro) => (
            <p key={pro} className="text-sm text-white/70">
              ✓ {pro}
            </p>
          ))}
        </div>
      )}

      {/* Trade-off */}
      {recommendation.tradeOff && (
        <p className="mt-3 text-xs text-white/40">
          Trade-off: {recommendation.tradeOff}
        </p>
      )}

      {/* Actions */}
      <div className="mt-4 flex gap-2">
        <button onClick={() => onCompare(recommendation.name)} className="flex-1 rounded-xl bg-[#6C63FF] px-3 py-2 text-sm font-medium text-white hover:bg-[#7A72FF]">
          Compare
        </button>

        <button  onClick={() => onAddToPlan(recommendation.name)}  className="flex-1 rounded-xl border border-white/10 px-3 py-2 text-sm font-medium text-white/70 hover:bg-white/5">
          Add to Plan
        </button>
      </div>
    </div>
  );
};

export default RecommendationCard;