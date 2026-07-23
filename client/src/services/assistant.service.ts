import { compareProduct, optimizeCart } from "../api/productApi";
import type { CartItem, OptimizeCartResponse, ProductComparison } from "../types/product";

interface SendMessageResponse {
  message: string;
  intent?: string;
  budget?: number;
  priority: string;
}

const formatCurrency = (value: number): string =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(value);

const parseCartItems = (message: string): CartItem[] =>
  message
    .replace(/^(compare|find|show|price|prices|optimize|optimise|cart|for|of)\s+/i, "")
    .split(/,|\band\b/i)
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => {
      const match = item.match(/^(\d+)\s+(.+)$/);
      return {
        name: (match ? match[2] : item).trim().toLowerCase(),
        quantity: match ? Number(match[1]) : 1,
      };
    });

const comparisonMessage = (comparison: ProductComparison): string => {
  const prices = Object.entries(comparison.prices)
    .sort(([, firstPrice], [, secondPrice]) => firstPrice - secondPrice)
    .map(([platform, price]) => `${platform}: ${formatCurrency(price)}`)
    .join("\n");

  return `Best price for ${comparison.product}: ${formatCurrency(comparison.cheapest.price)} on ${comparison.cheapest.platform}.\n\nLive prices:\n${prices}`;
};

const cartMessage = (result: OptimizeCartResponse): string => {
  if (!result.recommended) {
    return "I found prices, but couldn't create a complete shopping plan for those items.";
  }

  const strategy = result.recommended.strategy === "single-platform"
    ? `Buy everything from ${result.recommended.platform}`
    : "Split the cart across stores";
  const plan = result.shoppingPlan
    .map((item) => `• ${item.quantity} × ${item.product} — ${item.platform} (${formatCurrency(item.totalPrice)})`)
    .join("\n");
  const missing = result.missingProducts.length
    ? `\n\nNot found: ${result.missingProducts.join(", ")}`
    : "";

  return `${strategy} for ${formatCurrency(result.recommended.totalCost)}.${result.savings > 0 ? ` This saves ${formatCurrency(result.savings)}.` : ""}\n\nShopping plan:\n${plan}${missing}`;
};

export async function sendMessage(
  message: string,
  // _userName: string,
  // _budget: number,
): Promise<SendMessageResponse> {
  const products = parseCartItems(message);

  if (!products.length) {
    throw new Error("Enter a product to compare, or a comma-separated cart such as ‘milk, bread, 2 eggs’.");
  }

  if (products.length === 1 && products[0].quantity === 1) {
    const response = await compareProduct(products[0].name);
    return {
      message: comparisonMessage(response.data),
      intent: "price-comparison",
      priority: "lowest-price",
    };
  }

  const response = await optimizeCart(products);
  return {
    message: cartMessage(response.data),
    intent: "cart-optimization",
    priority: "lowest-total",
  };
}
