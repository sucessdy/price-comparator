const { parseQuery, INTENT } = require("../utils/queryParser");
const {
  compareProduct,
  optimizeCart,
  compareProducts,
} = require("./productService");
const { recommendationService } = require("./recommendationService");

exports.processMessage = async (message) => {
  const { intent, products, category, budget , priority } = parseQuery(message);
  switch (intent) {
    case INTENT.COMPARE: {
      if (products.length === 1) {
        const comparison = await compareProduct(products[0]);
        return {
          success: true,
          intent,
          type: "comparison",
          message: `Here are the best price for ${products[0]}.`,
          data: comparison,
        };
      }

      if (products.length >= 2) {
        const comparison = await compareProducts(products);
        console.log("PRODUCTS:", products, Array.isArray(products));
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
        message: "Please tell me which product(s) you want to compare.",
        data: null,
      };
    }

    case INTENT.OPTIMIZE_CART: {
      const optimiseCart = await optimizeCart(products);
      return {
        success: true,
        intent,
        type: "shopping-plan",
        message: "I found the cheapest combination for your Cart.",
        data: optimiseCart,
      };
    }
    case INTENT.SHOPPING_NEED: {
      const recommendations = await recommendationService({
        category,
        budget,
        priority 
      });

      return {
        success: true,
        intent,
        type: "recommendation",
        message: "I found some options for you.",
        data: recommendations,
        context: {
    category,
    budget,
  },
      };
    }

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

    default: {
      return {
        success: false,
        intent: INTENT.UNKNOWN,
        type: "text",
        message: "Sorry, I couldn't understand your request.",
        data: null ,
      };
    }
  }
};
