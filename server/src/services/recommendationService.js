

const searchProducts = require("./search/searchServices");
const {
  ValidationError,
  NotFoundError,
} = require("../errors/AppError");
const { createOffer } = require("./offer/offerService");

const QUERY_STOP_WORDS = new Set([
  "a", "an", "the", "i", "me", "my", "to", "for", "of", "and",
  "want", "need", "buy", "get", "find", "show", "please", "looking",
  "searching", "gm", "g", "kg", "ml", "l",
]);

function editDistanceAtMostOne(left, right) {
  if (left === right) return true;
  if (Math.abs(left.length - right.length) > 1) return false;

  let i = 0;
  let j = 0;
  let edits = 0;
  while (i < left.length && j < right.length) {
    if (left[i] === right[j]) {
      i += 1;
      j += 1;
      continue;
    }
    edits += 1;
    if (edits > 1) return false;
    if (left.length > right.length) i += 1;
    else if (right.length > left.length) j += 1;
    else {
      i += 1;
      j += 1;
    }
  }
  if (i < left.length || j < right.length) edits += 1;
  return edits <= 1;
}

function queryTerms(query) {
  const normalized = query.toLowerCase()
    .replace(/\b\d+(?:\.\d+)?\s*(?:grams?|gm|g|kilograms?|kg|ml|milliliters?|liters?|l)\b/gi, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
  return [...new Set(normalized.split(/\s+/).filter((term) =>
    term.length > 1 && !QUERY_STOP_WORDS.has(term) && !/^\d+$/.test(term)
  ))];
}

function matchQuery(productName, query) {
  const terms = queryTerms(query);
  const normalizedProductName = productName.toLowerCase();
  const productTerms = normalizedProductName
    .replace(/[^a-z0-9]+/g, " ")
    .split(/\s+/)
    .filter(Boolean);
  const matched = terms.filter((term) => {
    // Common catalog spelling variants should count as a match.
    const variants = {
      chocolate: ["chocochip", "chocochips"],
      whipped: ["whip", "whipping"],
      cream: ["topping", "toppings"],
    }[term] ?? [];
    return productTerms.some((candidate) =>
      candidate === term || variants.includes(candidate) ||
      (term.length >= 4 && candidate.length >= 4 && editDistanceAtMostOne(term, candidate))
    );
  });

  // Keep a candidate only when every specific search word is represented.
  // Short generic words such as "ice" are useful for ranking, but are not
  // always present in catalog titles (for example, "Cornetto").
  const requiredTerms = terms.filter((term) => term.length >= 4);
  const isRelevant = requiredTerms.length
    ? requiredTerms.every((term) => matched.includes(term))
    : matched.length > 0;

  // "Whipped cream" is an edible grocery item in this assistant. Shopping
  // catalogs also use that phrase in skincare names and dispenser parts, so
  // matching the words alone is not enough to establish product relevance.
  const isWhippedCreamSearch = /\bwhipped\s+cream\b/i.test(query);
  const nonFoodWhippedCreamResult = isWhippedCreamSearch &&
    /\b(moisturi[sz](?:er|ers|ing|ation)|skin|face|facial|lotion|beauty|rejuvenation|gasket|dispenser|spare\s+parts?|accessor(?:y|ies)|drunk\s+elephant)\b/i.test(normalizedProductName);

  return {
    isRelevant: isRelevant && !nonFoodWhippedCreamResult,
    coverage: terms.length ? matched.length / terms.length : 0,
  };
}


// =====================================================
// PRODUCT IDENTITY
// =====================================================


   
const PRODUCT_TYPE_RULES = [
  {
    type: "sanitary_pad",
    keywords: [
      "sanitary pad",
      "period pad",
      "menstrual pad",
      "pads for periods",
    ],
  },

  {
    type: "ice_cream",
    keywords: [
      "ice cream",
      "icecream",
      "ice-cream",
    ],
  },

  {
    type: "shampoo",
    keywords: [
      "shampoo",
    ],
  },

  {
    type: "smartphone",
    keywords: [
      "smartphone",
      "smart phone",
      "mobile phone",
      "touchscreen phone",
      "touch screen phone",
      "touch phone",
    ],
  },

  {
    type: "running_shoes",
    keywords: [
      "running shoes",
      "running shoe",
    ],
  },

  {
    type: "headphones",
    keywords: [
      "headphones",
      "headphone",
    ],
  },

  {
    type: "shirt",
    keywords: [
      "shirt",
      "formal shirt",
      "casual shirt",
    ],
  },
];

function identifyProductType(query) {
  const normalizedQuery = query
    .toLowerCase()
    .replace(/[^\w\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  // Check specific phrases first
  for (const rule of PRODUCT_TYPE_RULES) {
    const matchedKeyword = rule.keywords.find((keyword) => {
      const pattern = new RegExp(
        `\\b${keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`,
        "i"
      );

      return pattern.test(normalizedQuery);
    });

    if (matchedKeyword) {
      return {
        type: rule.type,
        matchedKeyword,
        ambiguous: false,
      };
    }
  }

  // "pad" alone is ambiguous
  if (/\bpad\b/i.test(normalizedQuery)) {
    return {
      type: null,
      matchedKeyword: "pad",
      ambiguous: true,
      candidates: [
        "sanitary pad",
        "tablet / iPad",
        "mouse pad",
        "drawing pad",
      ],
    };
  }

  return {
    type: null,
    matchedKeyword: null,
    ambiguous: false,
  };
}

 
exports.recommendationService = async ({
  category,
  searchQuery,
  budget,
  quantity,
  priority,
  constraints = {},
}) => {
  // =====================================================
  // 1. Determine what we should actually search
  // =====================================================

  const query = searchQuery?.trim() || category?.trim();
    if (!query) {
    throw new ValidationError("Shopping request is required");
  }
const productIdentity = identifyProductType(query);

console.log(
  "🧠 PRODUCT IDENTITY:",
  JSON.stringify(productIdentity, null, 2)
);



  // =====================================================
  // 2. Search using the user's full shopping context
  // =====================================================
console.log("🔎 FINAL SHOPPING QUERY:", query);
  const providerQuery = /\bwhipped\s+cream\b/i.test(query)
    ? `${query} food topping dairy`
    : query;
  const products = await searchProducts(providerQuery);

  if (!products.length) {
    throw new NotFoundError(
      `Products for "${query}" not found`
    );
  }

  // =====================================================
  // 3. Budget filtering
  // =====================================================

  const filteredProducts = products.filter(
    (product) =>
      budget == null || product.price <= budget
  );

  if (!filteredProducts.length) {
    throw new NotFoundError(
      `Products for "${query}" within your budget not found`
    );
  }

  // =====================================================
  // 4. Calculate relevance score
  // =====================================================

  const scoreProduct = (product) => {
    let score = 0;

    const productText = [
      product.name,
      product.brand,
      product.platform,
      product.delivery,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    // ---------------------------------------------
    // Constraint matching
    // ---------------------------------------------

    if (constraints.color) {
      if (productText.includes(constraints.color.toLowerCase())) {
        score += 30;
      }
    }

    if (constraints.material) {
      if (
        productText.includes(
          constraints.material.toLowerCase()
        )
      ) {
        score += 30;
      }
    }

    if (constraints.style) {
      if (
        productText.includes(
          constraints.style.toLowerCase()
        )
      ) {
        score += 30;
      }
    }

    if (constraints.wireless === true) {
      if (productText.includes("wireless")) {
        score += 25;
      }
    }

    if (constraints.bluetooth === true) {
      if (productText.includes("bluetooth")) {
        score += 25;
      }
    }

    // ---------------------------------------------
    // SPF
    // ---------------------------------------------

    if (constraints.minSpf) {
      const spfMatch = productText.match(
        /\bspf\s*(\d+)\s*\+?/i
      );

      if (spfMatch) {
        const productSpf = Number(spfMatch[1]);

        if (productSpf >= constraints.minSpf) {
          score += 40;
        } else {
          score -= 40;
        }
      }
    }

    // ---------------------------------------------
    // Rating / reviews
    // ---------------------------------------------

    if (product.rating != null) {
      score += Math.min(product.rating * 3, 15);
    }

    if (product.reviews != null) {
      score += Math.min(
        Math.log10(product.reviews + 1) * 3,
        10
      );
    }

    return score;
  };

  // =====================================================
  // 5. Add relevance score
  // =====================================================

const scoredCandidates = filteredProducts.map((product) => {
  const queryMatch = matchQuery(product.name ?? "", query);

  return {
    ...product,
    ...queryMatch,
    relevanceScore:
      scoreProduct(product) + queryMatch.coverage * 100,
  };
});

const strictMatches = scoredCandidates.filter(
  (product) => product.isRelevant
);

console.log("🔬 RECOMMENDATION DEBUG:", {
  query,
  serpApiResults: products.length,
  withinBudget: filteredProducts.length,
  strictMatches: strictMatches.length,
  candidates: scoredCandidates.slice(0, 8).map((product) => ({
    name: product.name,
    price: product.price,
    coverage: product.coverage,
    isRelevant: product.isRelevant,
  })),
});

let scoredProducts = strictMatches;

if (scoredProducts.length === 0) {
  console.warn(
    `⚠️ No strict matches for "${query}". Trying partial matches.`
  );

  scoredProducts = scoredCandidates
    .filter((product) => product.coverage >= 0.5)
    .sort(
      (a, b) =>
        b.coverage - a.coverage ||
        b.relevanceScore - a.relevanceScore
    );
}

console.log("✅ Final matched products:", scoredProducts.length);


  // =====================================================
  // 6. Remove duplicate product + platform combinations
  // =====================================================

  const uniqueProducts = [];
  const seen = new Set();

  for (const product of scoredProducts) {
    
// const key =
//   product.shoppingProductId ||
//   product.image ||
//   `${product.name.trim().toLowerCase()}-${(
//     product.platform || ""
//   ).trim().toLowerCase()}`;


const normalizedName = (product.name || "")
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, " ")
  .trim();

const normalizedPlatform = (product.platform || "")
  .toLowerCase()
  .trim();

const key =
  normalizedName && normalizedPlatform
    ? `${normalizedName}::${normalizedPlatform}`
    : product.shoppingProductId ||
      product.image ||
      normalizedName;

      
    if (seen.has(key)) {
      continue;
    }

    seen.add(key);
    uniqueProducts.push(product);
  }

  // =====================================================
  // 7. Ranking
  // =====================================================

  if (priority === "lowest-price") {
    uniqueProducts.sort((a, b) => {
     
return  a.price - b.price
      
    });
  }

  if (priority === "quality") {
    uniqueProducts.sort((a, b) => {
      const ratingA = a.rating ?? 0;
      const ratingB = b.rating ?? 0;

      if (ratingB !== ratingA) {
        return ratingB - ratingA;
      }

      const reviewsA = a.reviews ?? 0;
      const reviewsB = b.reviews ?? 0;

      if (reviewsB !== reviewsA) {
        return reviewsB - reviewsA;
      }

      return b.relevanceScore - a.relevanceScore;
    });
  }

  if (priority === "delivery") {
    const getDeliveryScore = (delivery) => {
      if (!delivery) return 0;

      const value = delivery.toLowerCase();

      if (value.includes("today")) return 3;
      if (value.includes("tomorrow")) return 2;
      if (value.includes("day")) return 1;

      return 0;
    };

    uniqueProducts.sort((a, b) => {
      const deliveryDifference =
        getDeliveryScore(b.delivery) -
        getDeliveryScore(a.delivery);

      if (deliveryDifference !== 0) {
        return deliveryDifference;
      }

      return b.relevanceScore - a.relevanceScore;
    });
  }

  // Default:
  // relevance first, price second
  if (!priority) {
    uniqueProducts.sort((a, b) => {
      if (b.coverage !== a.coverage) {
        return b.coverage - a.coverage;
      }
      if (b.relevanceScore !== a.relevanceScore) {
        return b.relevanceScore - a.relevanceScore;
      }

      return a.price - b.price;
    });
  }

  // =====================================================
  // 8. Return recommendations
  // =====================================================

  return uniqueProducts.slice(0, 5).map((product) => ({
    id: product._id ?? null,

    productKey:
      query.trim().toLowerCase(),

    ...createOffer(product),

    reason: buildRecommendationReason({
      product,
      query,
      budget,
      constraints,
    }),
  }));
};

// ======================================================
// RECOMMENDATION REASON
// ======================================================

function buildRecommendationReason({
  product,
  query,
  budget,
  constraints,
}) {
  const reasons = [];

  if (constraints.color) {
    const matches = product.name
      .toLowerCase()
      .includes(constraints.color.toLowerCase());

    if (matches) {
      reasons.push(`matches your ${constraints.color} preference`);
    }
  }

  if (constraints.material) {
    const matches = product.name
      .toLowerCase()
      .includes(constraints.material.toLowerCase());

    if (matches) {
      reasons.push(
        `matches your ${constraints.material} preference`
      );
    }
  }

  if (constraints.style) {
    const matches = product.name
      .toLowerCase()
      .includes(constraints.style.toLowerCase());

    if (matches) {
      reasons.push(
        `matches your ${constraints.style} preference`
      );
    }
  }

  if (constraints.minSpf) {
    const spfMatch = product.name.match(
      /\bspf\s*(\d+)\s*\+?/i
    );

    if (
      spfMatch &&
      Number(spfMatch[1]) >= constraints.minSpf
    ) {
      reasons.push(
        `meets your SPF ${constraints.minSpf}+ requirement`
      );
    }
  }

  if (budget != null && product.price <= budget) {
    reasons.push(`stays within ₹${budget}`);
  }

  if (!reasons.length) {
    return `Relevant to your "${query}" request${
      budget != null
        ? ` and within your ₹${budget} budget`
        : ""
    }.`;
  }

  return `${reasons.join(", ")}.`;
}
