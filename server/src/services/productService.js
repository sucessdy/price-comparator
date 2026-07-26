const productRepository = require("../repositories/productRepository");
const platformConfig = require("../config/platformConfig");
const calculateFinalCost = require("../utils/calculateFinalCost");
const { NotFoundError, ValidationError } = require("../errors/AppError");

// ======================================================
// ADD OR UPDATE PRODUCT
// ======================================================

exports.addOrUpdateProduct = async ({ name, price, platform }) => {
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
    throw new NotFoundError(`Product "${productName}" not found.`);
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

// ======================================================
// OPTIMIZE CART
// ======================================================

exports.optimizeCart = async (products) => {
  // Normalize duplicate entries before looking up products or applying fees.
  const quantitiesByName = new Map();
  products.forEach((product) => {
    const name = (typeof product === "string" ? product : product.name)
      .trim()
      .toLowerCase();
    const quantity = typeof product === "string" ? 1 : product.quantity || 1;
    quantitiesByName.set(name, (quantitiesByName.get(name) || 0) + quantity);
  });

  const normalizedProducts = Array.from(quantitiesByName, ([name, quantity]) => ({
    name,
    quantity,
  }));

  const names = normalizedProducts.map((p) => p.name);

  const allItems = await productRepository.findByNames(names);

  if (allItems.length === 0) {
    throw new NotFoundError("Products");
  }

  // Group by name
  const productsByName = {};
  allItems.forEach((item) => {
    if (!productsByName[item.name]) {
      productsByName[item.name] = [];
    }
    productsByName[item.name].push(item);
  });

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
      platform: platform,
      price: cheapestProduct.price,
      quantity: quantity,
      productCost: productCost,
      // Fees are applied to the platform order below, never to each item.
      finalCost: productCost,
    };

    if (!splitOrdersByPlatform[platform]) {
      splitOrdersByPlatform[platform] = { productCost: 0 };
    }
    splitOrdersByPlatform[platform].productCost += productCost;
  }

  const splitOrderTotals = Object.entries(splitOrdersByPlatform).map(
    ([platform, order]) => {
      const calculation = platformConfig[platform]
        ? calculateFinalCost(order.productCost, platformConfig[platform])
        : { total: order.productCost, breakdown: null };

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
  const platformMap = {};
  allItems.forEach((item) => {
    if (!platformMap[item.platform]) {
      platformMap[item.platform] = {};
    }
    platformMap[item.platform][item.name] = item.price;
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
      const price = platformMap[platform][productName];

      if (price == null) {
        hasAllProducts = false;
        break;
      }

      totalProductCost += price * quantity;
    }

    if (hasAllProducts) {
      const config = platformConfig[platform];
      let finalCost = totalProductCost;
      let breakdown = null;

      if (config) {
        const calculation = calculateFinalCost(totalProductCost, config);
        finalCost = calculation.total;
        breakdown = calculation.breakdown;
      }

      alternatives.push({
        platform: platform,
        totalCost: finalCost,
        productCost: totalProductCost,
        feeBreakdown: breakdown,
      });

      if (finalCost < lowestPlatformCost) {
        lowestPlatformCost = finalCost;
        bestPlatform = platform;
        bestPlatformBreakdown = {
          productCost: totalProductCost,
          finalCost: finalCost,
          breakdown: breakdown,
          platform: platform,
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

  // Calculate savings
  let savings = 0;
  if (bestPlatform && splitCartAvailable) {
    savings = Math.abs(lowestPlatformCost - splitTotalFinalCost);
    savings = Number(savings.toFixed(2));
  }

  // Build shopping plan
  const shoppingPlan = [];

  if (recommended && recommended.strategy === "single-platform" && bestPlatform) {
    for (const cartItem of normalizedProducts) {
      const price = platformMap[bestPlatform]?.[cartItem.name];
      if (price) {
        shoppingPlan.push({
          product: cartItem.name,
          platform: bestPlatform,
          quantity: cartItem.quantity,
          price: price,
          totalPrice: price * cartItem.quantity,
        });
      }
    }
  } else if (recommended && recommended.strategy === "split-cart" && splitItems) {
    for (const [productName, details] of Object.entries(splitItems)) {
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
// After calculating alternatives, sort them by price
alternatives.sort((a, b) => a.totalCost - b.totalCost);
  return {
    recommended,
    savings,
    missingProducts,
    shoppingPlan,
    alternatives,
    summary: {
      totalItems: normalizedProducts.reduce((sum, p) => sum + p.quantity, 0),
      uniqueProducts: quantitiesByName.size,
      platformsConsidered: Object.keys(platformMap).length,
    },
  };
};
