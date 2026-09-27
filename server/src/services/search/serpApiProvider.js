const axios = require("axios");

const API_KEY = process.env.SERPAPI_KEY;

if (!API_KEY) {
  throw new Error("SERPAPI_KEY is missing");
}

async function searchShopping(query, noCache = false) {
  const response = await axios.get("https://serpapi.com/search", {
    params: {
      engine: "google_shopping",
      q: query,
      api_key: API_KEY,
      gl: "in",
      hl: "en",
      ...(noCache && {
        no_cache: true,
      }),
    },
  });

  return response.data.shopping_results || [];
}

module.exports = searchShopping;