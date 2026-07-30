// utils/queryParser.js

const INTENT = {
    COMPARE: "COMPARE",
    OPTIMIZE_CART: "OPTIMIZE_CART",
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