
const express = require("express")
const cors = require("cors")
const errorHandler= require("./utils/errorHandling")
const app = express() ; 
app.use(express.json() )
app.use(cors())
 
const ProductRoutes = require("./routes/productRoutes")

app.use("/", ProductRoutes) ; 
app.use(errorHandler)
module.exports = app 
