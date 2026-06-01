export interface Product {
  _id: string;
  name: string;
  price: number;
  platform: string;
}
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
}

export interface OptimizeCartResponse {
  recommend: CartRecommendation;
  saving: number;
}

// api type 
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}