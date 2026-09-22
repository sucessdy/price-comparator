const express = require("express");
const router = express.Router();
const searchProductController = require("./../controllers/searchController");
const asyncHandler = require("../utils/asyncHandler");

router.get("/search", asyncHandler(searchProductController));

module.exports = router;
