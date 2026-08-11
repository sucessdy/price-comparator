// import { compareProduct, optimizeCart } from "../api/productApi";
// import type {
//   CartItem,
//   OptimizeCartResponse,
//   ProductComparison,
// } from "../types/product";
// import { formatCurrency } from "../utils/formatCurrency";



// import {
//   INTENT_TYPES,
//   type IntentType,
// } from "../components/assistant/assistant.types";

// export interface SendMessageResponse {
//   message: string;
//   intent: IntentType;
//   budget?: number;
//   priority: string;
//   data: ProductComparison | OptimizeCartResponse;
// }

// const parseCartItems = (message: string): CartItem[] =>
//   message
//     .replace(
//       /^(compare|find|show|price|prices|optimize|optimise|cart|for|of)\s+/i,
//       "",
//     )
//     .split(/,|\band\b/i)
//     .map((item) => item.trim())
//     .filter(Boolean)
//     .map((item) => {
//       const match = item.match(/^(\d+)\s+(.+)$/);
//       return {
//         name: (match ? match[2] : item).trim().toLowerCase(),
//         quantity: match ? Number(match[1]) : 1,
//       };
//     });

// const comparisonMessage = (comparison: ProductComparison): string => {
//   const prices = Object.entries(comparison.prices)
//     .sort(([, firstPrice], [, secondPrice]) => firstPrice - secondPrice)
//     .map(([platform, price]) => `${platform}: ${formatCurrency(price)}`)
//     .join("\n");

//   return `Best price for ${comparison.product}: ${formatCurrency(comparison.cheapest.price)} on ${comparison.cheapest.platform}.\n\nLive prices:\n${prices}`;
// };

// const cartMessage = (result: OptimizeCartResponse): string => {
//   if (!result.recommended) {
//     return "I found prices, but couldn't create a complete shopping plan for those items.";
//   }

//   const strategy =
//     result.recommended.strategy === "single-platform"
//       ? `Buy everything from ${result.recommended.platform}`
//       : "Split the cart across stores";
//   const plan = result.shoppingPlan
//     .map(
//       (item) =>
//         `• ${item.quantity} × ${item.product} — ${item.platform} (${formatCurrency(item.totalPrice)})`,
//     )
//     .join("\n");
//   const missing = result.missingProducts.length
//     ? `\n\nNot found: ${result.missingProducts.join(", ")}`
//     : "";

//   return `${strategy} for ${formatCurrency(result.recommended.totalCost)}.${result.savings > 0 ? ` This saves ${formatCurrency(result.savings)}.` : ""}\n\nShopping plan:\n${plan}${missing}`;
// };

// export async function sendAssistantMessage(
//   message: string,
// ): Promise<SendMessageResponse> {
//   const products = parseCartItems(message);

//   if (!products.length) {
//     throw new Error(
//       "Enter a product to compare, or a comma-separated cart such as ‘milk, bread, 2 eggs’.",
//     );
//   }

//   if (products.length === 1 && products[0].quantity === 1) {
//     const response = await compareProduct(products[0].name);
//     return {
//       message: comparisonMessage(response.data),
//       intent: INTENT_TYPES.COMPARE,
//       priority: "lowest-price",
//       data: response.data,
//     };
//   }

//   const response = await optimizeCart(products);
//   return {
//     message: cartMessage(response.data),
//     intent: INTENT_TYPES.OPTIMIZE_CART,
//     priority: "lowest-total",
//     data: response.data,
//   };
// }
import api from "../api/productApi";

export async function sendAssistantMessage(message: string) {
  const response = await api.post("/api/assistant/chat", {
    message,
  });

  return response.data;
}