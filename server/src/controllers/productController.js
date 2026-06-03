// controllers/productController.js
const productService = require("../services/productService");
const { NotFoundError } = require("../errors/AppError");

const sendResponse = require("../utils/sendResponse")

exports.addProduct = async (req, res) => {

  const result =
    await productService.addOrUpdateProduct(
      req.validatedData
    );

  sendResponse(res, {
    statusCode:
      result.type === "created"
        ? 201
        : 200,

    message:
      result.type === "created"
        ? "Product created"
        : "Product updated",

    data: result.product,
  });

};
exports.compareProduct = async (req, res) => {
  
  // console.log("query:", req.query);
  // console.log("product:", req.query.product);
  const result = await productService.compareProduct(req.query.product);
   console.log(result);
  if (!result) throw new NotFoundError("Product");
  
  sendResponse(res,{
    message : "Product comparison retrieved",
    data : result
  });
};

exports.optimizeCart = async (req, res) => {
  const result = await productService.optimizeCart(req.validatedData.products);
  
  if (!result.recommended) throw new NotFoundError("Cart optimization");
  
  sendResponse(res, result, "Cart optimization completed");
};