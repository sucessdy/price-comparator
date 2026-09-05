// utils/queryParser.js

const INTENT = {
    COMPARE: "COMPARE",
    OPTIMIZE_CART: "OPTIMIZE_CART",
    SHOPPING_NEED: "SHOPPING_NEED",
    GENERAL: "GENERAL",
    UNKNOWN: "UNKNOWN",
};

const SHOPPING_WORDS = /\b(i|need|want|buy|get|find|looking|searching|for|me|please)\b/gi;

const BUDGET_PATTERNS = [
    /(?:under|below|within|upto|up\s+to)\s*₹?\s*(\d+(?:\.\d+)?)/i,
    /(?:budget\s*(?:is|of)?|for)\s*₹?\s*(\d+(?:\.\d+)?)/i,
];

// ---------- DETECTION FUNCTIONS ----------

function isGeneralQuery(query) {
    const generalPattern = [
        /^(hi|hello|hey)$/i,
        /^(thanks|thank you)$/i,
        /^what can you do$/i,
        /^how are you$/i,
        /^help$/i,
    ];
    return generalPattern.some((pattern) => pattern.test(query));
}

function isComparisonQuery(query) {
    // Check if user wants to compare products
    const comparePatterns = [
        /\bcompare\b/i,
        /\bvs\b/i,
        /\bversus\b/i,
        /\bdifference between\b/i,
        /\bwhich is better\b/i,
        /\bprice (?:difference|comparison)\b/i,
    ];
    return comparePatterns.some((pattern) => pattern.test(query));
}

function isOptimizationQuery(query) {
    // Check if user wants to optimize their cart
    const optimizePatterns = [
        /\boptimize\b/i,
        /\bimprove\b/i,
        /\bbetter\s+(?:deal|price|option)\b/i,
        /\brecommend\b/i,
        /\bsuggest\b/i,
        /\bbest\s+(?:price|deal|option)\b/i,
    ];
    return optimizePatterns.some((pattern) => pattern.test(query));
}

// ---------- EXTRACTION FUNCTIONS ----------

function extractBudget(query) {
    for (const pattern of BUDGET_PATTERNS) {
        const match = query.match(pattern);
        if (match) {
            return Number(match[1]);
        }
    }
    return null;
}

function extractProducts(query) {
    // Remove common words and keep product names
    const cleaned = query
        .replace(/^(i|need|want|buy|get|find|looking for|searching for)\s*/i, '')
        .replace(/under ₹?\d+(?:\.\d+)?/i, '')
        .replace(/budget ₹?\d+(?:\.\d+)?/i, '')
        .replace(/for ₹?\d+(?:\.\d+)?/i, '')
        .replace(/\b(please|me|for|and|or)\b/gi, '')
        .trim();

    if (!cleaned) return [];

    // Split by commas or "and" and clean up
    const products = cleaned
        .split(/,|\band\b/)
        .map(item => item.trim())
        .filter(item => item.length > 0 && !/^(under|budget|₹|for)$/i.test(item));

    return products;
}

function extractCategory(query) {
    // Remove budget and shopping words, keep the category
    let category = query
        .replace(BUDGET_PATTERNS[0], '')
        .replace(BUDGET_PATTERNS[1], '')
        .replace(SHOPPING_WORDS, '')
        .replace(/₹?\s*\d+(?:\.\d+)?/g, '')
        .replace(/\s+/g, ' ')
        .trim();

    // If category is too generic or empty, return null
    if (!category || category.length < 2) {
        return null;
    }

    return category;
}

// ---------- MAIN PARSER ----------

function parseQuery(message = "") {
    console.log("📝 Parsing Query:", message);
    const query = message.trim();

    // 1. Check for General queries
    if (isGeneralQuery(query)) {
        console.log("✅ GENERAL QUERY DETECTED");
        return {
            intent: INTENT.GENERAL,
            products: [],
            message: query,
        };
    }

    // 2. Check for Comparison queries
    if (isComparisonQuery(query)) {
                console.log("✅ COMPARE QUERY DETECTED");
        const products = extractProducts(query);
        if (products.length > 0) {
            return {
                intent: INTENT.COMPARE,
                products: products,
                message: query,
            };
        }
              
        // If comparison query but not enough products, treat as general
        return {
            
            intent: INTENT.GENERAL,
            products: [],
            message: query,
        };
    }

    // 3. Check for Optimization queries
    if (isOptimizationQuery(query) || query.includes('cart') || query.includes('plan')) {
                console.log("✅ OPTIMSE QUERY DETECTED");
        const products = extractProducts(query);
        return {
            intent: INTENT.OPTIMIZE_CART,
            products: products.length > 0 ? products : [],
            message: query,
        };
    }

    // 4. Check for Shopping Need with budget
    const budget = extractBudget(query);
    if (budget !== null) {
        const category = extractCategory(query);
        if (category) {
            return {
                intent: INTENT.SHOPPING_NEED,
                products: [],
                category: category,
                budget: budget,
                message: query,
            };
        }
    }

    // 5. General Shopping Need (no budget)
    if (isShoppingQuery(query)) {
        const products = extractProducts(query);
        const category = extractCategory(query);
        
        if (products.length > 0) {
            // If specific products mentioned, treat as product search
            return {
                intent: INTENT.SHOPPING_NEED,
                products: products,
                category: category || 'products',
                budget: null,
                message: query,
            };
        } else if (category) {
            // If only category mentioned
            return {
                intent: INTENT.SHOPPING_NEED,
                products: [],
                category: category,
                budget: null,
                message: query,
            };
        }
    }

    // 6. Extract products from general query
    const products = extractProducts(query);
    if (products.length > 0) {
        // If single product, could be comparison or shopping
        if (products.length === 1) {
            return {
                intent: INTENT.COMPARE,
                products: products,
                message: query,
            };
        } else {
            return {
                intent: INTENT.OPTIMIZE_CART,
                products: products,
                message: query,
            };
        }
    }

    // 7. Unknown
    return {
        intent: INTENT.UNKNOWN,
        products: [],
        message: query,
    };
}

function isShoppingQuery(query) {
    const shoppingDetect = /\b(buy|need|want|get|find|looking for|searching for)\b/i;
    return shoppingDetect.test(query);
}

module.exports = {
    parseQuery,
    INTENT,
};