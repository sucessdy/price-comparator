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
// ======================================================
// OPTIMIZE CART
// ======================================================

exports.optimizeCart = async (products) => {
  // ------------------------------------------------------
  // 1. Normalize cart input + merge duplicate products
  // ------------------------------------------------------

  const productsByNameInput = new Map();

  products.forEach((product) => {
    const name = (typeof product === "string" ? product : product.name)
      .trim()
      .toLowerCase();

    const quantity =
      typeof product === "string" ? 1 : product.quantity || 1;

    const offer =
      typeof product === "string" ? null : product.offer ?? null;

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

  const normalizedProducts = Array.from(productsByNameInput.values());

  const names = normalizedProducts.map((product) => product.name);

  // ------------------------------------------------------
  // 2. Get offers from both sources
  // ------------------------------------------------------

  const mongoOffers = await getMongoOffers(names);

  const liveOffers = normalizedProducts.flatMap(
    (product) => product.offers
  );

  // ------------------------------------------------------
  // 3. Group offers by CART PRODUCT NAME
  // ------------------------------------------------------
  // Important:
  // Cart name and SerpApi title may not be exactly the same.
  // Example:
  // cart = "kratos n1"
  // live  = "Kratos N1 Neckband Bluetooth Headphones..."

  const productsByName = {};

  normalizedProducts.forEach((product) => {
    productsByName[product.name] = [];
  });

  // Add MongoDB offers
  mongoOffers.forEach((offer) => {
    const productName = offer.name.trim().toLowerCase();

    if (!productsByName[productName]) {
      productsByName[productName] = [];
    }

    productsByName[productName].push(offer);
  });

  // Add live offers back to the cart product they came from
  normalizedProducts.forEach((product) => {
    if (product.offers.length > 0) {
      productsByName[product.name].push(...product.offers);
    }
  });

  const allItems = [...mongoOffers, ...liveOffers];

  console.log("🗄️ MongoDB offers:", mongoOffers);
  console.log("🌐 Live offers:", liveOffers);
  console.log("📦 All offers:", allItems);
  console.log("🧩 Offers grouped by cart product:", productsByName);

  if (allItems.length === 0) {
    throw new NotFoundError("Products");
  }

  // ======================================================
  // SPLIT CART STRATEGY
  // ======================================================

  const splitItems = {};
  const missingProducts = [];
  const splitOrdersByPlatform = {};

  for (const cartItem of normalizedProducts) {
    const productName = cartItem.name;
    const quantity = cartItem.quantity;

    const availableProducts = productsByName[productName] || [];

    if (availableProducts.length === 0) {
      splitItems[productName] = {
        available: false,
        message: "Not found",
      };

      missingProducts.push(productName);
      continue;
    }

    const cheapestProduct = availableProducts.reduce((min, current) =>
      current.price < min.price ? current : min
    );

    const productCost = cheapestProduct.price * quantity;
    const platform = cheapestProduct.platform;

    splitItems[productName] = {
      available: true,
      platform,
      price: cheapestProduct.price,
      quantity,
      productCost,
      finalCost: productCost,
    };

    if (!splitOrdersByPlatform[platform]) {
      splitOrdersByPlatform[platform] = {
        productCost: 0,
      };
    }

    splitOrdersByPlatform[platform].productCost += productCost;
  }

  const splitOrderTotals = Object.entries(splitOrdersByPlatform).map(
    ([platform, order]) => {
      const calculation = platformConfig[platform]
        ? calculateFinalCost(order.productCost, platformConfig[platform])
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
    }
  );

  const splitTotalProductCost = splitOrderTotals.reduce(
    (total, order) => total + order.productCost,
    0
  );

  const splitTotalFinalCost = splitOrderTotals.reduce(
    (total, order) => total + order.totalCost,
    0
  );

  // ======================================================
  // SINGLE PLATFORM STRATEGY
  // ======================================================

  // IMPORTANT:
  // Build this using cart product names as the identity,
  // not the raw SerpApi title.

  const platformMap = {};

  for (const cartItem of normalizedProducts) {
    const productName = cartItem.name;
    const availableProducts = productsByName[productName] || [];

    availableProducts.forEach((item) => {
      const platform = item.platform;

      if (!platformMap[platform]) {
        platformMap[platform] = {};
      }

      platformMap[platform][productName] = item;
    });
  }

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

      const offer = platformMap[platform][productName];

      if (!offer) {
        hasAllProducts = false;
        break;
      }

      totalProductCost += offer.price * quantity;
    }

    if (hasAllProducts) {
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
  }

  // ======================================================
  // RECOMMEND BEST STRATEGY
  // ======================================================

  const splitCartAvailable = Object.values(splitItems).every(
    (item) => item.available
  );

  let recommended = null;

  if (bestPlatform && splitCartAvailable) {
    if (splitTotalFinalCost < lowestPlatformCost) {
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
        productCost: bestPlatformBreakdown.productCost,
        feeBreakdown: bestPlatformBreakdown.breakdown,
      };
    }
  } else if (bestPlatform) {
    recommended = {
      strategy: "single-platform",
      platform: bestPlatform,
      totalCost: lowestPlatformCost,
      productCost: bestPlatformBreakdown.productCost,
      feeBreakdown: bestPlatformBreakdown.breakdown,
    };
  } else if (splitCartAvailable) {
    recommended = {
      strategy: "split-cart",
      totalCost: splitTotalFinalCost,
      productCost: splitTotalProductCost,
      details: splitItems,
    };
  }

  // ======================================================
  // SAVINGS
  // ======================================================

  let savings = 0;

  if (bestPlatform && splitCartAvailable) {
    savings = Math.abs(
      lowestPlatformCost - splitTotalFinalCost
    );

    savings = Number(savings.toFixed(2));
  }

  // ======================================================
  // SHOPPING PLAN
  // ======================================================

  const shoppingPlan = [];

  if (
    recommended &&
    recommended.strategy === "single-platform" &&
    bestPlatform
  ) {
    for (const cartItem of normalizedProducts) {
      const offer =
        platformMap[bestPlatform]?.[cartItem.name];

      if (offer) {
        shoppingPlan.push({
          product: cartItem.name,
          platform: bestPlatform,
          quantity: cartItem.quantity,
          price: offer.price,
          totalPrice: offer.price * cartItem.quantity,
        });
      }
    }
  } else if (
    recommended &&
    recommended.strategy === "split-cart"
  ) {
    for (const [productName, details] of Object.entries(
      splitItems
    )) {
      if (details.available) {
        shoppingPlan.push({
          product: productName,
          platform: details.platform,
          quantity: details.quantity,
          price: details.price,
          totalPrice: details.productCost,
          productCost: details.productCost,
        });
      }
    }
  }

  // Sort alternatives cheapest first
  alternatives.sort(
    (a, b) => a.totalCost - b.totalCost
  );

  // ======================================================
  // RETURN
  // ======================================================

  return {
    recommended,
    savings,
    missingProducts,
    shoppingPlan,
    alternatives,

    summary: {
      totalItems: normalizedProducts.reduce(
        (sum, product) => sum + product.quantity,
        0
      ),
      uniqueProducts: normalizedProducts.length,
      platformsConsidered: Object.keys(platformMap).length,
    },
  };
};