const  {ValidationError}  = require("../errors/AppError.js")

 const validate = (schema) => {

  return (req, res, next) => {

    const { error, value } =
      schema.validate(req.body);

    if (error) {
      return next(
       new  ValidationError(error.message)
      );
    }

    req.validatedData = value;

    next();
  };
};

module.exports = validate;
