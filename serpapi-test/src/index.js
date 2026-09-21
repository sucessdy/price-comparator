require("dotenv").config();

const axios = require("axios");
const normalizedProduct = require("./normalizer");

const API_KEY = process.env.SERPAPI_KEY;

async function searchProducts() {
  try {
    const response = await axios.get(
      "https://serpapi.com/search.json",
      {
        params: {
          engine: "google_shopping",
          q: "wireless earbuds",
          api_key: API_KEY,
          gl: "in",
          hl: "en",
        },
      }
    );

    const results = response.data.shopping_results || [];

    const products = results.map(normalizedProduct);

    console.log(products);
  } catch (error) {
    console.error(
      "SerpApi Error:",
      error.response?.data || error.message
    );
  }
}

searchProducts();