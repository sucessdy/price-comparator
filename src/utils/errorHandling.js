// middleware/error.middleware.js

const { AppError } = require("../errors");
const logger = require("../config/logger");

const errorMiddleware = (err, req, res, next) => {

  // ==============================
  // LOGGING / OBSERVABILITY
  // ==============================

  logger.error({
    message: err.message,
    code: err.code,
    statusCode: err.statusCode,
    stack:
      process.env.NODE_ENV === "development"
        ? err.stack
        : undefined,

    requestId: req.id,
    method: req.method,
    route: req.originalUrl,
    ip: req.ip,
    userId: req.user?.id || null,
    userAgent: req.get("user-agent"),
    timestamp: new Date().toISOString(),

    errorType: err.constructor.name
  });

  // ==============================
  // OPERATIONAL / EXPECTED ERRORS
  // ==============================

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,

      error: {
        code: err.code || "APPLICATION_ERROR",
        message: err.message
      },

      requestId: req.id
    });
  }

  // ==============================
  // UNKNOWN / PROGRAMMER ERRORS
  // ==============================

  return res.status(500).json({
    success: false,

    error: {
      code: "INTERNAL_SERVER_ERROR",

      message:
        process.env.NODE_ENV === "production"
          ? "Something went wrong"
          : err.message
    },

    requestId: req.id
  });
};

module.exports = errorMiddleware;