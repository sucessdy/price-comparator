import {type  ProductComparison } from "../../../types/product";

interface MultipleCompareCardProps {
  comparisons: ProductComparison[];
}

const MultipleCompareCard = ({ comparisons }: MultipleCompareCardProps) => {
  return (
    <div className="mt-3 rounded-2xl border border-[rgba(108,99,255,0.2)] bg-[rgba(108,99,255,0.05)] p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-[#8B83FF]">
        Product Comparison
      </p>

      <div className="mt-3 space-y-3">
        {comparisons.map((comparison) => (
          <div
            key={comparison.product}
            className="rounded-xl border border-white/10 bg-white/5 p-3"
          >
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-sm font-semibold text-white">
                {comparison.product}
              </h3>
              <span className="text-base font-bold text-white">
                ₹{comparison.cheapest.price.toLocaleString("en-IN")}
              </span>
            </div>

            <p className="mt-1 text-xs text-white/40">
              Cheapest on {comparison.cheapest.platform}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MultipleCompareCard;