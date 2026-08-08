
import type { ProductComparison } from "../../../types/product";
import { formatCurrency } from "../../../utils/formatCurrency";
interface CompareCardProps {
  comparison: ProductComparison;
}

const CompareCard = ({ comparison }: CompareCardProps) => {
  const prices = Object.entries(comparison.prices).sort(
    ([, firstPrice], [, secondPrice]) => firstPrice - secondPrice,
  );

  return (
    <div className="mt-3 overflow-hidden rounded-xl border border-[rgba(108,99,255,0.25)] bg-[rgba(108,99,255,0.08)]">
      <div className="border-b border-[rgba(255,255,255,0.08)] px-4 py-3">
        <p className="text-xs font-medium uppercase tracking-wider text-[#8B83FF]">Best price</p>
        <div className="mt-1 flex items-end justify-between gap-3">
          <span className="capitalize text-sm text-white">{comparison.cheapest.platform}</span>
          <span className="text-lg font-semibold text-white">{formatCurrency(comparison.cheapest.price)}</span>
        </div>
      </div>
      <ul className="divide-y divide-[rgba(255,255,255,0.06)] px-4">
        {prices.map(([platform, price]) => (
          <li key={platform} className="flex items-center justify-between py-2 text-sm">
            <span className="capitalize text-[rgba(255,255,255,0.7)]">{platform}</span>
            <span className="text-white">{formatCurrency(price)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CompareCard;
