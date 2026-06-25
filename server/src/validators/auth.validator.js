const Joi = require("joi")
const registerUser = Joi.object({ 
    name: Joi.string().min(2).max(100).required().trim(), 
    email : Joi.string().email().trim().required(), 
    password : Joi.string().min(8).required() 

})

const loginUser = Joi.object({ 
   email: Joi.string().email().trim().required(),

  password: Joi.string().min(8).required(),
})
module.exports = { registerUser , loginUser}  ; 
