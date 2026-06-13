import { TrendingDown, ShoppingBag, AlertCircle, CheckCircle, Zap} from "lucide-react";
import type { OptimizeCartResponse, CartItem } from "../types/product";

type Props = {
  result: OptimizeCartResponse;
  cartItems: CartItem[];
};

export default function OptimizationResultCard({ result, cartItems }: Props) {
  const isSplitCart = result.recommended.strategy === "split-cart";
  const hasSavings = result.savings > 0;
  const hasMissingProducts = result.missingProducts?.length > 0;

  return (
    <div className="mt-8 animate-fade-in-up space-y-6">
      
      {/* CARD 1: WHAT YOU'RE BUYING */}
      <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 overflow-hidden">
        <div className="bg-purple-500/20 px-6 py-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} className="text-purple-400" />
            <h3 className="text-lg font-semibold text-white">Your Cart</h3>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            {cartItems.reduce((sum, item) => sum + item.quantity, 0)} items to optimize
          </p>
        </div>
        
        <div className="divide-y divide-white/10">
          {cartItems.map((item, idx) => (
            <div key={idx} className="p-4 hover:bg-white/5 transition-colors">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-white font-medium capitalize">{item.name}</p>
                  <p className="text-sm text-slate-400">Quantity: {item.quantity}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

     
      {/* CARD 3: PRICE BREAKDOWN */}
      {!isSplitCart && result.recommended.feeBreakdown && (
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 overflow-hidden">
          <div className="px-6 py-4 border-b border-white/10">
            <h3 className="text-lg font-semibold text-white">Price Breakdown</h3>
            <p className="text-slate-400 text-sm mt-1">See exactly where your money goes</p>
          </div>
          
          <div className="p-5 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-slate-300">Products Total</span>
              <span className="text-white font-medium">₹{result.recommended.feeBreakdown.productCost}</span>
            </div>
            
            {result.recommended.feeBreakdown.deliveryFee > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Delivery Fee</span>
                <span className="text-white">₹{result.recommended.feeBreakdown.deliveryFee}</span>
              </div>
            )}
            
            {result.recommended.feeBreakdown.platformFee > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Platform Fee</span>
                <span className="text-white">₹{result.recommended.feeBreakdown.platformFee}</span>
              </div>
            )}
            
            <div className="border-t border-white/10 pt-3 mt-2">
              <div className="flex justify-between items-center">
                <span className="text-white font-bold">Total</span>
                <span className="text-2xl font-bold text-green-400">₹{result.recommended.totalCost}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CARD 4: TOTAL COST */}
      <div className="bg-gradient-to-br from-green-600 to-emerald-700 rounded-2xl p-6 text-center shadow-2xl">
        <p className="text-green-100 text-sm uppercase tracking-wide mb-1">You Pay</p>
        <p className="text-5xl md:text-6xl font-bold text-white">
          ₹{result.recommended.totalCost.toLocaleString()}
        </p>
        <p className="text-green-100 text-xs mt-2">Final total including all fees</p>
      </div>

     {/* CARD 5: SAVINGS - Only show if > 1% */}
{hasSavings && (() => {
  const savingsPercentage = (result.savings / result.recommended.totalCost) * 100;
  
  if (savingsPercentage > 1) {
    return (
      <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-lg rounded-2xl p-4 border border-yellow-500/30">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-500/20 rounded-full">
              <TrendingDown className="text-yellow-400" size={20} />
            </div>
            <div>
              <p className="text-yellow-300 text-xs">You Saved</p>
              <p className="text-2xl font-bold text-yellow-400">
                ₹{result.savings.toLocaleString()} ({savingsPercentage.toFixed(1)}%)
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-yellow-300/80 text-xs">Compared to next best option</p>
            <p className="text-green-400 text-sm">🎉 Great deal!</p>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="bg-green-500/20 backdrop-blur-lg rounded-2xl p-4 border border-green-500/30">
        <div className="text-center">
          <p className="text-green-400 text-sm">✅ Best prices already found</p>
          <p className="text-slate-400 text-xs mt-1">
            This platform already offers the lowest prices for all items
          </p>
        </div>
      </div>
    );
  }
})()}

      {/* CARD 6: STRATEGY */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-purple-500/20 rounded-lg">
            {isSplitCart ? <Zap size={18} className="text-purple-400" /> : <ShoppingBag size={18} className="text-purple-400" />}
          </div>
          <div className="flex-grow">
            <p className="text-slate-400 text-xs mb-1">Strategy</p>
            <p className="text-white font-semibold capitalize text-sm">
              {isSplitCart ? "Smart Split Cart" : `Single Platform: ${result.recommended.platform}`}
            </p>
            {!isSplitCart && (
              <span className="text-xs text-green-400">✓ All items available</span>
            )}
          </div>
        </div>
      </div>

      {/* CARD 7: WHY */}
      <div className="bg-blue-500/10 backdrop-blur-lg rounded-xl p-4 border border-blue-500/30">
        <div className="flex items-start gap-3">
          <CheckCircle size={16} className="text-blue-400 flex-shrink-0 mt-0.5" />
          <p className="text-slate-300 text-sm">
            {isSplitCart 
              ? "Buying from different platforms saves you money. Each product is purchased from its cheapest available source."
              : `All products are available on ${result.recommended.platform} at the best combined price. Buying together saves on delivery and hassle.`
            }
            {hasSavings && ` You save ₹${result.savings} compared to other options.`}
          </p>
        </div>
      </div>

      {/* Missing Products */}
      {hasMissingProducts && (
        <div className="bg-red-500/20 backdrop-blur-lg rounded-xl p-4 border border-red-500/30">
          <div className="flex items-start gap-3">
            <AlertCircle size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-red-300 font-semibold text-sm mb-2">⚠️ Products Not Found</p>
              <div className="flex flex-wrap gap-2">
                {result.missingProducts.map((product) => (
                  <span key={product} className="px-2 py-1 bg-red-500/30 rounded-lg text-xs text-red-200">
                    {product}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}