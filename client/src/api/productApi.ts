import axios from "axios";
import type { ApiResponse, ProductComparison } from "../types/product";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export const compareProduct = async (
  product: string
) => {
  
  const response =
  await api.get<ApiResponse<ProductComparison>>(
    `/compare?product=${product}`
  );

  return response.data;
};

export default api;