

const searchProducts = require("./search/searchServices");
const {
  ValidationError,
  NotFoundError,
} = require("../errors/AppError");
const { createOffer } = require("./offer/offerService");

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

  // =====================================================
  // 2. Search using the user's full shopping context
  // =====================================================
console.log("🔎 FINAL SHOPPING QUERY:", query);
  const products = await searchProducts(query);

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

  const scoredProducts = filteredProducts.map(
    (product) => ({
      ...product,
      relevanceScore: scoreProduct(product),
    })
  );

  // =====================================================
  // 6. Remove duplicate product + platform combinations
  // =====================================================

  const uniqueProducts = [];
  const seen = new Set();

  for (const product of scoredProducts) {
    
const key =
  product.shoppingProductId ||
  product.image ||
  `${product.name.trim().toLowerCase()}-${(
    product.platform || ""
  ).trim().toLowerCase()}`;


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