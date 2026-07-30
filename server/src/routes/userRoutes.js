const express = require("express");
const validate = require("../middleware/validate.middleware");
const asyncHandler = require("../utils/asyncHandler");
const router = express.Router();
const { registerSchema, loginSchema } = require("../validators/auth.validator");
const AuthControllers = require("../controllers/authController");
const authMiddleware = require("../middleware/auth.middleware");

// Test route
router.get("/test", (req, res) => {
  console.log("✅ Test route hit!");
  res.json({ 
    success: true, 
    message: "Auth routes are working!",
    timestamp: new Date().toISOString()
  });
});

// 📌 Add a raw test route to check if body parsing works
router.post("/test-body", (req, res) => {
  console.log("📨 Test body route hit!");
  console.log("📦 Body:", req.body);
  res.json({
    success: true,
    message: "Body received!",
    body: req.body
  });
});

// Register route with detailed logging
router.post(
  "/register",
  (req, res, next) => {
    console.log("\n🔴 REGISTER ROUTE HIT!");
    console.log("📦 Request body:", JSON.stringify(req.body, null, 2));
    console.log("📦 Content-Type:", req.headers['content-type']);
    next();
  },
  validate(registerSchema),
  asyncHandler(AuthControllers.register)
);

router.post(
  "/login",
  (req, res, next) => {
    console.log("\n🔴 LOGIN ROUTE HIT!");
    console.log("📦 Request body:", JSON.stringify(req.body, null, 2));
    next();
  },
  validate(loginSchema),
  asyncHandler(AuthControllers.login)
);

router.post("/refresh", asyncHandler(AuthControllers.refreshToken));
router.get("/me", authMiddleware, asyncHandler(AuthControllers.getMe));
router.post("/logout", authMiddleware, asyncHandler(AuthControllers.logout));

module.exports = router;