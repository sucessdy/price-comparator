
const INTENT = {
  COMPARE: "COMPARE",
  OPTIMIZE_CART: "OPTIMIZE_CART",
  SHOPPING_NEED: "SHOPPING_NEED",
  GENERAL: "GENERAL",
  UNKNOWN: "UNKNOWN",
};

// ======================================================
// PATTERNS
// ======================================================

const SHOPPING_WORDS =
  /\b(i'm|im|i|need|want|buy|get|find|looking|looking for|searching|searching for|show me|please|me)\b/gi;

const BUDGET_PATTERNS = [
  /(?:under|below|within|upto|up\s+to)\s*₹?\s*(\d+(?:\.\d+)?)/i,

  /(?:budget\s*(?:is|of)?|for)\s*₹?\s*(\d+(?:\.\d+)?)/i,
];

// ======================================================
// NORMALIZATION
// ======================================================

function normalizeQuery(message = "") {
  return message
    .trim()
    .replace(/\s+/g, " ");
}



function isGeneralQuery(query) {
  const generalPatterns = [
    /^(hi|hello|hey)$/i,
    /^(thanks|thank you)$/i,
    /^what can you do$/i,
    /^how are you$/i,
    /^help$/i,
  ];

  return generalPatterns.some((pattern) => pattern.test(query));
}

function isComparisonQuery(query) {
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
  const optimizePatterns = [
    /\boptimize\b/i,
    /\boptimise\b/i,
    /\bshopping plan\b/i,
    /\bcart\b/i,
    /\bcheapest combination\b/i,
    /\bcheapest way\b/i,
  ];

  return optimizePatterns.some((pattern) => pattern.test(query));
}

function isShoppingQuery(query) {
  const shoppingDetection =
    /\b(buy|need|want|get|find|show|looking for|searching for)\b/i;

  if (shoppingDetection.test(query)) return true;

  // In a shopping assistant, a bare product phrase ("chocolate ice cream")
  // is also a search request. Leave question-like messages for the general
  // handler instead of sending them to product search.
  return !/^(what|why|how|when|where|who|can|could|would|is|are|do|does)\b/i.test(query);
}

function detectIntent(query) {
  if (isGeneralQuery(query)) {
    return INTENT.GENERAL;
  }

  if (isComparisonQuery(query)) {
    return INTENT.COMPARE;
  }

  if (isOptimizationQuery(query)) {
    return INTENT.OPTIMIZE_CART;
  }

  if (isShoppingQuery(query)) {
    return INTENT.SHOPPING_NEED;
  }

  return INTENT.UNKNOWN;
}

// ======================================================
// BUDGET
// ======================================================

function extractBudget(query) {
  for (const pattern of BUDGET_PATTERNS) {
    const match = query.match(pattern);

    if (match) {
      return Number(match[1]);
    }
  }

  return null;
}

// ======================================================
// QUANTITY
// ======================================================

function extractQuantity(query) {
  const quantityPatterns = [
    /\b(\d+)\s+(?:pieces?|pcs?|items?|units?)\b/i,
    /\b(\d+)\s+x\b/i,
    /\bx\s*(\d+)\b/i,
  ];

  for (const pattern of quantityPatterns) {
    const match = query.match(pattern);

    if (match) {
      return Number(match[1]);
    }
  }

  return null;
}

// ======================================================
// PRIORITY
// ======================================================

function extractPriority(query) {
  const priorityPatterns = [
    {
      pattern: /\b(cheapest|lowest price|low price|save money|best deal)\b/i,
      value: "lowest-price",
    },
    {
      pattern: /\b(best quality|high quality|quality|better quality)\b/i,
      value: "quality",
    },
    {
      pattern:
        /\b(fast delivery|quick delivery|earliest delivery|fastest delivery)\b/i,
      value: "delivery",
    },
  ];

  for (const { pattern, value } of priorityPatterns) {
    if (pattern.test(query)) {
      return value;
    }
  }

  return null;
}

// ======================================================
// SEARCH QUERY
// ======================================================

function extractSearchQuery(query) {
  let searchQuery = query;

  searchQuery = searchQuery.replace(
    /^(compare|what.*compare|difference between|which is better)\s*/i,
    ""
  );

searchQuery = searchQuery.replace(
  /^(?:i'm|im|i)\s+(?:need|want|would like|am looking for|want to buy|need to buy)\s+/i,
  ""
);

searchQuery = searchQuery.replace(
  /^(?:(?:to\s+)?buy|need|want|get|find|show me|looking for|searching for|please)\s+/i,
  ""
);

  searchQuery = searchQuery.replace(
    /(?:under|below|within|upto|up to)\s*₹?\s*\d+(?:\.\d+)?/gi,
    ""
  );

  searchQuery = searchQuery.replace(
    /(?:budget\s*(?:is|of)?|for)\s*₹?\s*\d+(?:\.\d+)?/gi,
    ""
  );

  searchQuery = searchQuery.replace(
    /\b(please|thanks)\b/gi,
    ""
  );
  searchQuery = searchQuery.replace(
  /^(?:a|an|the)\s+/i,
  ""
); 

  searchQuery = searchQuery
    .replace(/\s+/g, " ")
    .trim();

  return searchQuery;
}

// ======================================================
// CATEGORY
// ======================================================

function extractCategory(searchQuery) {
  if (!searchQuery) {
    return null;
  }

  return searchQuery.trim().length >= 2
    ? searchQuery.trim()
    : null;
}

// ======================================================
// PRODUCT EXTRACTION
// Used mainly for compare / optimize flows
// ======================================================

function extractProducts(query) {
  let cleaned = query;

  cleaned = cleaned.replace(
    /^(compare|what.*compare|difference between|which is better)\s*/i,
    ""
  );

  cleaned = cleaned.replace(/\b(vs|versus)\b/gi, ",");

  cleaned = cleaned.replace(
    /^(i|need|want|buy|get|find|show me|looking for|searching for|please)\s+/i,
    ""
  );

  cleaned = cleaned.replace(
    /(?:under|below|within|upto|up to)\s*₹?\s*\d+(?:\.\d+)?/gi,
    ""
  );

  cleaned = cleaned.replace(
    /(?:budget\s*(?:is|of)?|for)\s*₹?\s*\d+(?:\.\d+)?/gi,
    ""
  );

  cleaned = cleaned
    .replace(/\s+/g, " ")
    .trim();

  if (!cleaned) {
    return [];
  }

  return cleaned
    .split(/,|\band\b/gi)
    .map((item) => item.trim())
    .filter(Boolean);
}

// ======================================================
// CONSTRAINTS
// ======================================================

function extractConstraints(query) {
  const constraints = {};

 

  const colorMatch = query.match(
    /\b(black|white|blue|red|green|pink|brown|grey|gray|yellow|purple|beige)\b/i
  );

  if (colorMatch) {
    constraints.color = colorMatch[1].toLowerCase();
  }



  const materialMatch = query.match(
    /\b(stainless steel|cotton|leather|wooden|plastic|silicone|wool|denim)\b/i
  );

  if (materialMatch) {
    constraints.material = materialMatch[1].toLowerCase();
  }

 

  const styleMatch = query.match(
    /\b(formal|casual|sporty|running|office|party|minimal|classic)\b/i
  );

  if (styleMatch) {
    constraints.style = styleMatch[1].toLowerCase();
  }



  if (/\bwireless\b/i.test(query)) {
    constraints.wireless = true;
  }

  if (/\bbluetooth\b/i.test(query)) {
    constraints.bluetooth = true;
  }



  const skinTypeMatch = query.match(
    /\b(dry skin|oily skin|combination skin|sensitive skin|normal skin)\b/i
  );

  if (skinTypeMatch) {
    constraints.skinType = skinTypeMatch[1]
      .toLowerCase()
      .replace(" skin", "");
  }



  const spfMatch = query.match(/\bspf\s*(\d+)\s*\+?/i);

  if (spfMatch) {
    constraints.minSpf = Number(spfMatch[1]);
  }

  // ----------------------------
  // Use case
  // Example:
  // "nuts for evening snacks"
  // ----------------------------

  const useCaseMatch = query.match(
    /\bfor\s+(.*?)(?=\s+under\b|\s+below\b|\s+within\b|\s+upto\b|$)/i
  );

  if (useCaseMatch) {
    const useCase = useCaseMatch[1].trim();

    if (useCase.length > 2) {
      constraints.useCase = useCase;
    }
  }

  return constraints;
}

// ======================================================
// SHOPPING REQUEST PARSER
// ======================================================

function parseShoppingQuery(query, originalQuery) {
  const budget = extractBudget(query);
  const priority = extractPriority(query);
  const quantity = extractQuantity(query);

  const searchQuery = extractSearchQuery(query);
  const category = extractCategory(searchQuery);
  const constraints = extractConstraints(query);

  return {
    intent: INTENT.SHOPPING_NEED,

    // Preserve exactly what the user asked
    originalQuery,

    // What should actually be sent to search
    searchQuery,

    // Kept for backward compatibility with your existing backend
    category,

    budget,
    quantity,
    priority,

    constraints,

    products: [],

    message: originalQuery,
  };
}

// ======================================================
// COMPARISON PARSER
// ======================================================

function parseComparisonQuery(query, originalQuery) {
  const products = extractProducts(query);

  if (!products.length) {
    return {
      intent: INTENT.GENERAL,
      products: [],
      originalQuery,
      message: originalQuery,
    };
  }

  return {
    intent: INTENT.COMPARE,
    products,
    originalQuery,
    searchQuery: extractSearchQuery(query),
    constraints: extractConstraints(query),
    message: originalQuery,
  };
}

// ======================================================
// OPTIMIZATION PARSER
// ======================================================

function parseOptimizationQuery(query, originalQuery) {
  const products = extractProducts(query);

  return {
    intent: INTENT.OPTIMIZE_CART,
    products,
    originalQuery,
    searchQuery: extractSearchQuery(query),
    constraints: extractConstraints(query),
    budget: extractBudget(query),
    priority: extractPriority(query),
    message: originalQuery,
  };
}

// ======================================================
// MAIN PARSER
// ======================================================

function parseQuery(message = "") {
  console.log("📝 Parsing Query:", message);

  const originalQuery = normalizeQuery(message);

  if (!originalQuery) {
    return {
      intent: INTENT.UNKNOWN,
      products: [],
      originalQuery: "",
      message: "",
    };
  }

  const intent = detectIntent(originalQuery);

  // --------------------------------------------
  // GENERAL
  // --------------------------------------------

  if (intent === INTENT.GENERAL) {
    console.log("✅ GENERAL QUERY DETECTED");

    return {
      intent: INTENT.GENERAL,
      products: [],
      originalQuery,
      message: originalQuery,
    };
  }

  // --------------------------------------------
  // COMPARE
  // --------------------------------------------

  if (intent === INTENT.COMPARE) {
    console.log("✅ COMPARE QUERY DETECTED");

    return parseComparisonQuery(
      originalQuery,
      originalQuery
    );
  }

  // --------------------------------------------
  // OPTIMIZE
  // --------------------------------------------

  if (intent === INTENT.OPTIMIZE_CART) {
    console.log("✅ OPTIMIZE QUERY DETECTED");

    return parseOptimizationQuery(
      originalQuery,
      originalQuery
    );
  }

  // --------------------------------------------
  // SHOPPING NEED
  // --------------------------------------------

  if (intent === INTENT.SHOPPING_NEED) {
    console.log("✅ SHOPPING NEED DETECTED");

    return parseShoppingQuery(
      originalQuery,
      originalQuery
    );
  }



  const searchQuery = extractSearchQuery(originalQuery);

  if (searchQuery) {
    console.log("✅ PRODUCT SEARCH FALLBACK");

    return {
      intent: INTENT.SHOPPING_NEED,
      products: [],
      originalQuery,
      searchQuery,
      category: extractCategory(searchQuery),
      budget: extractBudget(originalQuery),
      quantity: extractQuantity(originalQuery),
      priority: extractPriority(originalQuery),
      constraints: extractConstraints(originalQuery),
      message: originalQuery,
    };
  }

  // --------------------------------------------
  // UNKNOWN
  // --------------------------------------------

  console.log("❓ UNKNOWN QUERY");

  return {
    intent: INTENT.UNKNOWN,
    products: [],
    originalQuery,
    message: originalQuery,
  };
}

// ======================================================
// EXPORTS
// ======================================================

// console.log(
//   JSON.stringify(
//     parseQuery("I need a black formal shirt under ₹1500"),
//     null,
//     2
//   )
// );

// console.log(
//   JSON.stringify(
//     parseQuery("I need wireless headphones with good battery under ₹3000"),
//     null,
//     2
//   )
// );

// console.log(
//   JSON.stringify(
//     parseQuery("I need stainless steel utensils for 4 people under ₹1000"),
//     null,
//     2
//   )
// );

// console.log(
//   JSON.stringify(
//     parseQuery("I need almonds for evening snacks under ₹500"),
//     null,
//     2
//   )
// );

// console.log(
//   JSON.stringify(
//     parseQuery("I need sunscreen SPF 60+ for dry skin under ₹500"),
//     null,
//     2
//   )
// ); 

module.exports = {
  parseQuery,
  INTENT,
  extractConstraints,
  extractBudget,
  extractPriority,
  extractProducts,
  extractSearchQuery,
  extractCategory,
  extractQuantity,
};
