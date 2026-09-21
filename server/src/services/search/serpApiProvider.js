const axios = require("axios");

const API_KEY = process.env.SERPAPI_KEY;

async function searchShopping(query) {
  const response = await axios.get("https://serpapi.com/search.json", {
    params: {
      engine: "google_shopping",
      q: "wireless earbuds",
      api_key: API_KEY,
      gl: "in",
      hl: "en",
    },
  });

   return response.data.shopping_results || [];


}

module.exports = searchShopping ; 


