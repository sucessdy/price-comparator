const fs = require("fs");
const path =require("path")
const platforms = [
  "amazon",
  "flipkart",
  "myntra",
  "ajio",
  "croma",
  "reliance digital",
  "vijay sales",
  "tatacliq",
  "snapdeal",
  "meesho",
  "zepto",
  "blinkit",
  "bigbasket",
  "jiomart",
  "paytm mall",
  "shopclues",
];

const productNames = [
  "milk",
  "bread",
  "eggs",
  "butter",
  "rice",
  "atta",
  "oil",
  "ice cream",
  "drinks",
  "water",
  "sugar",
  "tea",
  "coffee",
  "iphone 15",
  "iphone 14",
  "samsung s23",
  "oneplus 11",
  "macbook air",
  "macbook pro",
  "airpods pro",
  "boat earbuds",
  "sony headphones",
  "ipad air",
];

// Base prices for each product
const basePrices = {
  // Groceries
  milk: 34,
  bread: 45,
  eggs: 60,
  butter: 120,
  rice: 85,
  atta: 42,
  oil: 180,
  sugar: 55,
  tea: 250,
  coffee: 450,
  
  // Electronics
  "boat earbuds": 899,
  "sony headphones": 4999,
  "iphone 14": 59999,
  "iphone 15": 69999,
  "samsung s23": 64999,
  "oneplus 11": 54999,
  "ipad air": 59999,
  "macbook air": 99999,
  "macbook pro": 149999,
  "airpods pro": 24999,
};
const categories = {
  milk: "groceries",
  bread: "groceries",
  eggs: "groceries",
  butter: "groceries",
  rice: "groceries",
  atta: "groceries",
  oil: "groceries",
  sugar: "groceries",
  tea: "groceries",
  coffee: "groceries",

  "iphone 15": "smartphones",
  "iphone 14": "smartphones",
  "samsung s23": "smartphones",
  "oneplus 11": "smartphones",

  "macbook air": "laptops",
  "macbook pro": "laptops",
  "ipad air": "tablets",

  "airpods pro": "audio",
  "boat earbuds": "audio",
  "sony headphones": "audio",
};

// Function to generate random price variation (±20%)
function randomPrice(basePrice) {
  const variation = Math.floor(Math.random() * (basePrice * 0.4) - (basePrice * 0.2));
  return Math.max(1, basePrice + variation);
}

// Function to generate random date within last 30 days
function randomDate() {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * 30));
  return date;
}

const data = [];

// Generate data for each product on each platform
for (const productName of productNames) {
  const basePrice = basePrices[productName];
  
  if (!basePrice) {
    console.warn(`No base price for ${productName}, skipping...`);
    continue;
  }
  
  for (const platform of platforms) {
    // Generate current price (with some variation from base)
    const currentPrice = randomPrice(basePrice);
    
    // Generate price history (3-5 historical prices)
    const priceHistory = [];
    const historyCount = Math.floor(Math.random() * 3) + 3; // 3-5 history entries
    
    for (let i = 0; i < historyCount; i++) {
      const historicalPrice = randomPrice(basePrice);
      priceHistory.push({
        price: historicalPrice,
        date: randomDate(),
      });
    }
    
    // Sort price history by date (oldest first)
    priceHistory.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    data.push({
      name: productName.toLowerCase(),
      price: currentPrice,
      platform: platform.toLowerCase(),
      category: categories[productName],
      priceHistory: priceHistory,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
}

// Write to file
// fs.writeFileSync("dummyData.json", JSON.stringify(data, null, 2));
fs.writeFileSync(
  path.join(__dirname, "dummyData.json"),
  JSON.stringify(data, null, 2),
);
console.log(`✅ Dummy data generated! Total entries: ${data.length}`);
console.log(`📊 Products: ${productNames.length}, Platforms: ${platforms.length}`);
console.log(`📦 Total combinations: ${productNames.length} × ${platforms.length} = ${data.length}`);

// Optional: Log sample of first 3 entries
console.log("\n📝 Sample entries:");
console.log(JSON.stringify(data.slice(0, 3), null, 2));