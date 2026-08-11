const { parseQuery, INTENT } = require("../utils/queryParser");
const { compareProduct, optimizeCart } = require("./productService");
const { recommendationService } = require("./recommendationService");

exports.processMessage = async (message) => {
  const { intent, products , category, budget } = parseQuery(message);
  switch (intent) {
    case INTENT.COMPARE: {
      const comparison = await compareProduct(products[0]);
      return {
        success: true,
        intent,
        type: "comparison",
        message: `Here are the best price for ${products[0]}.`,
        data: comparison,
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
        budget
      });

      return {
        success: true,
        intent,
        type: "recommendation",
        message: "I found some options for you.",
        data: recommendations,
      };
    }

    default: {
      return {
        success: false,
        intent: INTENT.UNKNOWN,
        type: "text",
        message: "Sorry, I couldn't understand your request.",
        data: null,
      };
    }
  }
};
