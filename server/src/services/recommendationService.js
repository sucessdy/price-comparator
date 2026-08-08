const productRepository = require("../repositories/productRepository");
const { ValidationError, NotFoundError } = require("../errors/AppError");

exports.recommdationServices = async ({ category, budget }) => {
  if (!category) {
    throw new ValidationError("Product category is required");
  }

  const products = await productRepository.findByCategory(category);

  if (!products.length) {
    throw new NotFoundError(`Products in "${category}"`);
  }

  let candidates = products;

  if (budget) {
    candidates = products.filter((product) => product.price <= budget);
  }

  if (!candidates.length) {
    throw new NotFoundError(`Products in "${category}" within your budget`);
  }

  candidates.sort((a, b) => a.price - b.price);

  return candidates.slice(0, 3).map((product) => ({
    id: product._id,
    name: product.name,
    price: product.price,
    platform: product.platform,
    reason: `Fits your ${category} requirement${
      budget ? ` and stays within ₹${budget}` : ""
    }.`,
  }));
};
