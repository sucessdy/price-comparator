const { ValidationError } = require("../errors/AppError");
const { searchProduct } = require("./../services/search/searchServices");

async function searchProductsController(req, res, next) {
  try {
    const { q } = req.query;
    if (!q) {
      throw new ValidationError("Search query is required");
    }

    const products = await searchProduct(q);
    return res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = searchProductsController;
