
const express = require("express")
const app = express() ; 
app.use(express.json() )
 
const ProductRoutes = require("./routes/productRoutes")

app.use("/", ProductRoutes) ; 
module.exports = app 
