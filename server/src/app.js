


const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");


const errorMiddleware = require("./middleware/error.middleware");
const ProductRoutes = require("./routes/productRoutes");
const userRoutes = require("./routes/userRoutes")
const assistantRoutes = require("./routes/assistantRoutes") 
const app = express();

app.use(express.json());
app.use(cookieParser())
app.use(cors());


app.use("/api", ProductRoutes); 
app.use("/auth",  userRoutes)
app.use("/api/assistant", assistantRoutes)
app.use(errorMiddleware);

module.exports = app;
