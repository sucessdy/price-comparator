const { parseQuery, INTENT } = require("../utils/queryParser");
const { planShoppingQuery } = require("./query/queryPlanner");
const {
  compareProduct,
  optimizeCart,
  compareProducts,
} = require("./productService");

const { recommendationService } = require("./recommendationService");

exports.processMessage = async (message) => {
  const {
    intent,
    products,
    category,
    searchQuery,
    budget,
    priority,
    quantity,
    constraints,
    originalQuery,
  } = parseQuery(message);

  switch (intent) {
    // =====================================================
    // COMPARE
    // =====================================================

    case INTENT.COMPARE: {
      if (products.length === 1) {
        const comparison = await compareProduct(products[0]);

        return {
          success: true,
          intent,
          type: "comparison",
          message: `Here are the best prices for ${products[0]}.`,
          data: comparison,
        };
      }

      if (products.length >= 2) {
        const comparison = await compareProducts(products);

        console.log(
          "PRODUCTS:",
          products,
          Array.isArray(products)
        );

        return {
          success: true,
          intent,
          type: "comparison",
          message: `Here's how ${products.join(" vs ")} compare.`,
          data: comparison.details,
        };
      }

      return {
        success: false,
        intent,
        type: "comparison",
        message:
          "Please tell me which product(s) you want to compare.",
        data: null,
      };
    }

    // =====================================================
    // OPTIMIZE CART
    // =====================================================

    case INTENT.OPTIMIZE_CART: {
      const optimiseCart = await optimizeCart(products);

      return {
        success: true,
        intent,
        type: "shopping-plan",
        message: "I found the cheapest combination for your cart.",
        data: optimiseCart,
      };
    }

    // =====================================================
    // SHOPPING NEED
    // =====================================================

    // case INTENT.SHOPPING_NEED: {
    //   console.log("🧠 SHOPPING REQUEST:", {
    //     originalQuery,
    //     searchQuery,
    //     category,
    //     budget,
    //     quantity,
    //     priority,
    //     constraints,
    //   });

    //   const recommendations = await recommendationService({
    //     category,
    //     searchQuery,
    //     budget,
    //     quantity,
    //     priority,
    //     constraints,
    //   });

    //   return {
    //     success: true,
    //     intent,
    //     type: "recommendation",
    //     message: "I found some options for you.",
    //     data: recommendations,
    //     context: {
    //       originalQuery,
    //       searchQuery,
    //       category,
    //       budget,
    //       quantity,
    //       priority,
    //       constraints,
    //     },
    //   };
    // }

    case INTENT.SHOPPING_NEED: {
  // Start with the existing parser's values.
  // These remain our fallback if Gemini fails.
  let finalSearchQuery = searchQuery;
  let finalBudget = budget;
  let finalQuantity = quantity;
  let finalPriority = priority;
  let queryPlan = null;

  try {
    queryPlan = await planShoppingQuery(message);

    console.log("🧠 GEMINI QUERY PLAN:", queryPlan);

    // Ask the user only when the product itself is ambiguous.
    if (queryPlan.needsClarification) {
      return {
        success: true,
        intent,
        type: "text",
        message:
          queryPlan.clarificationQuestion ||
          "Could you clarify which product you're looking for?",
        data: null,
        context: {
          originalQuery: originalQuery || message,
        },
      };
    }

    // Use the planner's improved search query.
    if (queryPlan.searchQuery?.trim()) {
      finalSearchQuery = queryPlan.searchQuery.trim();
    }

    // Preserve existing parser values if Gemini omits a value.
    if (queryPlan.budget != null) {
      finalBudget = queryPlan.budget;
    }

    if (queryPlan.quantity != null) {
      finalQuantity = queryPlan.quantity;
    }

    // Keep an existing explicit priority if Gemini returns
    // the default "relevance" priority.
    if (
      queryPlan.priority &&
      queryPlan.priority !== "relevance"
    ) {
      finalPriority = queryPlan.priority;
    }
  } catch (error) {
    console.error(
      "⚠️ Query planner failed; using existing parser:",
      error.response?.data || error.message
    );
  }

  console.log("🛍️ SHOPPING REQUEST:", {
    originalQuery,
    searchQuery: finalSearchQuery,
    category,
    budget: finalBudget,
    quantity: finalQuantity,
    priority: finalPriority,
    constraints,
  });

  const recommendations = await recommendationService({
    category,
    searchQuery: finalSearchQuery,
    budget: finalBudget,
    quantity: finalQuantity,
    priority: finalPriority,
    constraints,
  });

  return {
    success: true,
    intent,
    type: "recommendation",
    message: "I found some options for you.",
    data: recommendations,
    context: {
      originalQuery: originalQuery || message,
      searchQuery: finalSearchQuery,
      category,
      budget: finalBudget,
      quantity: finalQuantity,
      priority: finalPriority,
      constraints,
      queryPlan,
    },
  };
} 

    // =====================================================
    // GENERAL
    // =====================================================

    case INTENT.GENERAL: {
      return {
        success: true,
        intent,
        type: "text",
        message:
          "Hi! I can help you compare products, find recommendations, and optimize your shopping plan.",
        data: null,
      };
    }

    // =====================================================
    // UNKNOWN
    // =====================================================

    default: {
      return {
        success: false,
        intent: INTENT.UNKNOWN,
        type: "text",
        message:
          "Sorry, I couldn't understand your request.",
        data: null,
      };
    }
  }
};