const Joi = require("joi");

const optimiseCartSchema = Joi.object({
  products: Joi.array()
    .items(
      Joi.object({
        name: Joi.string().trim().required(),
        quantity: Joi.number()
          .integer()
          .min(1)
          .required(),
      })
    )
    .required(),
});

module.exports = {
  optimiseCartSchema,
};