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

exports.optimizeCart = async (
  products
) => {

  const normalizedNames =
    products.map((product) =>
      product.trim().toLowerCase()
    );

  // Fetch all matching products
  const allItems = await Product.find({
    name: {
      $in: normalizedNames,
    },
  });

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

    productsByName[item.name]
      .push(item);
  });

  // ======================================================
  // SPLIT CART STRATEGY
  // ======================================================

  const splitItems = {};

  const missingProducts = [];

  let splitTotalCost = 0;

  for (const name of normalizedNames) {

    const availableProducts =
      productsByName[name] || [];

    if (availableProducts.length === 0) {

      splitItems[name] = {
        available: false,
        message: "Not found",
      };

      missingProducts.push(name);

      continue;
    }

    // Find cheapest product
    const cheapestProduct =
      availableProducts.reduce(
        (min, current) =>
          current.price < min.price
            ? current
            : min
      );

    splitItems[name] = {
      available: true,
      platform:
        cheapestProduct.platform,
      price:
        cheapestProduct.price,
    };

    splitTotalCost +=
      cheapestProduct.price;
  }

  // ======================================================
  // SINGLE PLATFORM STRATEGY
  // ======================================================

  const platformMap = {};

  allItems.forEach((item) => {

    if (!platformMap[item.platform]) {
      platformMap[item.platform] = {};
    }

    platformMap[item.platform][
      item.name
    ] = item.price;
  });

  let bestPlatform = null;

  let lowestPlatformCost = Infinity;

  for (const platform in platformMap) {

    let totalCost = 0;

    let hasAllProducts = true;

    for (const name of normalizedNames) {

      const price =
        platformMap[platform][name];

      if (price == null) {
        hasAllProducts = false;
        break;
      }

      totalCost += price;
    }

    if (
      hasAllProducts &&
      totalCost < lowestPlatformCost
    ) {
      lowestPlatformCost =
        totalCost;

      bestPlatform = platform;
    }
  }

  // ======================================================
  // RECOMMEND BEST STRATEGY
  // ======================================================

  const splitCartAvailable =
    Object.values(splitItems)
      .every((item) => item.available);

  let recommended = null;

  if (
    bestPlatform &&
    splitCartAvailable
  ) {

    recommended =
      splitTotalCost <
      lowestPlatformCost

        ? {
            strategy: "split-cart",

            totalCost:
              splitTotalCost,

            details: splitItems,
          }

        : {
            strategy:
              "single-platform",

            platform:
              bestPlatform,

            totalCost:
              lowestPlatformCost,
          };

  } else if (bestPlatform) {

    recommended = {
      strategy:
        "single-platform",

      platform:
        bestPlatform,

      totalCost:
        lowestPlatformCost,
    };

  } else if (splitCartAvailable) {

    recommended = {
      strategy: "split-cart",

      totalCost:
        splitTotalCost,

      details: splitItems,
    };
  }

  // ======================================================
  // CALCULATE SAVINGS
  // ======================================================

  const savings =
    bestPlatform &&  
    splitCartAvailable &&
    splitTotalCost <
      lowestPlatformCost

      ? Number(
          (
            lowestPlatformCost -
            splitTotalCost
          ).toFixed(2)
        )

      : 0;

  // ======================================================
  // FINAL RESPONSE
  // ======================================================

  return {

    recommended,

    splitCart: {
      items: splitItems,

      totalCost:
        splitTotalCost,

      hasMissingItems:
        missingProducts.length > 0,
    },

    singlePlatform: 
      bestPlatform
        ? {
            platform:
              bestPlatform,

            totalCost:
              lowestPlatformCost,
          }
        : null,

    savings,

    missingProducts:
      missingProducts.length > 0
        ? missingProducts
        : [],
  };
};