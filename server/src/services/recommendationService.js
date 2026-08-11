const productRepository = require("../repositories/productRepository");
const { ValidationError, NotFoundError } = require("../errors/AppError");

exports.recommendationService = async ({ category, budget }) => {
  if (!category) {
    throw new ValidationError("Product category is required");
  }

  const products = await productRepository.findByCategory(
    category,
    budget
  );

  if (!products.length) {
    throw new NotFoundError(
      `Products in "${category}" within your budget`
    );
  }

  products.sort((a, b) => a.price - b.price);

  return products.slice(0, 3).map((product) => ({
    id: product._id,
    name: product.name,
    price: product.price,
    platform: product.platform,
    reason: `Fits your ${category} requirement${
      budget ? ` and stays within ₹${budget}` : ""
    }.`,
  }));
};