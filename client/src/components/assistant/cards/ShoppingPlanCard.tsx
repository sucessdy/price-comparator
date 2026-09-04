import React from "react";
import type { CartItem } from "../../../types/product";
import { Minus, Plus, ShoppingBag, Sparkles } from "lucide-react";

interface ShoppingPlanCardProps {
  items: CartItem[];
  onOptimize: () => void;
  onRemove: (productName: string) => void;
  onAdd: (productName: string) => void;
}

const ShoppingPlanCard: React.FC<ShoppingPlanCardProps> = ({
  items,
  onOptimize,
  onRemove,
  onAdd,
}) => {
  const totalItems = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="mx-4 mt-4 rounded-2xl border border-white/10 bg-gradient-to-br from-[#1A1A2E] to-[#0F0F1A] p-5 shadow-2xl shadow-[#6C63FF]/5 backdrop-blur-xl transition-all duration-300 hover:shadow-[#6C63FF]/10">
      {/* Header Section */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-gradient-to-br from-[#6C63FF] to-[#8B83FF] p-2 shadow-lg shadow-[#6C63FF]/20">
            <ShoppingBag className="h-4 w-4 text-white" />
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#8B83FF]">
              Shopping Plan
            </p>
            <h3 className="text-sm font-semibold text-white/90">
              Selected Items
            </h3>
          </div>
        </div>
        <span className="rounded-full bg-gradient-to-r from-[#6C63FF]/20 to-[#8B83FF]/20 px-3 py-1 text-xs font-medium text-[#A9A4FF] backdrop-blur-sm border border-white/5">
          {totalItems} {totalItems === 1 ? "item" : "items"}
        </span>
      </div>

      {/* Items List */}
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div className="mb-3 rounded-full bg-white/5 p-3">
            <ShoppingBag className="h-6 w-6 text-white/20" />
          </div>
          <p className="text-sm text-white/40">No products added yet</p>
          <p className="text-xs text-white/20">Start adding items to your plan</p>
        </div>
      ) : (
        <>
          <ul className="divide-y divide-white/5">
            {items.map((item, index) => (
              <li
                key={item.name}
                className="group flex items-center justify-between gap-3 py-3 transition-all duration-200 hover:bg-white/5 rounded-lg px-2 -mx-2"
                style={{
                  animationDelay: `${index * 50}ms`,
                }}
              >
                <span className="flex-1 text-sm capitalize text-white/80 transition-colors group-hover:text-white/90">
                  {item.name}
                </span>
                
                <div className="flex items-center gap-2">
                  <span className="min-w-[2.5rem] text-center text-sm font-medium text-white/70">
                    × {item.quantity}
                  </span>
                  
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onRemove(item.name)}
                      className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/60 transition-all duration-200 hover:border-[#6C63FF]/30 hover:bg-[#6C63FF]/10 hover:text-[#8B83FF] hover:shadow-lg hover:shadow-[#6C63FF]/10 active:scale-95"
                      aria-label={`Remove ${item.name}`}
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    
                    <button
                      onClick={() => onAdd(item.name)}
                      className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/60 transition-all duration-200 hover:border-[#6C63FF]/30 hover:bg-[#6C63FF]/10 hover:text-[#8B83FF] hover:shadow-lg hover:shadow-[#6C63FF]/10 active:scale-95"
                      aria-label={`Add ${item.name}`}
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          {/* Footer with Optimize Button */}
          <div className="mt-4 pt-4 border-t border-white/5">
            <button
              onClick={onOptimize}
              className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-[#6C63FF] to-[#8B83FF] px-4 py-3 text-sm font-medium text-white transition-all duration-300 hover:shadow-lg hover:shadow-[#6C63FF]/20 hover:scale-[1.01] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                <Sparkles className="h-4 w-4 transition-transform duration-300 group-hover:rotate-12" />
                Optimize Plan
                <span className="absolute right-4 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-1">
                  →
                </span>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ShoppingPlanCard;