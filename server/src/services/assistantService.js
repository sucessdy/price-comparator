const { parseQuery, INTENT } = require("../utils/queryParser");
const { compareProduct, optimizeCart } = require("./productService");
const {recommadationServices} = require("../services/recommendationService")
exports.processMessage = async (message) => {
  const { intent, products } = parseQuery(message);
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
        type : "shopping-plan" ,
        message: "I found the cheapest combination for your Cart.",
        data: optimiseCart,
      };
    }
case INTENT.SHOPPING_NEED: {
  const shoppingNeed = await recommadationServices({    category: products[0],
    budget: null,})
}

    default: {
      return {
        success: false,
        intent: INTENT.UNKNOWN,
        type : "text",
        message: "Sorry, I couldn't understand your request.",
        data: null,
      };
    }
  }
};


