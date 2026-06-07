const express = require("express");

const router = express.Router();
const {optimiseCartSchema }= require("../validators/optimiseValidators")
const productController = require("../controllers/productController");
const validate = require("../middleware/validate.middleware");
const asyncHandler = require("../errors/asyncHandler");
const { productSchema } = require("../validators/ProductValidators");

// ==============================
// ADD PRODUCT
// ==============================

router.post(
  "/product",

  validate(productSchema),

  asyncHandler(
    productController.addProduct
  )
);

// ==============================
// COMPARE PRODUCT
// ==============================

router.get(
  "/compare",

  asyncHandler(
    productController.compareProduct
  )
);

// ==============================
// OPTIMIZE CART
// ==============================
// console.log(typeof validate);
router.post(
  "/optimize-cart",
validate(optimiseCartSchema), 
 
  asyncHandler(
    productController.optimizeCart
  )
); 


module.exports = router;