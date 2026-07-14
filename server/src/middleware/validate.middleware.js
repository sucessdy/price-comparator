const { ValidationError } = require("../errors/AppError");

const validate = (schema) => {
  return (req, res, next) => {
    console.log(`🔍 Validating ${req.method} ${req.path}`);
    console.log("📦 Request body:", req.body);
    
    const { error, value } = schema.validate(req.body, {
      abortEarly: false, // Show all validation errors
      stripUnknown: true // Remove unknown fields
    });
    
    if (error) {
      const errorMessage = error.details.map(detail => detail.message).join(', ');
      console.error("❌ Validation Error:", errorMessage);
      return next(new ValidationError(errorMessage));
    }

    req.validatedData = value;
    console.log("✅ Validation passed for:", req.path);
    next();
  };
};

module.exports = validate;