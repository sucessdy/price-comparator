
const express = require("express")
const cors = require("cors")
const app = express() ; 
app.use(express.json() )
app.use(cors())
 
const ProductRoutes = require("./routes/productRoutes")

app.use("/", ProductRoutes) ; 
module.exports = app 
