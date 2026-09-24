const productRepository = require("../repositories/productRepository");
const platformConfig = require("../config/platformConfig");
const calculateFinalCost = require("../utils/calculateFinalCost");
const { NotFoundError, ValidationError } = require("../errors/AppError");
const {getMongoOffers , createOffer} =require("./offer/offerService") ; 

// ======================================================
// ADD OR UPDATE PRODUCT
// ======================================================

exports.addOrUpdateProduct = async ({ name, price, platform , category }) => {
  const existing = await productRepository.findByNameAndPlatform(name, platform);

  if (existing) {
    const updatedProduct = await productRepository.updatePriceWithHistory(
      name,
      platform,
      price,
      existing.price
    );

    return {
      type: "updated",
      product: updatedProduct,
    };
  }

  // Create new product
  const newProduct = await productRepository.create({
    name,
    price,
    platform,
    category
  });

  return {
    type: "created",
    product: newProduct,
  };
};

// ======================================================
// COMPARE PRODUCT PRICES
// ======================================================

exports.compareProduct = async (productName) => {
  if (!productName ||  !productName.trim()) {
    throw new ValidationError("Product name is required");
  }

  const products = await productRepository.findByName(productName);

  if (!products.length ) {
    throw new NotFoundError(`Product "${productName}" not found.`);s
  }

  const prices = {};
  let cheapestPlatform = null;
  let lowestPrice = Infinity;

  products.forEach((product) => {
    prices[product.platform] = product.price;

    if (product.price < lowestPrice) {
      lowestPrice = product.price;
      cheapestPlatform = product.platform;
    }
  });

  return {
    product: productName.trim().toLowerCase(),
    prices,
    cheapest: {
      platform: cheapestPlatform,
      price: lowestPrice,
    },
  };
};

exports.compareProducts = async (productNames) => {
  if (productNames.length < 2) {
    throw new Error("compareProducts requires at least 2 products");
  }

  const result = await Promise.all(
    productNames.map((name) => exports.compareProduct(name))
  );

  return {
    products: productNames,
    details: result,
  };
};



// ======================================================
// OPTIMIZE CART
// ======================================================

