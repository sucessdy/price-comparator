class AppError extends Error {
  constructor(message, statusCode, code ) {
    super(message) ; 
    this.message = message;
    this.code = code ;
    // this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

class NotFoundError extends AppError {
  constructor(resources) {
    super(`${resources} not found `, 404 ,  "RESOURCE_NOT_FOUND");
  }
}

class ValidationError extends AppError {
  constructor(message) {
     const errorMessage = Array.isArray(message) 
      ? message.map(m => m.message).join(', ')
      : message;
    super(errorMessage, 400, "VALIDATION_ERROR");
  }
}

module.exports = { AppError, NotFoundError, ValidationError };
