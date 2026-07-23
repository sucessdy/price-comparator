// ======================================================
// BASE TYPES
// ======================================================

export interface Product {
  _id: string;
  name: string;
  price: number;
  platform: string;
  priceHistory?: PriceHistoryEntry[];
  createdAt?: Date;
  updatedAt?: Date;
}

export type Platform = 
  | "amazon" 
  | "flipkart" 
  | "croma" 
  | "vijay sales" 
  | "ajio" 
  | "bigbasket" 
  | "blinkit"
  | "zepto"
  | "myntra"
  | "reliance digital"
  | "tatacliq"
  | "snapdeal"
  | "meesho"
  | "jiomart"
  | "paytm mall"
  | "shopclues"
  | string;

export interface PriceHistoryEntry {
  price: number;
  date: Date;
}

// ======================================================
// CART ITEMS
// ======================================================

export interface CartItem {
  name: string;
  quantity: number;
}

// ======================================================
// COMPARE PRODUCT
// ======================================================

export interface ProductComparison {
  product: string;
  prices: Record<string, number>;
  cheapest: {
    platform: string;
    price: number;
  };
}

// ======================================================
// FEE BREAKDOWN
// ======================================================

export interface FeeBreakdown {
  productCost: number;
  deliveryFee: number;
  platformFee: number;
  freeDeliveryApplied: boolean;
}

// ======================================================
// SPLIT CART ITEMS
// ======================================================

export interface SplitCartItem {
  available: boolean;
  platform?: Platform;
  price?: number;
  quantity?: number;
  productCost?: number;
  finalCost?: number;
  feeBreakdown?: FeeBreakdown;
  message?: string;
}

export interface SplitCart {
  items: Record<string, SplitCartItem>;
  totalCost: number;
  hasMissingItems: boolean;
}

// ======================================================
// SINGLE PLATFORM
// ======================================================

export interface SinglePlatform {
  platform: string;
  totalCost: number;
  productCost?: number;
  feeBreakdown?: FeeBreakdown;
}

// ======================================================
// CART RECOMMENDATION
// ======================================================

export interface CartRecommendation {
  strategy: "single-platform" | "split-cart";
  platform?: string;
  totalCost: number;
  productCost?: number;
  feeBreakdown?: FeeBreakdown;
  details?: Record<string, SplitCartItem>;
}

// ======================================================
// SHOPPING PLAN
// ======================================================

export interface ShoppingPlanItem {
  product: string;
  platform: string;
  price: number;
  quantity: number;
  totalPrice: number;
  productCost?: number;
  finalCost?: number;
  fees?: FeeBreakdown;
  savings?: number;
}

// ======================================================
// PLATFORM ALTERNATIVE
// ======================================================

export interface PlatformAlternative {
  platform: string;
  totalCost: number;
  productCost: number;
  feeBreakdown?: FeeBreakdown;
}

// ======================================================
// OPTIMIZE CART RESPONSE (FIXED)
// ======================================================

export interface OptimizeCartResponse {
  recommended: CartRecommendation | null;
  savings: number;
  missingProducts: string[];
  shoppingPlan: ShoppingPlanItem[];
  alternatives: PlatformAlternative[];  // ← Added this!
  summary: {
    totalItems: number;
    uniqueProducts: number;
    platformsConsidered: number;
  };
}

// ======================================================
// API RESPONSE WRAPPER
// ======================================================

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
