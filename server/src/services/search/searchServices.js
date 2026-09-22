const { client } = require("../../config/redis");
const searchShopping = require("./serpApiProvider");
const normalizedProduct = require("../../utils/normalizer");

function createCacheKey(query) {
  const normalizedQuery = query
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-");

  return `search:${normalizedQuery}`;
}

async function searchProduct(query) {
  const cacheKey = createCacheKey(query);

  const cachedData = await client.get(cacheKey);

  if (cachedData) {
    console.log("Redis hit");
    return JSON.parse(cachedData);
  }

  console.log("Redis miss");

  const result = await searchShopping(query);

  const products = result.map(normalizedProduct);

  await client.set(cacheKey, JSON.stringify(products), {
    EX: 700,
  });

  return products;
}

module.exports = searchProduct ;