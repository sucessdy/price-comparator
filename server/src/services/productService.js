const Product = require("../models/productModel");
const { NotFoundError } = require("../errors/AppError");

// add  product 

exports.addOrUpdateProduct = async ({
  name,
  price,
  platform,
}) => {

  const normalizedName =
    name.trim().toLowerCase();

  const normalizedPlatform =
    platform.trim().toLowerCase();

  // Find existing product
  const existing = await Product.findOne({ 
    name: normalizedName,
    platform: normalizedPlatform,
  });

  // ======================================================
  // UPDATE EXISTING PRODUCT
  // ======================================================

  if (existing) {

    const updatedProduct =
      await Product.findOneAndUpdate(
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
        }
      );

    return {
      type: "updated",
      product: updatedProduct,
    };
  }

  // ======================================================
  // CREATE NEW PRODUCT
  // ======================================================

  const newProduct =
    await Product.create({
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

exports.compareProduct = async (
  productName
) => {
    
  if (
  !productName ||
  typeof productName !== "string"
) {
  throw new Error(
    "Invalid product name"
  );
}
  const normalizedName =
    productName.trim().toLowerCase();

  const products =
    await Product.find({
      name: normalizedName,
    });
console.log(products)
console.log(typeof products) ;
  if (products.length === 0) {
    throw new NotFoundError("Product");
  }

  const prices = {};

  let cheapestPlatform = null;
  let lowestPrice = Infinity;

  products.forEach((product) => {

    prices[product.platform] =
      product.price;

    if (product.price < lowestPrice) {
      lowestPrice = product.price;
      cheapestPlatform =
        product.platform;
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

// ======================================================
// OPTIMIZE CART
// ======================================================


exports.optimizeCart = async (products) => {
  // FIX 1: Handle both array of strings AND array of objects with quantity
  const normalizedProducts = products.map(product => {
    // if (typeof product === 'string') {
    //   return {
    //     name: product.trim().toLowerCase(),
    //     quantity: 1
    //   };
    // }
    return {
      name: product.name.trim().toLowerCase(),
      quantity: product.quantity || 1
    };
  });

  // Extract unique names for database query
  const names = normalizedProducts.map(p => p.name);

  // Fetch all matching products from database
  const allItems = await Product.find({
    name: { $in: names },
  });

  console.log(`Found ${allItems.length} products in database`);
  
  if (allItems.length === 0) {
    throw new NotFoundError("Products");
  }

  // ======================================================
  // GROUP PRODUCTS BY NAME
  // ======================================================
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
  let splitTotalCost = 0;

  // FIX 2: Iterate over normalizedProducts, not names array
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

    // Find cheapest product for this item
    const cheapestProduct = availableProducts.reduce(
      (min, current) => current.price < min.price ? current : min
    );

    splitItems[productName] = {
      available: true,
      platform: cheapestProduct.platform,
      price: cheapestProduct.price,
      quantity: quantity, // Add quantity for reference
      totalPrice: cheapestProduct.price * quantity // Calculate total for this item
    };

    // FIX 3: Multiply by quantity
    splitTotalCost += cheapestProduct.price * quantity;
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

  // FIX 4: Check each platform for all products
  for (const platform in platformMap) {
    let totalCost = 0;
    let hasAllProducts = true;

    for (const cartItem of normalizedProducts) {
      const productName = cartItem.name;
      const quantity = cartItem.quantity;
      const price = platformMap[platform][productName];

      if (price == null) {
        hasAllProducts = false;
        break;
      }

      // FIX 5: Multiply by quantity
      totalCost += price * quantity;
    }

    if (hasAllProducts && totalCost < lowestPlatformCost) {
      lowestPlatformCost = totalCost;
      bestPlatform = platform;
    }
  }

  // ======================================================
  // RECOMMEND BEST STRATEGY
  // ======================================================
  const splitCartAvailable = Object.values(splitItems).every((item) => item.available);
  console.log(`Split cart available: ${splitCartAvailable}`);
  console.log(`Best platform: ${bestPlatform}`);

  let recommended = null;

  if (bestPlatform && splitCartAvailable) {
    // Both strategies available - choose cheaper
    if (splitTotalCost < lowestPlatformCost) {
      recommended = {
        strategy: "split-cart",
        totalCost: splitTotalCost,
        details: splitItems,
      };
    } else {
      recommended = {
        strategy: "single-platform",
        platform: bestPlatform,
        totalCost: lowestPlatformCost,
        details: splitItems, // Add details for shopping plan
      };
    }
  } else if (bestPlatform) {
    // Only single platform available
    recommended = {
      strategy: "single-platform",
      platform: bestPlatform,
      totalCost: lowestPlatformCost,
      details: splitItems, // Add details for shopping plan
    };
  } else if (splitCartAvailable) {
    // Only split cart available
    recommended = {
      strategy: "split-cart",
      totalCost: splitTotalCost,
      details: splitItems,
    };
  }

  // ======================================================
  // CALCULATE SAVINGS
  // ======================================================
 let savings = 0;

if (
  splitTotalCost <
  lowestPlatformCost
) {
  savings =
    lowestPlatformCost -
    splitTotalCost;
}

  // ======================================================
  // CREATE SHOPPING PLAN (for frontend display)
  // ======================================================
  const shoppingPlan = [];
  
  if (recommended && recommended.details) {
    for (const [productName, details] of Object.entries(recommended.details)) {
      if (details.available) {
        shoppingPlan.push({
          product: productName,
          platform: details.platform,
          price: details.price,
          quantity: details.quantity || 1,
          totalPrice: details.totalPrice || details.price
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
    missingProducts: missingProducts,
    shoppingPlan: shoppingPlan, // Add this for frontend
    summary: {
      totalItems: normalizedProducts.reduce((sum, p) => sum + p.quantity, 0),
      uniqueProducts: normalizedProducts.length,
      platformsConsidered: Object.keys(platformMap).length
    }
  };
};