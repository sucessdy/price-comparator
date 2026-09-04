import React, { useState } from "react";
import type { CartItem } from "../../../types/product";
import { Minus, Plus, ShoppingBag, Sparkles, X, ChevronRight } from "lucide-react";

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
  const [isOpen, setIsOpen] = useState(false);
  const totalItems = items.reduce((total, item) => total + item.quantity, 0);

  // Don't render anything if no items
  if (items.length === 0) {
    return null;
  }

  return (
    <>
      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-gradient-to-r from-[#6C63FF] to-[#8B83FF] px-4 py-3 text-sm font-medium text-white shadow-2xl shadow-[#6C63FF]/30 transition-all duration-300 hover:scale-105 hover:shadow-[#6C63FF]/50 active:scale-95 md:bottom-8 md:right-8"
      >
        <ShoppingBag className="h-4 w-4" />
        <span>Cart</span>
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-xs font-bold">
          {totalItems}
        </span>
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Slide-out Panel from Right */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-md transform bg-gradient-to-br from-[#1A1A2E] to-[#0F0F1A] shadow-2xl shadow-[#6C63FF]/20 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/5 p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-gradient-to-br from-[#6C63FF] to-[#8B83FF] p-2 shadow-lg shadow-[#6C63FF]/20">
              <ShoppingBag className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#8B83FF]">
                Shopping Plan
              </p>
              <h3 className="text-sm font-semibold text-white/90">
                {totalItems} {totalItems === 1 ? "Item" : "Items"}
              </h3>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="rounded-lg p-2 text-white/40 transition-all duration-200 hover:bg-white/5 hover:text-white/80"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Items List */}
        <div className="flex h-[calc(100%-8rem)] flex-col overflow-y-auto p-5">
          <ul className="divide-y divide-white/5">
            {items.map((item, index) => (
              <li
                key={item.name}
                className="group flex items-center justify-between gap-3 py-4 transition-all duration-200 hover:bg-white/5 rounded-lg px-2 -mx-2"
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
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/60 transition-all duration-200 hover:border-[#6C63FF]/30 hover:bg-[#6C63FF]/10 hover:text-[#8B83FF] hover:shadow-lg hover:shadow-[#6C63FF]/10 active:scale-95"
                      aria-label={`Remove ${item.name}`}
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    
                    <button
                      onClick={() => onAdd(item.name)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/60 transition-all duration-200 hover:border-[#6C63FF]/30 hover:bg-[#6C63FF]/10 hover:text-[#8B83FF] hover:shadow-lg hover:shadow-[#6C63FF]/10 active:scale-95"
                      aria-label={`Add ${item.name}`}
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer with Optimize Button */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-white/5 bg-[#0F0F1A]/80 p-5 backdrop-blur-sm">
          <button
            onClick={() => {
              onOptimize();
              setIsOpen(false);
            }}
            className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-[#6C63FF] to-[#8B83FF] px-4 py-3.5 text-sm font-medium text-white transition-all duration-300 hover:shadow-lg hover:shadow-[#6C63FF]/30 hover:scale-[1.01] active:scale-[0.98]"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              <Sparkles className="h-4 w-4 transition-transform duration-300 group-hover:rotate-12" />
              Optimize Plan
              <ChevronRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
          </button>
        </div>
      </div>
    </>
  );
};

export default ShoppingPlanCard;