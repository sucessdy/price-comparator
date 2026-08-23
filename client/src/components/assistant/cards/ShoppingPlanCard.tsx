import React from "react";
import type { CartItem } from "../../../types/product";

interface ShoppingPlanCardProps {
  items: CartItem[];
}

const ShoppingPlanCard: React.FC<ShoppingPlanCardProps> = ({ items }) => {
  const totalItems = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="mt-3 rounded-2xl border border-[rgba(108,99,255,0.2)] bg-[rgba(108,99,255,0.05)] p-4">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[#8B83FF]">
            Shopping Plan
          </p> 
          <h3 className="mt-1 text-base font-semibold text-white">
            Selected items
          </h3>
        </div>
        <span className="rounded-full bg-[rgba(108,99,255,0.18)] px-2.5 py-1 text-xs font-medium text-[#A9A4FF]">
          {totalItems} {totalItems === 1 ? "item" : "items"}
        </span>
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-white/50">No products added yet.</p>
      ) : (
        <ul className="divide-y divide-white/10">
          {items.map((item) => (
            <li
              key={item.name}
              className="flex items-center justify-between gap-3 py-2.5 text-sm"
            >
              <span className="capitalize text-white/80">{item.name}</span>
              <span className="shrink-0 font-medium text-white">
                × {item.quantity}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ShoppingPlanCard;
