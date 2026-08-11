// utils/queryParser.js

const INTENT = {
    COMPARE: "COMPARE",
    OPTIMIZE_CART: "OPTIMIZE_CART",
    SHOPPING_NEED: "SHOPPING_NEED",
    UNKNOWN: "UNKNOWN",
};

function parseQuery(message = "") {
    const query = message.trim().toLowerCase();

    if (!query) {
        return {
            intent: INTENT.UNKNOWN,
            products: [],
        };
    }
    const budgetMatch = query.match(/(?:under|below|within|budget(?:\s+of)?|upto|up\s+to)\s*₹?\s*(\d+(?:\.\d+)?)/) ;
    if (budgetMatch){
        const budget = Number(budgetMatch[1]) ; 


        const category = query.replace(/\b(i|need|want|buy|get|find|looking|for|under|below|within|budget|of|upto|up|to)\b/g,
        "").replace(/₹?\s*\d+(?:\.\d+)?/g, "").replace(/\s+/g, " ")
      .trim();

      if (category){ 
        return { 
            intent : INTENT.SHOPPING_NEED, 
            products :[],
            category,
            budget,

        }
      }

    }


    const cleanedQuery = query
        .replace(
           /\b(compare|price|prices|find|search|need|want|buy|get|show|me|please|for)\b/g,
      ""
        )
        .replace(/\s+/g, " ")
        .trim();

    const products = cleanedQuery
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

    if (products.length === 0) {
        return {
            intent: INTENT.UNKNOWN,
            products: [],
        };
    }

    return {
        intent:
            products.length === 1
                ? INTENT.COMPARE
                : INTENT.OPTIMIZE_CART,
        products,
    };
}

module.exports = {
    parseQuery,
    INTENT,
};