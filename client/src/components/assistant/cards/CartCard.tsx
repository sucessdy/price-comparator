import type { OptimizeCartResponse } from "../../../types/product";
import { formatCurrency } from "../../../utils/formatCurrency";

interface CartCardProps {
  result: OptimizeCartResponse;
}

const CartCard = ({ result }: CartCardProps) => {
  const recommended = result.recommended;

  if (!recommended) return null;

  const isSplitCart = recommended.strategy === "split-cart";
  const feeBreakdown = recommended.feeBreakdown;


  const details = recommended.details;

  const storeBreakdown =
    details && typeof details === "object" && !Array.isArray(details)
      ? Object.entries(details).reduce<
          Record<string, { items: number; total: number }>
        >((acc, [, item]) => {
          if (!item.platform || !item.quantity || item.price == null) {
            return acc;
          }

          const platform = item.platform.toLowerCase().trim();

          if (!acc[platform]) {
            acc[platform] = { items: 0, total: 0 };
          }

          acc[platform].items += item.quantity;
          acc[platform].total += item.price * item.quantity;

          return acc;
        }, {})
      : {};

  const otherAlternatives = (result.alternatives ?? [])
    .filter((alt) => {
      if (alt.platform === recommended.platform) return false;
      if (alt.totalCost === recommended.totalCost) return false;
      return true;
    })
    .slice(0, 3);

  return (
    <div className="mt-4 overflow-hidden rounded-3xl border border-[#6C63FF]/20 bg-[#111118] shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
      <div className="relative overflow-hidden border-b border-white/[0.07] p-5">
        <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-[#6C63FF]/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-32 w-32 rounded-full bg-[#8B83FF]/5 blur-3xl" />

        <div className="relative">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#6C63FF]/10 text-[#A79FFF]">
              ✦
            </div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#A79FFF]">
              SmartCart optimized your cart
            </p>
          </div>

          <div className="mt-5">
            <p className="text-xs uppercase tracking-[0.16em] text-white/30">
              Best strategy
            </p>
            <h3 className="mt-1 text-xl font-semibold text-white">
              {isSplitCart
                ? "Split across stores"
                : `Buy from ${recommended.platform}`}
            </h3>
          </div>

          <div className="mt-5 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs text-white/35">Final total</p>
              <p className="mt-1 text-4xl font-bold tracking-tight text-white">
                {formatCurrency(recommended.totalCost)}
              </p>
            </div>

            {isSplitCart && result.savings > 0 && (
              <div className="rounded-2xl border border-emerald-400/15 bg-emerald-400/[0.06] px-3 py-2.5 text-right">
                <p className="text-[10px] uppercase tracking-wider text-emerald-300/60">
                  Savings
                </p>
                <p className="mt-1 text-sm font-semibold text-emerald-300">
                  {formatCurrency(result.savings)}
                </p>
                <p className="text-[10px] text-emerald-300/50">
                  vs best single-store option
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {isSplitCart && Object.keys(storeBreakdown).length > 0 && (
        <div className="border-b border-white/[0.07] px-5 py-5">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/35">
              Where to buy
            </p>
            <span className="rounded-full bg-white/[0.04] px-2.5 py-1 text-[10px] text-white/35">
              {Object.keys(storeBreakdown).length} stores
            </span>
          </div>

          <div className="space-y-3">
            {Object.entries(storeBreakdown).map(([platform, store]) => (
              <div
                key={platform}
                className="flex items-center justify-between rounded-2xl border border-white/[0.06] bg-white/[0.025] px-4 py-3"
              >
                <div>
                  <p className="text-sm font-medium capitalize text-white">
                    {platform}
                  </p>
                  <p className="mt-1 text-xs text-white/35">
                    {store.items} {store.items === 1 ? "item" : "items"}
                  </p>
                </div>
                <p className="text-sm font-semibold text-white">
                  {formatCurrency(store.total)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =====================================================
          COST BREAKDOWN
      ===================================================== */}
      {feeBreakdown && (
        <div className="border-b border-white/[0.07] px-5 py-5">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-white/35">
            Cost breakdown
          </p>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-white/45">Products</span>
              <span className="text-white/80">
                {formatCurrency(feeBreakdown.productCost)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/45">Delivery</span>
              <span className="text-white/80">
                {/* FIX: Only show "Free" if freeDeliveryApplied is true */}
                {feeBreakdown.deliveryFee === 0 &&
                feeBreakdown.freeDeliveryApplied
                  ? "Free"
                  : formatCurrency(feeBreakdown.deliveryFee)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/45">Platform fee</span>
              <span className="text-white/80">
                {feeBreakdown.platformFee === 0
                  ? "Free"
                  : formatCurrency(feeBreakdown.platformFee)}
              </span>
            </div>

            {feeBreakdown.freeDeliveryApplied && (
              <div className="rounded-xl bg-emerald-400/[0.05] px-3 py-2 text-xs text-emerald-300/80">
                ✓ Free delivery applied
              </div>
            )}

            <div className="my-2 h-px bg-white/[0.06]" />

            <div className="flex items-center justify-between">
              <span className="font-medium text-white/70">Final total</span>
              <span className="text-lg font-bold text-white">
                {formatCurrency(recommended.totalCost)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          ALTERNATIVES
      ===================================================== */}
      {otherAlternatives.length > 0 && (
        <div className="border-b border-white/[0.07] px-5 py-5">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-white/35">
            Other options
          </p>
          <div className="space-y-2">
            {otherAlternatives.map((alternative) => (
              <div
                key={`${alternative.platform}-${alternative.totalCost}`}
                className="flex items-center justify-between rounded-xl px-3 py-2.5 hover:bg-white/[0.025]"
              >
                <span className="text-sm capitalize text-white/50">
                  {alternative.platform}
                </span>
                <span className="text-sm text-white/70">
                  {formatCurrency(alternative.totalCost)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =====================================================
          SHOPPING PLAN
      ===================================================== */}
      <div className="px-5 py-5">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/35">
            Your shopping plan
          </p>
          <span className="text-xs text-white/25">
            {result.summary.totalItems}{" "}
            {result.summary.totalItems === 1 ? "item" : "items"}
          </span>
        </div>
        <div className="space-y-2">
          {result.shoppingPlan.map((item) => (
            <div
              key={`${item.product}-${item.platform}`}
              className="flex items-center justify-between gap-4 rounded-xl bg-white/[0.02] px-3 py-2.5"
            >
              <div className="min-w-0">
                <p className="truncate text-sm text-white/75">
                  {item.quantity} × {item.product}
                </p>
                <p className="mt-1 text-xs capitalize text-white/30">
                  {item.platform}
                </p>
              </div>
              <span className="shrink-0 text-sm font-medium text-white/70">
                {formatCurrency(item.totalPrice)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* =====================================================
          MISSING PRODUCTS (FIXED VISIBILITY)
      ===================================================== */}
      {result.missingProducts && result.missingProducts.length > 0 && (
        <div className="border-t border-amber-400/20 bg-amber-400/[0.08] px-5 py-4">
          <div className="flex items-start gap-2">
            <span className="text-amber-400 text-sm mt-0.5">⚠️</span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-amber-300 mb-1">
                Not found
              </p>
              <p className="text-xs text-amber-200/90 leading-relaxed">
                {result.missingProducts.join(", ")}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartCard;
