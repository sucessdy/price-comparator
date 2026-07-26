class AppError extends Error {
  constructor(message, statusCode, code ) {
    super(message) ; 
   this.statusCode = statusCode;
    this.code = code ;
  
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

class NotFoundError extends AppError {
  constructor(resources) {
    super(`${resources} not found`, 404 ,  "RESOURCE_NOT_FOUND");
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

class ConflictError extends AppError{ 
  constructor(message){
    const confictMessage = Array.isArray(message) ? message.map(m=> m.message ).join(", ") : message; 
    super(confictMessage, 409, "CONFLICT_ERROR")
  }
}
class UnauthorizedError extends AppError { 
  constructor(message) {
    const UnauthorizedMessage = Array.isArray(message) ? message.map(m => m.message ).join(", ") : message; 
    super(UnauthorizedMessage, 401, "UNAUTHORIZED_ERROR")
  }
}


class  ForbiddenError extends    AppError{
  constructor(message){
    const forbidden = Array.isArray(message) ? message.map(m=> m.message ).join(' ') : message ; 

    super (forbidden , 403 , "FORBIDDEN_ERROR" ) 
  }
}                                                                                 

module.exports = { AppError, NotFoundError, ValidationError,ConflictError, UnauthorizedError,  ForbiddenError };
