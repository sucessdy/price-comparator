const { AppError } =
  require("../errors/AppError");

const errorMiddleware = (
  err,
  req,
  res,
  next
) => {

  console.error(err.stack);

  // ==============================
  // OPERATIONAL ERRORS
  // ==============================

  if (err instanceof AppError) {

    return res
      .status(err.statusCode)
      .json({

        success: false,

        error: {
          code: err.code,
          message: err.message,
        },

      });
  }

  // ==============================
  // UNKNOWN ERRORS
  // ==============================

  return res.status(500).json({

    success: false,

    error: {
      code: "INTERNAL_SERVER_ERROR",

      message:
        "Something went wrong",
    },

  });
};

module.exports =
  errorMiddleware;