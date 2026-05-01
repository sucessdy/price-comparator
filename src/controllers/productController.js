const Product = require("../model/productModel");
const cache = {} ; 
const CACHE_TTL = 60*1000;



// can imporve You’ll eventually need centralized cache helper 

exports.addProduct = async (req, res) => {
  try {
    const { name, price, platform } = req.body;

    if (
      typeof name !== "string" ||
      !name.trim() ||
      typeof price !== "number" ||
      price < 0 ||
      !platform ||
      typeof platform !== "string"
    ) {
      return res.status(400).json({
        error:
          "Invalid input: Ensure name is a non-empty string, price is a non-negative number, and platform is a non-empty string"
      });
    }

    const normalizedName = name.toLowerCase(); // normalize the name to lowercase
const normalizedPlatform = platform.toLowerCase() ; 
    const existing = await Product.findOne({
      name: normalizedName,
      platform : normalizedPlatform,
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
if (items.length === 0) {
  return res.status(404).json({
    error: "Product not found"
  });
}
// console.log("DB items:", items);
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
if (items.length > 0){ 
  cache[productName] = {
    data: result,
    timestamp: Date.now(),
  };
}


res.json({
  ...result,
  source: "DB 🐢",
});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* 
Senior note
Edge case: if no items found, it currently returns { product, prices: {}, cheapest: null }.
Better to return 404 or clear message.
In-memory cache resets on server restart and won’t scale across multiple instances. For production, use Redis.
*/

// optimse the cart
exports.optimizeCart = async (req, res) => {
  try {
    const { products } = req.body;

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({
        error: "Products array is required",
      });
    }

    const invalidProduct = products.some(
      (p) => typeof p !== "string" || !p.trim()
    );
    if (invalidProduct) {
      return res.status(400).json({
        error: "Each product must be a non-empty string",
      });
    }

    const names = products.map((p) => p.trim().toLowerCase());

    // 🔥 Get all relevant products in ONE query
    const allItems = await Product.find({
      name: { $in: names }
    });

    if (allItems.length === 0) {
      return res.status(404).json({
        error: "No products found",
      });
    }
// 🧠 Group by name (for split-cart optimization)
const groupedByName = {};
allItems.forEach(p => {
  if (!groupedByName[p.name]) {
    groupedByName[p.name] = [];
  }
  groupedByName[p.name].push(p);
});

// 🔥 Split-cart (cheapest per item)

const splitResult = {};
let splitTotal = 0;

for (let name of names) {
  const items = groupedByName[name] || [];
  if (items.length === 0) {
    splitResult[name] = {
     
      status: "not found"
    };
    continue;
  }

  let cheapest = null;
  let lowest = Infinity;

  items.forEach(p => {
    if (p.price < lowest) {
      lowest = p.price;
      cheapest = p.platform;
    }
  });

  splitResult[name] = {
    platform: cheapest,
    price: lowest,
  };

  if (lowest !== Infinity) {
    splitTotal += lowest;
  }
}

// 🧠 Group by platform (for single-platform optimization)
const platformMap = {};

allItems.forEach(item => {
  if (!platformMap[item.platform]) {
    platformMap[item.platform] = {};
  }
  platformMap[item.platform][item.name] = item.price;
});

// 🔥 Single platform best option
let bestPlatform = null;
let lowestTotal = Infinity;

for (let platform in platformMap) {
  let total = 0;
  let valid = true;

  for (let name of names) {
    if (platformMap[platform][name] == null) {
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
const missing = names.filter(name => !groupedByName[name])
// ✅ Final response
res.json({
  missing, 
  singlePlatform: bestPlatform
    ? { 
     
        platform: bestPlatform,
        totalCost: lowestTotal,
      }
    : null,

  splitCart: {
    items: splitResult,
    totalCost: splitTotal,
  }
});

  

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};