import type { ProductComparison } from "../../../types/product";
import { formatCurrency } from "../../../utils/formatCurrency";

interface CompareCardProps {
  comparison: ProductComparison;
}

const CompareCard = ({ comparison }: CompareCardProps) => {
  const platformOffers = comparison.platforms?.length
    ? [...comparison.platforms].sort((a, b) => a.price - b.price)
    : Object.entries(comparison.prices)
        .map(([name, price]) => ({
          name,
          price,
          url: undefined,
          inStock: undefined,
        }))
        .sort((a, b) => a.price - b.price);

  const bestPlatform = comparison.cheapest?.platform;
  const bestPrice = comparison.cheapest?.price;

  const bestOffer =
    platformOffers.find(
      (offer) =>
        offer.name.toLowerCase().trim() ===
        bestPlatform?.toLowerCase().trim()
    ) ?? platformOffers[0];

  return (
    <div className="mt-4 overflow-hidden rounded-3xl border border-[#6C63FF]/20 bg-[#111118] shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
      {/* =====================================================
          HEADER
      ===================================================== */}
      <div className="relative overflow-hidden border-b border-white/[0.07] px-5 py-5">
        <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-[#6C63FF]/10 blur-3xl" />

        <div className="relative">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#6C63FF]/10 text-[#A79FFF]">
              🔎
            </div>

            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#A79FFF]">
              Price comparison
            </p>
          </div>

          <h3 className="mt-4 text-lg font-semibold leading-snug text-white">
            {comparison.product}
          </h3>
        </div>
      </div>

      {/* =====================================================
          BEST PRICE
      ===================================================== */}
      <div className="border-b border-white/[0.07] px-5 py-5">
        <p className="text-xs uppercase tracking-[0.16em] text-white/30">
          Best available
        </p>

        <div className="mt-2 flex items-end justify-between gap-4">
          <div>
            <p className="text-lg font-semibold capitalize text-white">
              {bestPlatform}
            </p>

            {bestOffer?.inStock !== undefined && (
              <p
                className={`mt-1 text-xs ${
                  bestOffer.inStock
                    ? "text-emerald-300/80"
                    : "text-red-300/70"
                }`}
              >
                {bestOffer.inStock ? "In stock" : "Currently unavailable"}
              </p>
            )}
          </div>

          <p className="text-3xl font-bold tracking-tight text-white">
            {formatCurrency(bestPrice)}
          </p>
        </div>

        {bestOffer?.url && (
          <a
            href={bestOffer.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 flex w-full items-center justify-center rounded-xl bg-[#6C63FF] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#786FFF]"
          >
            View best offer ↗
          </a>
        )}
      </div>

      {/* =====================================================
          ALL OFFERS
      ===================================================== */}
      <div className="px-5 py-5">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/35">
            Compare stores
          </p>

          <span className="text-xs text-white/25">
            {platformOffers.length}{" "}
            {platformOffers.length === 1 ? "store" : "stores"}
          </span>
        </div>

        <div className="space-y-2">
          {platformOffers.map((offer) => {
            const isBest =
              offer.name.toLowerCase().trim() ===
              bestPlatform?.toLowerCase().trim();

            return (
              <div
                key={`${offer.name}-${offer.price}`}
                className={`rounded-2xl border px-4 py-3 ${
                  isBest
                    ? "border-[#6C63FF]/25 bg-[#6C63FF]/[0.07]"
                    : "border-white/[0.06] bg-white/[0.025]"
                }`}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-medium capitalize text-white">
                        {offer.name}
                      </p>

                      {isBest && (
                        <span className="shrink-0 rounded-full bg-[#6C63FF]/15 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-[#A79FFF]">
                          Best
                        </span>
                      )}
                    </div>

                    {offer.inStock !== undefined && (
                      <p
                        className={`mt-1 text-xs ${
                          offer.inStock
                            ? "text-emerald-300/60"
                            : "text-white/25"
                        }`}
                      >
                        {offer.inStock
                          ? "In stock"
                          : "Unavailable"}
                      </p>
                    )}
                  </div>

                  <div className="flex shrink-0 items-center gap-3">
                    <span className="text-sm font-semibold text-white">
                      {formatCurrency(offer.price)}
                    </span>

                    {offer.url && (
                      <a
                        href={offer.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-medium text-[#A79FFF] hover:text-white"
                      >
                        View ↗
                      </a>
                    )}
                  </div>
                </div>

                {/* Price difference from best */}
                {!isBest && bestPrice != null && (
                  <p className="mt-2 text-[10px] text-white/25">
                    {formatCurrency(offer.price - bestPrice)} above best price
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CompareCard;