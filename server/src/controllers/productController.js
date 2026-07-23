const productService = require("../services/productService");
const { ValidationError } = require("../errors/AppError");
const sendResponse = require("../utils/sendResponse");

// ======================================================
// ADD OR UPDATE PRODUCT
// ======================================================
exports.addProduct = async (req, res) => {
  const result = await productService.addOrUpdateProduct(req.validatedData);

  sendResponse(res, {
    statusCode: result.type === "created" ? 201 : 200,
    message: result.type === "created" ? "Product created successfully" : "Product updated successfully",
    data: result.product,
  });
};

// ======================================================
// COMPARE PRODUCT
// ======================================================
exports.compareProduct = async (req, res) => {
  const productName = req.query.product;
  
  if (typeof productName !== "string" || !productName.trim()) {
    throw new ValidationError("Product name is required");
  }
  
  const result = await productService.compareProduct(productName);
  
  sendResponse(res, {
    message: "Product comparison retrieved successfully",
    data: result,
  });
};

// ======================================================
// OPTIMIZE CART
// ======================================================
exports.optimizeCart = async (req, res) => {
  let products = req.validatedData?.products || req.body?.products;
  
  if (!products || !Array.isArray(products) || products.length === 0) {
    throw new ValidationError("Products array is required");
  }
  
  const result = await productService.optimizeCart(products);
  
  sendResponse(res, {
    message: "Cart optimized successfully",
    data: result,
  });
};
