const Product = require("../model/productModel");
const cache = {} ; 
const CACHE_TTL = 60*1000;

exports.addProduct = async (req, res) => {
  try {
    const { name, price, platform } = req.body;

    if (!name || price == null || !platform) {
      return res.status(400).json({
        error: "name, price and platform are required",
      });
    }

    const normalizedName = name.toLowerCase();

    const existing = await Product.findOne({
      name: normalizedName,
      platform,
    });
   
    if (existing) {
      delete cache[normalizedName];

      existing.priceHistory.push({
        price: existing.price,
      });

      existing.price = price;

      await existing.save();

      return res.json({
        message: "Price updated ✅",
        product: existing,
      });
    }

    delete cache[normalizedName];

    const newProduct = new Product({
      name: normalizedName,
      price,
      platform,
      priceHistory: [],
    });

    await newProduct.save();

    res.status(201).json({
      message: "Product added",
      product: newProduct,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.compareProduct = async (req, res) => {
  try {
    const productName = req.query.product?.toLowerCase();

    if (!productName) {
      return res.status(400).json({
        error: "Product query is required",
      });
    }

    const cached = cache[productName];

if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
  return res.json({
    ...cached.data,
    source: "cache ⚡",
  });
}

// DB query
const items = await Product.find({ name: productName });

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

const result = {
  product: productName,
  prices,
  cheapest,
};

// ✅ FIXED
cache[productName] = {
  data: result,
  timestamp: Date.now(),
};

res.json({
  ...result,
  source: "DB 🐢",
});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// optimse the cart
exports.optimizeCart = async (req, res) => {
  try {
    const { products } = req.body;

    if (!products || products.length === 0) {
      return res.status(400).json({
        error: "Products array is required",
      });
    }

    const names = products.map(p => p.toLowerCase());

    // 🔥 Get all relevant products in ONE query
    const allItems = await Product.find({
      name: { $in: names }
    });

    if (allItems.length === 0) {
      return res.status(404).json({
        error: "No products found",
      });
    }

    // 🧠 Group by platform
    let platformMap = {};

    allItems.forEach(item => {
      if (!platformMap[item.platform]) {
        platformMap[item.platform] = {};
      }

      platformMap[item.platform][item.name] = item.price;
    });

    let bestPlatform = null;
    let lowestTotal = Infinity;

    // 🧮 Calculate total per platform
    for (let platform in platformMap) {
      let total = 0;
      let valid = true;

      for (let name of names) {
        if (!platformMap[platform][name]) {
          valid = false;
          break;
        }
        total += platformMap[platform][name];
      }

      if (valid && total < lowestTotal) {
        lowestTotal = total;
        bestPlatform = platform;
      }
    }

    // ⚡ fallback (if no single platform has all)
    if (!bestPlatform) {
      return res.json({
        message: "No single platform has all items",
      });
    }

    res.json({
      bestPlatform,
      totalCost: lowestTotal,
      note: "All items from one platform ✅",
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};