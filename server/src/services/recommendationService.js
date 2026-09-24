// const productRepository = require("../repositories/productRepository");
const searchProducts =require("./search/searchServices") ; 
const { ValidationError, NotFoundError } = require("../errors/AppError");
const {createOffer} = require("./offer/offerService") ; 
exports.recommendationService = async ({ category, budget, priority }) => {
  if (!category) {
    throw new ValidationError("Product category is required");
  }

  // const products = await productRepository.searchProducts(category);
  const products = await searchProducts(category) ; 

  if (!products.length) {
    throw new NotFoundError(
      `Products in "${category}" not found`
    );
  }

  const filteredProducts = products.filter(
    (product) => budget == null || product.price <= budget
  );

  if (!filteredProducts.length) {
    throw new NotFoundError(
      `Products in "${category}" within your budget not found`
    );
  }

  filteredProducts.sort((a, b) => a.price - b.price);

  return filteredProducts.slice(0, 3).map((product) => ({
    id: product._id ?? null,
  ...createOffer(product) ,

    // name: product.name,
    // price: product.price,
    // platform: product.platform,
  
    reason: `Fits your ${category} requirement${
      budget ? ` and stays within ₹${budget}` : ""
    }.`,
  }));
};