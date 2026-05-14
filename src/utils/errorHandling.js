const errorHandler = (err, req, res, next) => {
 logger.error({
   message: err.message,
   stack: err.stack,
   requestId: req.id,
   route: req.originalUrl,
   method: req.method,
   userId: req.user?.id
});

   if (err instanceof AppError) {
      return res.status(err.statusCode).json({
         success: false,
         message: err.message
      });
   }

   return res.status(500).json({
      success: false,
      message:
         process.env.NODE_ENV === "production"
            ? "Internal server error"
            : err.message
   });
};