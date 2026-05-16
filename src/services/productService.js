const Product = require("../models/productModel");

const Joi = require("joi");
const productSchema =
  Joi.object *
  {
    name: Joi.string().required().min(2).max(100),
    price: Joi.number().required().min(0).max(10000000),
    product: Joi.string().required(),
    // valid("")
  };
exports.addOrUpdateProduct = async ({ name, price, platform }) => {
  const { error } = productSchema.validate({
    name,
    price,
    product,
  });
  if (error) throw new Error(`Validate Input :  ${error.message}`);

  const normalizedName = name.trim().toLowerCase();
  const normalizedPlatform = platform.trim().toLowerCase();

  const existing = await Product.findOne({
    name: normalizedName,
    platform: normalizedPlatform,
  });
  // we use atomic operation

  if (existing) {
    const update = await Product.findOneAndUpdate(
      {
        name: normalizedName,
        platform: normalizedPlatform,
      },
      {
        $set: { price: price },
        $push: { priceHistory: { price: existing.price, date: new Date() } },
      },
    );
    return { type: "update", product: update };
  }

  const newProduct = await Product.create({
    name: normalizedName,
    price,
    platform: normalizedPlatform,
    priceHistory: [],
  });

  return { type: "created", product: newProduct };
};

// 🟢 Compare Product
exports.compareProduct = async (productName) => {
  const name = productName.trim().toLowerCase();

  const items = await Product.find({ name });

  if (items.length === 0) {
    throw new Error("Product not found");
  }

  let prices = {};
  let cheapest = null;
  let lowest = Infinity;

  items.forEach((p) => {
    prices[p.platform] = p.price;

    if (p.price < lowest) {
      lowest = p.price;
      cheapest = p.platform;
    }
  });

  return {
    product: name,
    prices,
    cheapest,
  };
};


exports.optimizeCart = async (products) => {
 
  const names = products.map((p) => p.trim().toLowerCase());

  
  const allItems = await Product.find({
    name: { $in: names },
  });


  if (allItems.length === 0) {
    throw new Error("No matching products found");
  }

  
  const platformMap = {};

  allItems.forEach((item) => {
    if (!platformMap[item.platform]) {
      platformMap[item.platform] = {
        totalCost: 0,
        products: {},
      };
    }

    platformMap[item.platform].products[item.name] = item.price;
  });

  // 5️⃣ Calculate totals
  const platformComparison = [];

  for (let platform in platformMap) {
    let valid = true;
    let total = 0;

    for (let name of names) {
      const price = platformMap[platform].products[name];

      if (price == null) {
        valid = false;
        break;
      }

      total += price;
    }

    // only complete carts
    if (valid) {
      platformMap[platform].totalCost = total;

      platformComparison.push({
        platform,
        totalCost: total,
      });
    }
  }

  // 6️⃣ No complete platform
  if (platformComparison.length === 0) {
    return {
      recommended: null,

      platformComparison: [],

      missing: names,

      meta: {
        confidence: "low",
        updatedAt: new Date(),
      },
    };
  }

  // 7️⃣ Sort cheapest first
  platformComparison.sort((a, b) => a.totalCost - b.totalCost);

  // 8️⃣ Best platform
  const best = platformComparison[0];

  // 9️⃣ Build recommendation
  const recommended = {
    strategy: "single-platform",

    platform: best.platform,

    totalCost: best.totalCost,

    reason: ["All products available", "Lowest total cost", "Single checkout"],
  };

  // 🔟 Missing products
  const foundProducts = new Set(allItems.map((p) => p.name));

  const missing = names.filter((name) => !foundProducts.has(name));

  // 1️⃣1️⃣ Final response
  return {
    recommended,

    platformComparison,

    missing,

    meta: {
      confidence: "medium",
      updatedAt: new Date(),
    },
  };
};
