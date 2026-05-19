// controllers/productController.js
const productService = require("../services/productService");
const { NotFoundError } = require("../errors/AppError");

// Reusable response formatter
const sendResponse = (res, data, message, statusCode = 200) => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

exports.addProduct = async (req, res) => {
  const result = await productService.addOrUpdateProduct(req.validatedData);
  
  sendResponse(
    res,
    result.product,
    result.type === "created" ? "Product created ✅" : "Price updated ✅",
    result.type === "created" ? 201 : 200
  );
};

exports.compareProduct = async (req, res) => {
  const result = await productService.compareProduct(req.validatedQuery.product);
  
  if (!result) throw new NotFoundError("Product");
  
  sendResponse(res, result, "Product comparison retrieved");
};

exports.optimizeCart = async (req, res) => {
  const result = await productService.optimizeCart(req.validatedData.products);
  
  if (!result.recommended) throw new NotFoundError("Cart optimization");
  
  sendResponse(res, result, "Cart optimization completed");
};