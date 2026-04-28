const express = require("express") 
const router = express.Router() ; 
const {
    addProduct,
    compareProduct, 
    optimizeCart
  } = require("../controllers/productController");

  router.post("/product" , addProduct)
  router.get("/compare", compareProduct)
  router.post("/optimize-cart", optimizeCart);
  module.exports = router ; 
  