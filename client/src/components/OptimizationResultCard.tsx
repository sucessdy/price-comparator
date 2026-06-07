
import {  TrendingDown, ShoppingBag, AlertCircle, CheckCircle, Zap, MapPin, Truck } from "lucide-react";
import type { OptimizeCartResponse , CartItem} from "../types/product";

type Props = {
  result: OptimizeCartResponse;
  cartItems: CartItem[];  // Add this
};


export default function OptimizationResultCard({  result, cartItems }: Props)  {
  const isSplitCart = result.recommended.strategy === "split-cart";
  const hasSavings = result.savings > 0;
  const hasMissingProducts = result.missingProducts?.length > 0;

  // Mock shopping plan - in real app, this would come from backend
  // You'll need to update your backend to return this structure
 const shoppingPlan = result.recommended.details
    ? Object.entries(result.recommended.details).map(([name, data]) => ({
        product: name,
        platform: data.platform,
        price: data.price,
      }))
    : cartItems.map(item => ({
        product: item.name,
        platform: result.recommended.platform || "unknown",
        price: 0, // You don't have price per item in cart
      }));

  return (
    <div className="mt-8 animate-fade-in-up space-y-6">
      
      {/* CARD 1: TOTAL COST - BIG & FIRST */}
      <div className="bg-gradient-to-br from-green-600 to-emerald-700 rounded-2xl p-8 text-center shadow-2xl">
        <p className="text-green-100 text-sm uppercase tracking-wide mb-2">You Pay</p>
        <p className="text-6xl md:text-7xl font-bold text-white">
          ₹{result.recommended.totalCost.toLocaleString()}
        </p>
        <p className="text-green-100 text-sm mt-3">Total Cost (including all items)</p>
      </div>

      {/* CARD 2: SAVINGS - Only show if > 0 */}
      {hasSavings && (
        <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-lg rounded-2xl p-5 border border-yellow-500/30">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-500/20 rounded-full">
                <TrendingDown className="text-yellow-400" size={24} />
              </div>
              <div>
                <p className="text-yellow-300 text-sm">You Saved</p>
                <p className="text-3xl font-bold text-yellow-400">₹{result.savings.toLocaleString()}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-yellow-300/80 text-sm">Compared to next best option</p>
              <p className="text-green-400 text-sm">🎉 Great deal!</p>
            </div>
          </div>
        </div>
      )}

      {/* CARD 3: STRATEGY - Second priority */}
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-purple-500/20 rounded-xl">
            {isSplitCart ? <Zap size={28} className="text-purple-400" /> : <ShoppingBag size={28} className="text-purple-400" />}
          </div>
          <div className="flex-grow">
            <p className="text-slate-400 text-sm mb-1">Shopping Strategy</p>
            <p className="text-2xl font-bold text-white capitalize mb-2">
              {isSplitCart ? "Smart Split Cart" : "Single Platform"}
            </p>
            {!isSplitCart && result.recommended.platform && (
              <div className="flex items-center gap-2 mt-2">
                <MapPin size={16} className="text-purple-400" />
                <p className="text-purple-300 font-semibold capitalize">{result.recommended.platform}</p>
                <span className="text-xs text-green-400 ml-2">✓ All items available</span>
              </div>
            )}
            {isSplitCart && (
              <p className="text-slate-300 text-sm mt-2">
                Buy each product from its cheapest platform
              </p>
            )}
          </div>
        </div>
      </div>

      {/* CARD 4: SHOPPING PLAN - The star of the page! */}
      {!isSplitCart && result.recommended.platform && (
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 overflow-hidden">
          <div className="bg-purple-500/20 px-6 py-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Truck size={20} className="text-purple-400" />
              <h3 className="text-lg font-semibold text-white">Your Shopping Plan</h3>
            </div>
            <p className="text-slate-400 text-sm mt-1">Buy everything from {result.recommended.platform}</p>
          </div>
          
          <div className="divide-y divide-white/10">
            {shoppingPlan.map((item, idx) => (
              <div key={idx} className="p-4 hover:bg-white/5 transition-colors">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-white font-medium capitalize">{item.product}</p>
                    <p className="text-sm text-purple-300 capitalize">{item.platform}</p>
                  </div>
                  <p className="text-xl font-bold text-green-400">₹{item.price}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="bg-purple-500/10 px-6 py-4 border-t border-white/10">
            <div className="flex justify-between items-center">
              <p className="text-white font-semibold">Total</p>
              <p className="text-2xl font-bold text-green-400">₹{result.recommended.totalCost}</p>
            </div>
          </div>
        </div>
      )}

      {/* For Split Cart - More detailed shopping plan */}
      {isSplitCart && (
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4">
            <div className="flex items-center gap-2">
              <Zap size={20} className="text-yellow-300" />
              <h3 className="text-lg font-semibold text-white">Smart Shopping Plan</h3>
            </div>
            <p className="text-purple-100 text-sm mt-1">Buy each product from the cheapest platform</p>
          </div>
          
          <div className="divide-y divide-white/10">
            {shoppingPlan.map((item, idx) => (
              <div key={idx} className="p-4 hover:bg-white/5 transition-colors">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-white font-medium capitalize">{item.product}</p>
                    <p className="text-sm text-purple-300 capitalize">{item.platform}</p>
                  </div>
                  <p className="text-xl font-bold text-green-400">₹{item.price}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="bg-purple-500/10 px-6 py-4 border-t border-white/10">
            <div className="flex justify-between items-center">
              <p className="text-white font-semibold">Total</p>
              <p className="text-2xl font-bold text-green-400">₹{result.recommended.totalCost}</p>
            </div>
          </div>
        </div>
      )}

      {/* CARD 5: WHY THIS RECOMMENDATION */}
      <div className="bg-blue-500/10 backdrop-blur-lg rounded-2xl p-5 border border-blue-500/30">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-blue-500/20 rounded-lg">
            <CheckCircle size={20} className="text-blue-400" />
          </div>
          <div>
            <p className="text-blue-300 font-semibold mb-1">Why this recommendation?</p>
            {!hasMissingProducts && (
              <p className="text-slate-300 text-sm">
                {isSplitCart 
                  ? "Buying from different platforms saves you money. Each product is purchased from its cheapest available source."
                  : `All products are available on ${result.recommended.platform} at the best combined price. Buying together saves on delivery and hassle.`
                }
                {hasSavings && ` You save ₹${result.savings} compared to other options.`}
              </p>
            )}
            {hasMissingProducts && (
              <p className="text-slate-300 text-sm">
                Some products aren't available. Add them to the database first, then optimize again.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Missing Products Warning */}
      {hasMissingProducts && (
        <div className="bg-red-500/20 backdrop-blur-lg rounded-2xl p-5 border border-red-500/30">
          <div className="flex items-start gap-3">
            <AlertCircle size={20} className="text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-red-300 font-semibold mb-2">⚠️ Products Not Found</p>
              <div className="flex flex-wrap gap-2 mb-3">
                {result.missingProducts.map((product) => (
                  <span key={product} className="px-3 py-1 bg-red-500/30 rounded-lg text-sm text-red-200">
                    {product}
                  </span>
                ))}
              </div>
              <p className="text-sm text-red-300">
                These products aren't in our database. Add them using the admin panel to include in optimization.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
