const productService = require("../services/productService");
const { NotFoundError } = require("../errors/AppError");
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
  
  if (!productName) {
    throw new Error("Product name is required");
  }
  
  const result = await productService.compareProduct(productName);
  
  if (!result) {
    throw new NotFoundError("Product");
  }
  
  sendResponse(res, {
    message: "Product comparison retrieved successfully",
    data: result,
  });
};

// ======================================================
// OPTIMIZE CART
// ======================================================
exports.optimizeCart = async (req, res) => {
  console.log("BODY:", req.body);
  console.log("VALIDATED:", req.validatedData);
  

  let products = req.validatedData?.products || req.body?.products;
  
  if (!products || !Array.isArray(products) || products.length === 0) {
    throw new Error("Products array is required");
  }
  
  const result = await productService.optimizeCart(products);
  
  sendResponse(res, {
    message: "Cart optimized successfully",
    data: result,
  });
};