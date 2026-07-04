const express = require("express");
const validate = require("../middleware/validate.middleware");
const asyncHandler = require("../errors/asyncHandler");
const router = express.Router();
const { registerSchema, loginSchema } = require("../validators/auth.validator");
const AuthControllers = require("../controllers/authController");
router.post(
  "/register",
  validate(registerSchema),
  asyncHandler(AuthControllers.register),
);
router.post(
  "/login",
  validate(loginSchema),
  asyncHandler(AuthControllers.login),
);
router.post("/refresh", asyncHandler(AuthControllers.refreshToken));

// Protected routes
router.get("/me", authMiddleware, asyncHandler(AuthControllers.getMe));

router.post("/logout", asyncHandler(AuthControllers.logout));
module.exports = router;
