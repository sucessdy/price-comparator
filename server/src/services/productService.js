const Product = require("../models/productModel");
const { NotFoundError } = require("../errors/AppError");

const platformConfig = require("../config/platformConfig");
const calculateFinalCost = require("../utils/calculateFinalCost");
// add  product

exports.addOrUpdateProduct = async ({ name, price, platform }) => {
  const normalizedName = name.trim().toLowerCase();

  const normalizedPlatform = platform.trim().toLowerCase();

  // Find existing product
  const existing = await Product.findOne({
    name: normalizedName,
    platform: normalizedPlatform,
  });

  // ======================================================
  // UPDATE EXISTING PRODUCT
  // ======================================================

  if (existing) {
    const updatedProduct = await Product.findOneAndUpdate(
      {
        name: normalizedName,
        platform: normalizedPlatform,
      },
      {
        $set: {
          price,
        },

        $push: {
          priceHistory: {
            price: existing.price,
            date: new Date(),
          },
        },
      },
      {
        new: true,
      },
    );

    return {
      type: "updated",
      product: updatedProduct,
    };
  }

  // ======================================================
  // CREATE NEW PRODUCT
  // ======================================================

  const newProduct = await Product.create({
    name: normalizedName,
    price,
    platform: normalizedPlatform,
    priceHistory: [],
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
  if (!productName || typeof productName !== "string") {
    throw new Error("Invalid product name");
  }
  const normalizedName = productName.trim().toLowerCase();

  const products = await Product.find({
    name: normalizedName,
  });
  console.log(products);
  console.log(typeof products);
  if (products.length === 0) {
    throw new NotFoundError("Product");
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
    product: normalizedName,
    prices,
    cheapest: {
      platform: cheapestPlatform,
      price: lowestPrice,
    },
  };
};


exports.optimizeCart = async (products) => {
  // Normalize products
  const normalizedProducts = products.map((product) => {
    if (typeof product === "string") {
      return {
        name: product.trim().toLowerCase(),
        quantity: 1,
      };
    }
    return {
      name: product.name.trim().toLowerCase(),
      quantity: product.quantity || 1,
    };
  });

  const names = normalizedProducts.map((p) => p.name);

  // Fetch all products
  const allItems = await Product.find({
    name: { $in: names },
  });

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
  let splitTotalProductCost = 0;
  let splitTotalFinalCost = 0;

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
    const config = platformConfig[platform];
    let finalCost = productCost;
    let feeBreakdown = null;

    if (config) {
      const calculation = calculateFinalCost(productCost, config);
      finalCost = calculation.total;
      feeBreakdown = calculation.breakdown;
    }

    splitItems[productName] = {
      available: true,
      platform: platform,
      price: cheapestProduct.price,
      quantity: quantity,
      productCost: productCost,
      finalCost: finalCost,
      feeBreakdown: feeBreakdown,
    };

    splitTotalProductCost += productCost;
    splitTotalFinalCost += finalCost;
  }

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
  const alternatives = []; // ✅ Fixed: alternatives array outside loop

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

      // ✅ Add to alternatives
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
          totalPrice: details.finalCost,
          productCost: details.productCost,
          fees: details.feeBreakdown,
        });
      }
    }
  }

  // ======================================================
  // FINAL RESPONSE
  // ======================================================
  return {
    recommended,
    savings,
    missingProducts,
    shoppingPlan,
    alternatives, // ✅ Now properly defined
    summary: {
      totalItems: normalizedProducts.reduce((sum, p) => sum + p.quantity, 0),
      uniqueProducts: normalizedProducts.length,
      platformsConsidered: Object.keys(platformMap).length,
    },
  };
};