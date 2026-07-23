import { useState } from "react";
import { ChevronDown, ChevronUp, Trophy, TrendingDown, ShoppingBag } from "lucide-react";
import type { CartItem, OptimizeCartResponse } from "../types/product";

type Props = {
  result: OptimizeCartResponse;
  cartItems: CartItem[];
};

export default function OptimizationDecision({ result, cartItems }: Props) {
  const [showDetails, setShowDetails] = useState(false);

  if (!result.recommended) {
    return null;
  }

  const isSplitCart = result.recommended.strategy === "split-cart";
  
  const hasAlternative = result.savings > 0;
  const alternativeCost = isSplitCart 
    ? result.recommended.totalCost + result.savings  
    : result.recommended.totalCost + result.savings;

  return (
    <div className="mt-8 animate-fade-in-up space-y-4">
      
      <div className="bg-white/5 backdrop-blur-lg rounded-xl p-4 border border-white/10">
        <div className="flex items-center gap-2 mb-2">
          <ShoppingBag size={16} className="text-purple-400" />
          <span className="text-slate-400 text-sm">Your Cart</span>
        </div>
        <div className="flex flex-wrap gap-3">
          {cartItems.map((item) => (
            <span key={item.name} className="text-white text-sm">
              {item.name} ×{item.quantity}
            </span>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 shadow-2xl">
        <div className="flex items-center gap-2 mb-3">
          <Trophy size={24} className="text-yellow-300" />
          <span className="text-yellow-300 text-sm font-semibold">BEST OPTION</span>
        </div>
        
        <p className="text-white text-xl font-semibold mb-2">
          Buy everything from {result.recommended.platform}
        </p>
        
        <p className="text-5xl md:text-6xl font-bold text-white">
          ₹{result.recommended.totalCost.toLocaleString()}
        </p>
        
        <p className="text-purple-200 text-sm mt-2">Total including all fees</p>
      </div>

      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
        <p className="text-slate-400 text-xs mb-2">Price Breakdown</p>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-300">Products</span>
            <span className="text-white">₹{result.recommended.productCost}</span>
          </div>
          {result.recommended.feeBreakdown?.deliveryFee &&(
            <div className="flex justify-between">
              <span className="text-slate-300">Delivery</span>
              <span className="text-white">₹{result.recommended.feeBreakdown.deliveryFee}</span>
            </div>
          )}
          {result.recommended.feeBreakdown?.platformFee &&  (
            <div className="flex justify-between">
              <span className="text-slate-300">Platform Fee</span>
              <span className="text-white">₹{result.recommended.feeBreakdown.platformFee}</span>
            </div>
          )}
          {result.recommended.feeBreakdown?.freeDeliveryApplied && (
            <div className="text-green-400 text-xs">✨ Free delivery applied</div>
          )}
        </div>
      </div>

      {hasAlternative && result.savings > result.recommended.totalCost * 0.01 && (
        <div className="bg-white/5 backdrop-blur-lg rounded-xl p-4 border border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown size={16} className="text-yellow-400" />
            <span className="text-slate-400 text-sm">Alternative</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-white text-sm">Split Cart Strategy</span>
            <span className="text-white font-mono">
              ₹{alternativeCost.toLocaleString()} 
              <span className="text-red-400 text-xs ml-2">(+₹{result.savings})</span>
            </span>
          </div>
          <p className="text-slate-500 text-xs mt-2">
            Not worth the extra effort
          </p>
        </div>
      )}

      <button
        onClick={() => setShowDetails(!showDetails)}
        className="w-full bg-white/5 backdrop-blur-lg rounded-xl p-3 border border-white/10 flex justify-between items-center hover:bg-white/10 transition-colors"
      >
        <span className="text-slate-400 text-sm">📋 Product Details</span>
        {showDetails ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      {showDetails && (
        <div className="bg-white/5 backdrop-blur-lg rounded-xl p-4 border border-white/10 space-y-3">
          {(result.shoppingPlan || []).map((item) => (
            <div key={item.product} className="flex justify-between items-center">
              <div>
                <p className="text-white font-medium capitalize">{item.product}</p>
                <p className="text-xs text-purple-300">
                  {item.platform} × {item.quantity}
                </p>
              </div>
              <div className="text-right">
                <p className="text-green-400 font-mono">₹{item.price} × {item.quantity}</p>
                <p className="text-white text-sm font-bold">= ₹{item.price}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
