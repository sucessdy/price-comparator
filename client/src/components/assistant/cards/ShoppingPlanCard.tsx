import React, { useState } from "react";
import type { CartItem } from "../../../types/product";
import { formatCurrency } from "../../../utils/formatCurrency";
import {
  Minus,
  Plus,
  ShoppingBag,
  Sparkles,
  X,
  ChevronRight,
  LoaderCircle,
} from "lucide-react";

interface ShoppingPlanCardProps {
  items: CartItem[];
  onOptimize: () => void;
  onRemove: (productName: string) => void;
  onAdd: (productName: string) => void;
isOptimizing : boolean
}

const ShoppingPlanCard: React.FC<ShoppingPlanCardProps> = ({
  items,
  onOptimize,
  onRemove,
  onAdd,
  isOptimizing
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const totalItems = items.reduce(
    (total, item) => total + item.quantity,
    0
  );

  // Don't render anything if the plan is empty
  if (items.length === 0) {
    return null;
  }

  return (
    <>
      {/* =====================================================
          FLOATING CART TRIGGER
      ===================================================== */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label={`Open shopping plan with ${totalItems} ${
          totalItems === 1 ? "item" : "items"
        }`}
        className="
          fixed bottom-6 right-6 z-50
          flex items-center gap-2
          rounded-full
          bg-gradient-to-r from-[#6C63FF] to-[#8B83FF]
          px-4 py-3
          text-sm font-medium text-white
          shadow-2xl shadow-[#6C63FF]/30
          transition-all duration-300
          hover:scale-105
          hover:shadow-[#6C63FF]/50
          active:scale-95
          md:bottom-8 md:right-8
        "
      >
        <ShoppingBag className="h-4 w-4" />

        <span>Cart</span>

        <span
          className="
            flex h-5 w-5 items-center justify-center
            rounded-full
            bg-white/20
            text-xs font-bold
          "
        >
          {totalItems}
        </span>
      </button>

      {/* =====================================================
          OVERLAY
      ===================================================== */}
      {isOpen && (
        <div
          className="
            fixed inset-0 z-50
            bg-black/60
            backdrop-blur-sm
          "
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* =====================================================
          SLIDE-OUT SHOPPING PLAN
      ===================================================== */}
      <div
        className={`
          fixed top-0 right-0 z-50
          flex h-full w-full max-w-md flex-col
          bg-gradient-to-br from-[#1A1A2E] to-[#0F0F1A]
          shadow-2xl shadow-[#6C63FF]/20
          transition-transform duration-500
          ease-[cubic-bezier(0.32,0.72,0,1)]
          ${isOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        {/* ===================================================
            HEADER
        =================================================== */}
        <div className="flex items-center justify-between border-b border-white/5 p-5">
          <div className="flex items-center gap-3">
            <div
              className="
                rounded-xl
                bg-gradient-to-br from-[#6C63FF] to-[#8B83FF]
                p-2
                shadow-lg shadow-[#6C63FF]/20
              "
            >
              <ShoppingBag className="h-4 w-4 text-white" />
            </div>

            <div>
              <p
                className="
                  text-[10px] font-semibold uppercase
                  tracking-[0.15em]
                  text-[#8B83FF]
                "
              >
                Shopping Plan
              </p>

              <h3 className="text-sm font-semibold text-white/90">
                {totalItems} {totalItems === 1 ? "Item" : "Items"}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsOpen(false)}
            aria-label="Close shopping plan"
            className="
              rounded-lg p-2
              text-white/40
              transition-all duration-200
              hover:bg-white/5
              hover:text-white/80
            "
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* ===================================================
            ITEMS
        =================================================== */}
        <div className="flex-1 overflow-y-auto p-5">
          <ul className="divide-y divide-white/5">
            {items.map((item, index) => {
              const offer = item.offer;

              return (
                <li
                  key={item.name}
                  className="
                    group
                    flex items-center justify-between
                    gap-4
                    rounded-xl
                    px-2 py-4
                    transition-all duration-200
                    hover:bg-white/5
                  "
                  style={{
                    animationDelay: `${index * 50}ms`,
                  }}
                >
                  {/* Product info */}
                  <div className="min-w-0 flex-1">
                    <p
                      className="
                        truncate
                        text-sm font-medium
                        capitalize
                        text-white/85
                        transition-colors
                        group-hover:text-white
                      "
                    >
                      {item.name}
                    </p>

                    {offer?.platform && (
                      <p className="mt-1 text-xs capitalize text-white/35">
                        {offer.platform}
                        {offer.price != null && (
                          <>
                            {" · "}
                            {formatCurrency(offer.price)}
                            {" each"}
                          </>
                        )}
                      </p>
                    )}
                  </div>

                  {/* Quantity controls */}
                  <div className="flex shrink-0 items-center gap-2">
                    <span className="min-w-[2rem] text-center text-sm font-medium text-white/70">
                      × {item.quantity}
                    </span>

                    <button
                      type="button"
                      onClick={() => onRemove(item.name)}
                      aria-label={`Remove ${item.name}`}
                      className="
                        flex h-8 w-8
                        items-center justify-center
                        rounded-lg
                        border border-white/10
                        bg-white/5
                        text-white/60
                        transition-all duration-200
                        hover:border-[#6C63FF]/30
                        hover:bg-[#6C63FF]/10
                        hover:text-[#8B83FF]
                        active:scale-95
                      "
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => onAdd(item.name)}
                      aria-label={`Add another ${item.name}`}
                      className="
                        flex h-8 w-8
                        items-center justify-center
                        rounded-lg
                        border border-white/10
                        bg-white/5
                        text-white/60
                        transition-all duration-200
                        hover:border-[#6C63FF]/30
                        hover:bg-[#6C63FF]/10
                        hover:text-[#8B83FF]
                        active:scale-95
                      "
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>

          {/* =================================================
              OPTIMIZATION PROMPT
          ================================================= */}
          <div
            className="
              mt-6
              rounded-2xl
              border border-[#6C63FF]/10
              bg-[#6C63FF]/[0.04]
              px-4 py-4
            "
          >
            <div className="flex items-start gap-3">
              <div
                className="
                  flex h-9 w-9 shrink-0
                  items-center justify-center
                  rounded-xl
                  bg-[#6C63FF]/10
                  text-[#A79FFF]
                "
              >
                <Sparkles className="h-4 w-4" />
              </div>

              <div>
                <p className="text-sm font-medium text-white/85">
                  Ready to find the best combination?
                </p>

                <p className="mt-1 text-xs leading-relaxed text-white/35">
                  SmartCart will compare your selected offers and calculate
                  the best way to buy your cart.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ===================================================
            CTA FOOTER
        =================================================== */}
      {/* ===================================================
    CTA FOOTER
=================================================== */}
<div
  className="
    border-t border-white/5
    bg-[#0F0F1A]/90
    p-5
    backdrop-blur-xl
  "
>
  <button
    type="button"
    onClick={() => {
      onOptimize();
      setIsOpen(false);
    }}
    disabled={isOptimizing}
    className="
      group relative
      w-full overflow-hidden
      rounded-xl
      bg-gradient-to-r from-[#6C63FF] to-[#8B83FF]
      px-4 py-4
      text-sm font-semibold
      text-white
      transition-all duration-300
      hover:scale-[1.01]
      hover:shadow-lg
      hover:shadow-[#6C63FF]/30
      active:scale-[0.98]
      disabled:cursor-not-allowed
      disabled:opacity-70
    "
  >
    <span className="relative z-10 flex items-center justify-center gap-2">
      {isOptimizing ? (
        <>
          <LoaderCircle className="h-4 w-4 animate-spin" />
          Finding your best cart...
        </>
      ) : (
        <>
          <Sparkles className="h-4 w-4 transition-transform duration-300 group-hover:rotate-12" />
          Find My Best Cart
          <ChevronRight className="h-4 w-4" />
        </>
      )}
    </span>
  </button>
</div>

      </div>
    </>
  );
};

export default ShoppingPlanCard;