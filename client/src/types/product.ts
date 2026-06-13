export interface Product {
  _id: string;
  name: string;
  price: number;
  platform: string;
}
export type Platform = 
  | "amazon" 
  | "flipkart" 
  | "croma" 
  | "vijay sales" 
  | "ajio" 
  | "bigbasket" 
  | "blinkit"
  | string; 

export interface ProductComparison {
  product: string;
  prices: Record<string, number>;
  cheapest: {
    platform: string;
    price: number;
  };
}

export interface CartRecommendation {
  strategy: string;
  platform?: string;
  totalCost: number;
    details?: Record<string, SplitCartItem>;
}

export interface SplitCartItem {
  available: boolean;
  platform?: Platform;
  price?: number;
  message?: string;
}
export interface OptimizeCartResponse {
  recommended: CartRecommendation;
  savings: number;
  missingProducts: string[];
   splitCart: SplitCart;
  singlePlatform: SinglePlatform | null;
}

export interface CartItem {
  name: string;
  quantity: number;
}

// api type 
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}


export interface SplitCartItem {
  available: boolean;
  platform?: string;
  price?: number;
  message?: string;
}

export interface SplitCart {
  items: Record<string, SplitCartItem>;
  totalCost: number;
  hasMissingItems: boolean;
}

export interface SinglePlatform {
  platform: string;
  totalCost: number;
}


export interface FeeBreakdown {
  productCost: number;
  deliveryFee: number;
  platformFee: number;
  freeDeliveryApplied: boolean;
}

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

export interface CartRecommendation {
  strategy: string;
  platform?: string;
  totalCost: number;
  productCost?: number;
  feeBreakdown?: FeeBreakdown;
  details?: Record<string, SplitCartItem>;
}

export interface OptimizeCartResponse {
  recommended: CartRecommendation;
  savings: number;
  missingProducts: string[];
  shoppingPlan: ShoppingPlanItem[];
  summary: {
    totalItems: number;
    uniqueProducts: number;
    platformsConsidered: number;
  };
}

export interface ShoppingPlanItem {
  product: string;
  platform: string;
  price: number;
  quantity: number;
  productCost: number;
  finalCost: number;
  savings: number;
}