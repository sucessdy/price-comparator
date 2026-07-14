const { AppError } = require("../errors/AppError");

const errorMiddleware = (err, req, res, next) => {
  console.error("🔥 Error caught by middleware:");
  console.error("Error name:", err.name);
  console.error("Error message:", err.message);
  console.error("Error stack:", err.stack);

  // ==============================
  // OPERATIONAL ERRORS
  // ==============================
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code || "APP_ERROR",
        message: err.message,
      },
    });
  }

  // ==============================
  // MONGOOSE VALIDATION ERRORS
  // ==============================
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: messages.join(', '),
      },
    });
  }

  // ==============================
  // MONGOOSE DUPLICATE KEY ERROR
  // ==============================
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(409).json({
      success: false,
      error: {
        code: "DUPLICATE_ERROR",
        message: `${field} already exists`,
      },
    });
  }

  // ==============================
  // JWT ERRORS
  // ==============================
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      success: false,
      error: {
        code: "INVALID_TOKEN",
        message: "Invalid token",
      },
    });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      success: false,
      error: {
        code: "TOKEN_EXPIRED",
        message: "Token expired",
      },
    });
  }

  // ==============================
  // UNKNOWN ERRORS
  // ==============================
  console.error("❌ Unhandled error:", err);
  return res.status(500).json({
    success: false,
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: "Something went wrong",
    },
  });
};

module.exports = errorMiddleware;