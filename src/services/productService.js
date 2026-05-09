const Product = require("../model/productModel");

// 🟢 Add / Update Product
exports.addOrUpdateProduct = async ({ name, price, platform }) => {
  const normalizedName = name.trim().toLowerCase();
  const normalizedPlatform = platform.trim().toLowerCase();

  const existing = await Product.findOne({
    name: normalizedName,
    platform: normalizedPlatform,
  });

  if (existing) {
    existing.priceHistory.push({ price: existing.price });
    existing.price = price;
    await existing.save();

    return {
      type: "updated",
      product: existing,
    };
  }

  const newProduct = new Product({
    name: normalizedName,
    price,
    platform: normalizedPlatform,
    priceHistory: [],
  });

  await newProduct.save();

  return {
    type: "created",
    product: newProduct,
  };
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

// 🟢 Optimize Cart
// exports.optimizeCart = async (products) => {
//   const names = products.map((p) => p.trim().toLowerCase());

//   const allItems = await Product.find({
//     name: { $in: names },
//   });

//   if (allItems.length === 0) {
//     throw new Error("No products found");
//   }

//   // Group by name
//   const groupedByName = {};
//   allItems.forEach((p) => {
//     if (!groupedByName[p.name]) {
//       groupedByName[p.name] = [];
//     }
//     groupedByName[p.name].push(p);
//   });

//   // Split-cart (cheapest per item)
//   let splitResult = {};
//   let splitTotal = 0;

//   names.forEach((name) => {
//     const items = groupedByName[name] || [];

//     if (items.length === 0) {
//       splitResult[name] = { status: "not found" };
//       return;
//     }

//     const cheapest = items.reduce((min, curr) =>
//       curr.price < min.price ? curr : min
//     );

//     splitResult[name] = {
//       platform: cheapest.platform,
//       price: cheapest.price,
//     };

//     splitTotal += cheapest.price;
//   });

//   // Group by platform
//   const platformMap = {};
//   allItems.forEach((item) => {
//     if (!platformMap[item.platform]) {
//       platformMap[item.platform] = {};
//     }
//     platformMap[item.platform][item.name] = item.price;
//   });

//   // Single platform
//   let bestPlatform = null;
//   let lowestTotal = Infinity;

//   for (let platform in platformMap) {
//     let total = 0;
//     let valid = true;

//     for (let name of names) {
//       if (platformMap[platform][name] == null) {
//         valid = false;
//         break;
//       }
//       total += platformMap[platform][name];
//     }

//     if (valid && total < lowestTotal) {
//       lowestTotal = total;
//       bestPlatform = platform;
//     }
//   }

//   return {
//     singlePlatform: bestPlatform
//       ? { platform: bestPlatform, totalCost: lowestTotal }
//       : null,
//     splitCart: {
//       items: splitResult,
//       totalCost: splitTotal,
//     },
//   };
// };

exports.optimizeCart = async (products) => {

  // 1️⃣ Normalize input
  const names = products.map(
    (p) => p.trim().toLowerCase()
  );

  // 2️⃣ Fetch all matching products
  const allItems = await Product.find({
    name: { $in: names }
  });

  // 3️⃣ No products found
  if (allItems.length === 0) {
    throw new Error("No matching products found");
  }

  // 4️⃣ Group by platform
  const platformMap = {};

  allItems.forEach((item) => {

    if (!platformMap[item.platform]) {
      platformMap[item.platform] = {
        totalCost: 0,
        products: {},
      };
    }

    platformMap[item.platform]
      .products[item.name] = item.price;

  });

  // 5️⃣ Calculate totals
  const platformComparison = [];

  for (let platform in platformMap) {

    let valid = true;
    let total = 0;

    for (let name of names) {

      const price =
        platformMap[platform]
          .products[name];

      if (price == null) {
        valid = false;
        break;
      }

      total += price;
    }

    // only complete carts
    if (valid) {

      platformMap[platform]
        .totalCost = total;

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
  platformComparison.sort(
    (a, b) => a.totalCost - b.totalCost
  );

  // 8️⃣ Best platform
  const best = platformComparison[0];

  // 9️⃣ Build recommendation
  const recommended = {
    strategy: "single-platform",

    platform: best.platform,

    totalCost: best.totalCost,

    reason: [
      "All products available",
      "Lowest total cost",
      "Single checkout",
    ],
  };

  // 🔟 Missing products
  const foundProducts = new Set(
    allItems.map((p) => p.name)
  );

  const missing = names.filter(
    (name) => !foundProducts.has(name)
  );

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