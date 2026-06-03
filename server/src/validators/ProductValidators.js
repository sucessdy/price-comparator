const Joi = require("joi")
const productSchema = Joi.object({
  name: Joi.string()
    .required()
    .min(2)
    .max(100)
    .trim()
    .messages({
      'string.empty': 'Product name is required',
      'string.min': 'Product name must be at least 2 characters'
    }),

  price: Joi.number()
    .required()
    .min(0)
    .positive()
    .messages({
      'number.min': 'Price cannot be negative',
      'number.positive': 'Price must be greater than 0'
    }),

  platform: Joi.string()
    .trim()
    .required()
    .min(2)
    .max(50)
});
module.exports = {
  productSchema
}; 