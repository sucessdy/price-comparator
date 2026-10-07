import React from "react";
import { type Recommendation } from "../assistant.types";

export interface RecommendationCardProps {
  recommendation: Recommendation;
  onCompare: (productName: string) => void;
  onAddToPlan: (recommendation: Recommendation) => void;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({
  recommendation,
  onCompare,
  onAddToPlan,
}) => {
  return (
    <div className="mt-3 overflow-hidden rounded-2xl border border-[rgba(108,99,255,0.2)] bg-[rgba(108,99,255,0.05)]">
      {/* =====================================================
          PRODUCT IMAGE
      ===================================================== */}
      {recommendation.image && (
        <div className="relative flex h-48 items-center justify-center overflow-hidden border-b border-white/[0.06] bg-gradient-to-br from-white/[0.04] to-transparent">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(108,99,255,0.12),transparent_65%)]" />

          <img
            src={recommendation.image}
            alt={recommendation.name}
            className="relative z-10 h-full w-full object-contain p-5 drop-shadow-[0_15px_20px_rgba(0,0,0,0.35)]"
            loading="lazy"
          />
        </div>
      )}

      <div className="p-4">
        {/* =====================================================
            HEADER
        ===================================================== */}
        <div className="mb-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#8B83FF]">
            Best Match
          </p>

          <h3 className="mt-1 text-base font-semibold leading-snug text-white">
            {recommendation.name}
          </h3>

          {recommendation.brand && (
            <p className="mt-1 text-sm text-white/50">
              {recommendation.brand}
            </p>
          )}
        </div>

        {/* =====================================================
            PRICE
        ===================================================== */}
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-sm text-white/55">
              Best price
            </p>

            {recommendation.platform && (
              <p className="mt-1 text-xs capitalize text-white/35">
                Available on {recommendation.platform}
              </p>
            )}
          </div>

          <span className="text-2xl font-bold text-white">
            ₹{recommendation.price}
          </span>
        </div>

        {/* =====================================================
            PRODUCT META
        ===================================================== */}
        {(recommendation.rating != null ||
          recommendation.reviews != null ||
          recommendation.delivery) && (
          <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-xs text-white/45">
            {recommendation.rating != null && (
              <span>⭐ {recommendation.rating}</span>
            )}

            {recommendation.reviews != null && (
              <span>
                {recommendation.reviews.toLocaleString()} reviews
              </span>
            )}

            {recommendation.delivery && (
              <span>🚚 {recommendation.delivery}</span>
            )}
          </div>
        )}

        {/* =====================================================
            WHY THIS MATCHES
        ===================================================== */}
        <div className="mt-4 rounded-xl bg-white/[0.025] p-3">
          <p className="text-sm font-medium text-white">
            Why this matches
          </p>

          <p className="mt-1 text-sm leading-relaxed text-white/55">
            {recommendation.reason}
          </p>
        </div>

        {/* =====================================================
            ACTIONS
        ===================================================== */}
        <div className="mt-4 grid grid-cols-3 gap-2">
          {recommendation.productLink ? (
            <a
              href={recommendation.productLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center rounded-xl bg-white/[0.06] px-3 py-2.5 text-sm font-medium text-white/80 transition hover:bg-white/[0.10]"
            >
              View offer ↗
            </a>
          ) : (
            <button
              type="button"
              disabled
              className="rounded-xl bg-white/[0.04] px-3 py-2.5 text-sm font-medium text-white/25"
            >
              No link
            </button>
          )}

          <button
            type="button"
            onClick={() => onCompare(recommendation.name)}
            className="rounded-xl bg-[#6C63FF] px-3 py-2.5 text-sm font-medium text-white transition hover:bg-[#786FFF]"
          >
            Compare
          </button>

          <button
            type="button"
            onClick={() => onAddToPlan(recommendation)}
            className="rounded-xl border border-white/10 px-3 py-2.5 text-sm font-medium text-white/70 transition hover:bg-white/5"
          >
            Add to Plan
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecommendationCard;