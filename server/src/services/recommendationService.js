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

  const uniqueProducts = [] ; 
  const seen = new Set() ; 
  for (const product of filteredProducts) { 
    const key = `${product.name.trim().toLowerCase()}-${(
    product.platform || ""

  ).trim().toLowerCase() }`
  if (seen.has(key)) { 
    continue;
  }
  seen.add(key) ; 
  uniqueProducts.push(product) ; 

  }

// uniqueProducts.sort((a, b) => a.price - b.price);

if (priority === "lowest-price") {
  uniqueProducts.sort((a, b) => a.price - b.price);
}

if (priority === "quality") {
  uniqueProducts.sort((a, b) => {
    const ratingA = a.rating ?? 0;
    const ratingB = b.rating ?? 0;

    if (ratingB !== ratingA) {
      return ratingB - ratingA;
    }

    const reviewsA = a.reviews ?? 0;
    const reviewsB = b.reviews ?? 0;

    if (reviewsB !== reviewsA) {
      return reviewsB - reviewsA;
    }

    return a.price - b.price;
  });
}

if (priority === "delivery") {
  const getDeliveryScore = (delivery) => {
    if (!delivery) return 0;

    const value = delivery.toLowerCase();

    if (value.includes("today")) return 3;
    if (value.includes("tomorrow")) return 2;
    if (value.includes("day")) return 1;

    return 0;
  };

  uniqueProducts.sort((a, b) => {
    const deliveryDifference =
      getDeliveryScore(b.delivery) - getDeliveryScore(a.delivery);

    if (deliveryDifference !== 0) {
      return deliveryDifference;
    }

    return a.price - b.price;
  });
}

if (!priority) {
  uniqueProducts.sort((a, b) => a.price - b.price);
}

 return uniqueProducts.slice(0, 5).map((product) => ({
  id: product._id ?? null,
  productKey: category.trim().toLowerCase(),
  ...createOffer(product),
  reason: `Fits your ${category} requirement${
    budget ? ` and stays within ₹${budget}` : ""
  }.`,
}));
};