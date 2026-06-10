const  {ValidationError}  = require("../errors/AppError.js")

 const validate = (schema) => {

  return (req, res, next) => {

    const { error, value } =
      schema.validate(req.body);
console.log(error?.message);
    if (error) {
      return next(
       new  ValidationError(error.message)
      );
    }

    req.validatedData = value;
console.log("BODY:", req.body);
console.log("VALIDATED:", value);
    next();
  };
};

module.exports = validate;
