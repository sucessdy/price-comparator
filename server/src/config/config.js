const dotenv = require("dotenv")

dotenv.config() 

if (!process.env.MONGO_URI){
    throw new Error("Mongo_uri is not valid") 
}
if (!process.env.JWT_SECRET){ 
    throw new Error("Jwt is not valid")
}
const config = { 
    MONGO_URI :process.env.MONGO_URI, 
    JWT_SECRET :process.env.JWT_SECRET, 
     JWT_ACCESS_EXPIRE: "15m",
  JWT_REFRESH_EXPIRE: "7d", 
   PORT: process.env.PORT || 3000,
  BCRYPT_SALT_ROUNDS: 10,
}
module.exports = config