const express = require("express");
const router = express.Router();

const { optimiseCartSchema } = require("../validators/optimiseValidators");
const { productSchema } = require("../validators/ProductValidators");
const productController = require("../controllers/productController");
const validate = require("../middleware/validate.middleware");
const asyncHandler = require("../errors/asyncHandler");

// ==============================
// ADD/UPDATE PRODUCT
// ==============================
router.post(
  "/product",
  validate(productSchema),
  asyncHandler(productController.addProduct)
);

// ==============================
// COMPARE PRODUCT
// ==============================
router.get(
  "/compare",
  asyncHandler(productController.compareProduct)
);

// ==============================
// OPTIMIZE CART    
// ==============================
router.post(
  "/optimize-cart",  // Changed from /optimize-cart for consistency
  validate(optimiseCartSchema),
  asyncHandler(productController.optimizeCart)
);

module.exports = router;