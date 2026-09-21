const { client } = require("redis");
const { searchShopping } = require("./serpApiProvider");
const normalizedProduct = require("./../../utils/normalizer");
function createCacheKey(query) {
  const normalizedQuery = query.trim().toLowerCase().replace(/\s+/g, "-");
  return `search:${normalizedQuery}`;
}

