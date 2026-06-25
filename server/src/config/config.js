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
    JWT_SECRET :process.env.JWT_SECRET
}
module.exports = config