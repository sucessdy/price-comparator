const { parseQuery, INTENT } = require("../utils/queryParser");
const { compareProduct, optimizeCart } = require("./productService");

exports.processMessage = async (message)=> {
  const { intent, products } = parseQuery(message);
  switch (intent) {
    case INTENT.COMPARE: {
      const comparison = await compareProduct(products[0]);
      return {
        success: true,
        intent,
        message: `Here are the best price for ${products[0]}.`,
        data: comparison,
      };
    }

    case INTENT.OPTIMIZE_CART: {
      const optimiseCart = await optimizeCart(products);
      return {
        success: true,
        intent,
        message: "I found the cheapest combination for your Cart.",
        data: optimiseCart,
      };
    }
    default: {
      return {
        success: false,
        intent: INTENT.UNKNOWN,
        message: "Sorry, I couldn't understand your request.",
        data: null,
      };
    }
  }
}


// class AssistantServices {
// async processMessage(message) { 
//     if (!message ||  typeof message !== 'string') {

//     }
// }
// }