exports.optimizeCart = async (products) => {
  if (!Array.isArray(products) || products.length === 0) {
    throw new ValidationError("Shopping plan is empty");
  }

  // ------------------------------------------------------
  // NORMALIZE CART INPUT
  // ------------------------------------------------------

  const productsByNameInput = new Map();

  products.forEach((product) => {
    const isString = typeof product === "string";

    const rawName = isString ? product : product?.name;

    if (!rawName || typeof rawName !== "string") {
      return;
    }

    const name = rawName.trim().toLowerCase();

    if (!name) return;

    const quantity = isString
      ? 1
      : Number.isFinite(Number(product?.quantity)) &&
        Number(product.quantity) > 0
      ? Number(product.quantity)
      : 1;

    const offer = isString ? null : product?.offer ?? null;

    if (!productsByNameInput.has(name)) {
      productsByNameInput.set(name, {
        name,
        quantity,
        offers: offer ? [offer] : [],
      });
    } else {
      const existing = productsByNameInput.get(name);

      existing.quantity += quantity;

      if (offer) {
        existing.offers.push(offer);
      }
    }
  });

  const normalizedProducts = Array.from(
    productsByNameInput.values()
  );

  if (!normalizedProducts.length) {
    throw new ValidationError("No valid products found in shopping plan");
  }

  // ------------------------------------------------------
  // GET OFFERS FROM BOTH SOURCES
  // ------------------------------------------------------

  const names = normalizedProducts.map((product) => product.name);

  // Persistent offers
  const mongoOffers = await getMongoOffers(names);

  // Live offers stored in the shopping plan
  const liveOffers = normalizedProducts.flatMap((product) =>
    product.offers.map((offer) => createOffer(offer))
  );

  // MongoDB + live SerpApi offers
  const allItems = [...mongoOffers, ...liveOffers];

  if (!allItems.length) {
    throw new NotFoundError("Products");
  }

  // ------------------------------------------------------
  // NORMALIZE OFFER DATA
  // ------------------------------------------------------

  const normalizedOffers = allItems
    .filter(
      (item) =>
        item &&
        typeof item.name === "string" &&
        item.name.trim() &&
        typeof item.platform === "string" &&
        item.platform.trim() &&
        Number.isFinite(Number(item.price)) &&
        Number(item.price) >= 0
    )
    .map((item) => ({
      ...item,
      name: item.name.trim().toLowerCase(),
      platform: item.platform.trim().toLowerCase(),
      price: Number(item.price),
    }));

  if (!normalizedOffers.length) {
    throw new NotFoundError("Valid product offers");
  }

  // ------------------------------------------------------
  // GROUP OFFERS BY PRODUCT NAME
  // ------------------------------------------------------

  const productsByName = {};

  normalizedOffers.forEach((item) => {
    if (!productsByName[item.name]) {
      productsByName[item.name] = [];
    }

    productsByName[item.name].push(item);
  });

  // ------------------------------------------------------
  // SPLIT CART STRATEGY
  // ------------------------------------------------------

  const splitItems = {};
  const missingProducts = [];
  const splitOrdersByPlatform = {};

  for (const cartItem of normalizedProducts) {
    const productName = cartItem.name;
    const quantity = cartItem.quantity;

    const availableProducts =
      productsByName[productName] || [];

    if (!availableProducts.length) {
      splitItems[productName] = {
        available: false,
        message: "Not found",
      };

      missingProducts.push(productName);
      continue;
    }

    const cheapestProduct = availableProducts.reduce(
      (min, current) =>
        current.price < min.price ? current : min
    );

    const productCost =
      cheapestProduct.price * quantity;

    const platform = cheapestProduct.platform;

    splitItems[productName] = {
      available: true,
      platform,
      price: cheapestProduct.price,
      quantity,
      productCost,
      finalCost: productCost,
      source: cheapestProduct.source,
    };

    if (!splitOrdersByPlatform[platform]) {
      splitOrdersByPlatform[platform] = {
        productCost: 0,
      };
    }

    splitOrdersByPlatform[platform].productCost +=
      productCost;
  }

  // ------------------------------------------------------
  // SPLIT CART TOTALS
  // ------------------------------------------------------

  const splitOrderTotals = Object.entries(
    splitOrdersByPlatform
  ).map(([platform, order]) => {
    const config = platformConfig[platform];

    const calculation = config
      ? calculateFinalCost(order.productCost, config)
      : {
          total: order.productCost,
          breakdown: null,
        };

    return {
      platform,
      productCost: order.productCost,
      totalCost: calculation.total,
      feeBreakdown: calculation.breakdown,
    };
  });

  const splitTotalProductCost =
    splitOrderTotals.reduce(
      (total, order) =>
        total + order.productCost,
      0
    );

  const splitTotalFinalCost =
    splitOrderTotals.reduce(
      (total, order) =>
        total + order.totalCost,
      0
    );

  // ------------------------------------------------------
  // SINGLE PLATFORM STRATEGY
  // ------------------------------------------------------

  const platformMap = {};

  normalizedOffers.forEach((item) => {
    const platform = item.platform;
    const productName = item.name;

    if (!platformMap[platform]) {
      platformMap[platform] = {};
    }

    const existingOffer =
      platformMap[platform][productName];

    // Keep the cheapest offer when multiple
    // sources have the same product/platform.
    if (
      !existingOffer ||
      item.price < existingOffer.price
    ) {
      platformMap[platform][productName] = item;
    }
  });

  let bestPlatform = null;
  let lowestPlatformCost = Infinity;
  let bestPlatformBreakdown = null;

  const alternatives = [];

  for (const platform in platformMap) {
    let totalProductCost = 0;
    let hasAllProducts = true;

    for (const cartItem of normalizedProducts) {
      const productName = cartItem.name;
      const quantity = cartItem.quantity;

      const offer =
        platformMap[platform][productName];

      if (!offer) {
        hasAllProducts = false;
        break;
      }

      totalProductCost +=
        offer.price * quantity;
    }

    if (!hasAllProducts) {
      continue;
    }

    const config = platformConfig[platform];

    let finalCost = totalProductCost;
    let breakdown = null;

    if (config) {
      const calculation = calculateFinalCost(
        totalProductCost,
        config
      );

      finalCost = calculation.total;
      breakdown = calculation.breakdown;
    }

    alternatives.push({
      platform,
      totalCost: finalCost,
      productCost: totalProductCost,
      feeBreakdown: breakdown,
    });

    if (finalCost < lowestPlatformCost) {
      lowestPlatformCost = finalCost;
      bestPlatform = platform;

      bestPlatformBreakdown = {
        productCost: totalProductCost,
        finalCost,
        breakdown,
        platform,
      };
    }
  }

  // ------------------------------------------------------
  // RECOMMEND STRATEGY
  // ------------------------------------------------------

  const splitCartAvailable =
    normalizedProducts.length > 0 &&
    Object.keys(splitItems).length ===
      normalizedProducts.length &&
    Object.values(splitItems).every(
      (item) => item.available
    );

  let recommended = null;

  if (bestPlatform && splitCartAvailable) {
    if (
      splitTotalFinalCost <
      lowestPlatformCost
    ) {
      recommended = {
        strategy: "split-cart",
        totalCost: splitTotalFinalCost,
        productCost: splitTotalProductCost,
        details: splitItems,
      };
    } else {
      recommended = {
        strategy: "single-platform",
        platform: bestPlatform,
        totalCost: lowestPlatformCost,
        productCost:
          bestPlatformBreakdown.productCost,
        feeBreakdown:
          bestPlatformBreakdown.breakdown,
      };
    }
  } else if (bestPlatform) {
    recommended = {
      strategy: "single-platform",
      platform: bestPlatform,
      totalCost: lowestPlatformCost,
      productCost:
        bestPlatformBreakdown.productCost,
      feeBreakdown:
        bestPlatformBreakdown.breakdown,
    };
  } else if (splitCartAvailable) {
    recommended = {
      strategy: "split-cart",
      totalCost: splitTotalFinalCost,
      productCost: splitTotalProductCost,
      details: splitItems,
    };
  }

  // ------------------------------------------------------
  // CALCULATE SAVINGS
  // ------------------------------------------------------

  let savings = 0;

  if (bestPlatform && splitCartAvailable) {
    savings = Math.abs(
      lowestPlatformCost -
        splitTotalFinalCost
    );

    savings = Number(
      savings.toFixed(2)
    );
  }

  // ------------------------------------------------------
  // BUILD SHOPPING PLAN
  // ------------------------------------------------------

  const shoppingPlan = [];

  if (
    recommended &&
    recommended.strategy ===
      "single-platform" &&
    bestPlatform
  ) {
    for (const cartItem of normalizedProducts) {
      const offer =
        platformMap[bestPlatform]?.[
          cartItem.name
        ];

      if (!offer) {
        continue;
      }

      shoppingPlan.push({
        product: cartItem.name,
        platform: offer.platform,
        quantity: cartItem.quantity,
        price: offer.price,
        totalPrice:
          offer.price * cartItem.quantity,
        productCost:
          offer.price * cartItem.quantity,
        source: offer.source,
      });
    }
  } else if (
    recommended &&
    recommended.strategy ===
      "split-cart"
  ) {
    for (const [
      productName,
      details,
    ] of Object.entries(splitItems)) {
      if (!details.available) {
        continue;
      }

      shoppingPlan.push({
        product: productName,
        platform: details.platform,
        quantity: details.quantity,
        price: details.price,
        totalPrice: details.productCost,
        productCost: details.productCost,
        source: details.source,
      });
    }
  }

  // ------------------------------------------------------
  // SORT ALTERNATIVES
  // ------------------------------------------------------

  alternatives.sort(
    (a, b) => a.totalCost - b.totalCost
  );

  // ------------------------------------------------------
  // RETURN RESULT
  // ------------------------------------------------------

  return {
    recommended,
    savings,
    missingProducts,
    shoppingPlan,
    alternatives,

    summary: {
      totalItems:
        normalizedProducts.reduce(
          (sum, product) =>
            sum + product.quantity,
          0
        ),

      uniqueProducts:
        productsByNameInput.size,

      platformsConsidered:
        Object.keys(platformMap).length,
    },
  };
};