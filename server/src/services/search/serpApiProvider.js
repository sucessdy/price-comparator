const axios = require("axios");

const API_KEY = process.env.SERPAPI_KEY;
if (!API_KEY) {
  throw new Error("SERPAPI_KEY is missing");
}
// https://serpapi.com/search.json
async function searchShopping(query) {
  const response = await axios.get("https://serpapi.com/search", {
    params: {
      engine: "google_shopping",
      q: query,
      api_key: API_KEY,
      gl: "in",
      hl: "en",
    },
  });

 return response.data.shopping_results || [];


}

module.exports = searchShopping ; 


