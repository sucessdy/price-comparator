


const express = require("express");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid"); 
const errorMiddleware = require("./middleware/error.middleware");
const ProductRoutes = require("./routes/productRoutes");
const userRoutes = require("./routes/userRoutes")
const app = express();

app.use(express.json());
app.use(cors());


app.use("/api", ProductRoutes); 
app.use("/auth",  userRoutes)
// app.use("/auth/api", userRouters)
app.use(errorMiddleware);

module.exports = app;
