// api/productApi.ts
import axios from "axios";
import type { 
  ApiResponse, 
  ProductComparison, 
  OptimizeCartResponse, 
  CartItem
} from "../types/product";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export const compareProduct = async (product: string): Promise<ApiResponse<ProductComparison>> => {
  const response = await api.get<ApiResponse<ProductComparison>>(
    "/compare",
    { params: { product } },
  );
  return response.data;
};

export const optimizeCart = async (products: CartItem[]): Promise<ApiResponse<OptimizeCartResponse>> => {
  const response = await api.post<ApiResponse<OptimizeCartResponse>>(
    "/optimize-cart",
    { products }
  );
  return response.data;
};

export default api;