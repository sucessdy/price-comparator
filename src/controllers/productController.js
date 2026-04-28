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

    let result = {};
    let totalCost = 0;

    for (let item of products) {
      const name = item.toLowerCase();

      const entries = await Product.find({ name });

      if (entries.length === 0) {
        result[name] = "Not found";
        continue;
      }

      let cheapest = null;
      let lowest = Infinity;

      entries.forEach((p) => {
        if (p.price < lowest) {
          lowest = p.price;
          cheapest = p.platform;
        }
      });

      result[name] = {
        platform: cheapest,
        price: lowest,
      };

      totalCost += lowest;
    }

    res.json({
      cart: result,
      totalCost,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};