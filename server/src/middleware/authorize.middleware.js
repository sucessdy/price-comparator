const { ForbiddenError, UnauthorizedError } = require("../errors/AppError");

function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user ) {
     throw new UnauthorizedError("Authentication required") ; 
    }
    if (!roles.includes(req.user.role)){
       throw new ForbiddenError("Access forbidden: insufficient privileges") ;  
    }
   next() ; 
  };
}

module.exports = authorize; 
