const Joi = require("joi");

// Schema for cart optimization
const optimiseCartSchema = Joi.object({
  products: Joi.array()
    .items(
      Joi.alternatives().try(
        Joi.string().trim().min(1).required(),
        Joi.object({
          name: Joi.string().trim().min(1).required(),
          quantity: Joi.number().integer().min(1).default(1),
        })
      )
    )
    .min(1)
    .required()
    .messages({
      "array.min": "At least one product is required",
      "array.base": "Products must be an array",
      "any.required": "Products array is required",
    }),
});

module.exports = {
  optimiseCartSchema,
};