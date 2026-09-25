const Joi = require("joi");

// Schema for cart optimization
const offerSchema = Joi.object({
  id: Joi.string().allow(null).optional(),
  name: Joi.string().trim().min(1).required(),
  platform: Joi.string().trim().min(1).required(),
  price: Joi.number().min(0).required(),
  delivery: Joi.string().allow(null).optional(),
  rating: Joi.number().allow(null).optional(),
  reviews: Joi.number().allow(null).optional(),
  productLink: Joi.string().allow(null).optional(),
  image: Joi.string().allow(null).optional(),
  source: Joi.string()
    .valid("serpapi", "mongodb")
    .required(),
  reason: Joi.string().allow("").optional(),
  brand: Joi.string().allow("").optional(),
});

const optimiseCartSchema = Joi.object({
  products: Joi.array()
    .items(
      Joi.alternatives().try(
        Joi.string().trim().min(1).required(),

        Joi.object({
          name: Joi.string().trim().min(1).required(),

          quantity: Joi.number()
            .integer()
            .min(1)
            .default(1),

          offer: offerSchema.optional(),
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