import axios from "axios"
import {type ApiResponse } from "../types/product"
import {type Recommendation } from "../components/assistant/assistant.types"

const api = axios.create({
baseURL : import.meta.env.VITE_API_URL || "/api", 
headers: {
    "Content-Type": "application/json",
  },
})
export const assistantApi = async (message: string) => {
  try {
    const response = await api.post<ApiResponse<Recommendation>>(
      "/assistant/chat",
      { message }
    );
    return response.data;
  } catch (error) {
    console.error("Assistant API error:", error);
    throw error;
  }
};
export default api