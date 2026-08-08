import type { OptimizeCartResponse } from "../../../types/product";
import { formatCurrency } from "../../../utils/formatCurrency";

interface CartCardProps {
  result: OptimizeCartResponse;
}

const CartCard = ({ result }: CartCardProps) => {
  if (!result.recommended) return null;

  const isSinglePlatform = result.recommended.strategy === "single-platform";

  return (
    <div className="mt-3 overflow-hidden rounded-xl border border-[rgba(108,99,255,0.25)] bg-[rgba(108,99,255,0.08)]">
      <div className="border-b border-[rgba(255,255,255,0.08)] px-4 py-3">
        <p className="text-xs font-medium uppercase tracking-wider text-[#8B83FF]">Shopping plan</p>
        <div className="mt-1 flex items-end justify-between gap-3">
          <span className="text-sm text-white">
            {isSinglePlatform ? `Buy from ${result.recommended.platform}` : "Split across stores"}
          </span>
          <span className="text-lg font-semibold text-white">{formatCurrency(result.recommended.totalCost)}</span>
        </div>
        {result.savings > 0 && <p className="mt-1 text-xs text-emerald-300">You save {formatCurrency(result.savings)}</p>}
      </div>
      <ul className="divide-y divide-[rgba(255,255,255,0.06)] px-4">
        {result.shoppingPlan.map((item) => (
          <li key={`${item.product}-${item.platform}`} className="flex items-center justify-between gap-3 py-2 text-sm">
            <span className="min-w-0 text-[rgba(255,255,255,0.75)]">{item.quantity} × {item.product} <span className="capitalize text-[rgba(255,255,255,0.45)]">· {item.platform}</span></span>
            <span className="shrink-0 text-white">{formatCurrency(item.totalPrice)}</span>
          </li>
        ))}
      </ul>
      {result.missingProducts.length > 0 && <p className="border-t border-[rgba(255,255,255,0.08)] px-4 py-2 text-xs text-amber-200">Not found: {result.missingProducts.join(", ")}</p>}
    </div>
  );
};

export default CartCard;
