
// utils/queryParser.js

const INTENT = {
    COMPARE: "COMPARE",
    OPTIMIZE_CART: "OPTIMIZE_CART",
    SHOPPING_NEED: "SHOPPING_NEED",
    UNKNOWN: "UNKNOWN",
};

const SHOPPING_WORDS =
    /\b(i|need|want|buy|get|find|looking|searching|for|me|please)\b/gi;

const BUDGET_PATTERNS = [
    /(?:under|below|within|upto|up\s+to)\s*₹?\s*(\d+(?:\.\d+)?)/i,

    /(?:budget\s*(?:is|of)?|for)\s*₹?\s*(\d+(?:\.\d+)?)/i,
];

function parseShoppingNeed(query) {
    let budget = null;

    for (const pattern of BUDGET_PATTERNS) {
        const match = query.match(pattern);

        if (match) {
            budget = Number(match[1]);
            break;
        }
    }

    if (budget === null) {
        return null;
    }

    const category = query
        .replace(BUDGET_PATTERNS[0], "")
        .replace(BUDGET_PATTERNS[1], "")
        .replace(SHOPPING_WORDS, "")
        .replace(/₹?\s*\d+(?:\.\d+)?/g, "")
        .replace(/\s+/g, " ")
        .trim();

    if (!category) {
        return null;
    }
 
    return {
        intent: INTENT.SHOPPING_NEED,
        products: [],
        category,
        budget,
    };
}

function parseQuery(message = "") {
     console.log("QUERY:", message);
    const query = message.trim().toLowerCase();

    if (!query) {
        return {
            intent: INTENT.UNKNOWN,
            products: [],
        };
    }

    // ----------------------------------
    // 1. Shopping Need
    // ----------------------------------

    const shoppingNeed = parseShoppingNeed(query);

    if (shoppingNeed) {
        return shoppingNeed;
    }

    // ----------------------------------
    // 2. Clean query
    // ----------------------------------

    const cleanedQuery = query
        .replace(
            /\b(compare|price|prices|find|search|need|want|buy|get|show|me|please|for)\b/g,
            ""
        )
        .replace(/\s+/g, " ")
        .trim();

    if (!cleanedQuery) {
        return {
            intent: INTENT.UNKNOWN,
            products: [],
        };
    }

    // ----------------------------------
    // 3. Extract products
    // ----------------------------------

    const products = cleanedQuery
        .split(/,|\band\b/)
        .map((item) => item.trim())
        .filter(Boolean);

    if (!products.length) {
        return {
            intent: INTENT.UNKNOWN,
            products: [],
        };
    }

    // ----------------------------------
    // 4. Compare / Cart
    // ----------------------------------

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