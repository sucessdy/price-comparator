const Joi = require("joi")

const optimiseCartSchema = Joi.object( { 
    products : Joi.array().items(Joi.string()).min(1).required(),
})
module.exports = {optimiseCartSchema} ; 
