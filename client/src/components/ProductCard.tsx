import type { ProductComparison } from "../types/product";
import { ChevronRight, TrendingDown } from "lucide-react";

type Props = {
  result: ProductComparison;
};

export default function ProductCard({ result }: Props) {
  const sortedPrices = Object.entries(result.prices).sort((a, b) => a[1] - b[1]);
  const cheapest = sortedPrices[0];
  const savings = sortedPrices[sortedPrices.length - 1][1] - cheapest[1];

  return (
    <div className="max-w-4xl mx-auto mt-8 px-4">
      {/* Product Title - Compact */}
      <div className="mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-white">
          {result.product}
        </h2>
        <p className="text-sm text-green-400 mt-1 flex items-center gap-1">
          <TrendingDown size={16} />
          Save up to ₹{savings} by choosing the right platform
        </p>
      </div>

      {/* Cheapest Platform - Compact Card */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl p-4 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-xs text-green-100 uppercase tracking-wide">Best Price</p>
            <p className="text-lg font-bold text-white capitalize">{cheapest[0]}</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-white">₹{cheapest[1]}</p>
            <p className="text-xs text-green-100">Lowest price found</p>
          </div>
        </div>
      </div>

      {/* All Prices - Clean Table Layout */}
      <div className="bg-white/5 rounded-xl overflow-hidden">
        <div className="grid grid-cols-2 gap-4 p-4 border-b border-white/10 bg-white/5">
          <div className="text-sm font-semibold text-slate-300">Platform</div>
          <div className="text-sm font-semibold text-slate-300 text-right">Price</div>
        </div>

        <div className="divide-y divide-white/10">
          {sortedPrices.map(([platform, price], index) => {
            const isCheapest = index === 0;
            return (
              <div
                key={platform}
                className={`grid grid-cols-2 gap-4 p-4 hover:bg-white/5 transition-colors ${
                  isCheapest ? "bg-green-500/10" : ""
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="capitalize text-white">{platform}</span>
                  {isCheapest && (
                    <span className="text-xs bg-green-500 px-2 py-0.5 rounded-full">
                      Best
                    </span>
                  )}
                </div>
                <div className="text-right">
                  <span className={`text-lg font-semibold ${isCheapest ? "text-green-400" : "text-white"}`}>
                    ₹{price}
                  </span>
                  {!isCheapest && (
                    <span className="text-xs text-slate-400 ml-2">
                      (+₹{price - cheapest[1]})
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Simple CTA */}
      <button className="w-full mt-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-xl font-semibold transition-all flex items-center justify-center gap-2">
        Compare Best Deals
        <ChevronRight size={18} />
      </button>
    </div>
  );
}