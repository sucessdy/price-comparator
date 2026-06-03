


const express = require("express");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid"); 
const errorMiddleware = require("./middleware/error.middleware");

const app = express();
app.get("/test", (req, res) => {
  res.send("Server works");
});

app.use((req, res, next) => {
  req.id = uuidv4();
  res.setHeader('X-Request-Id', req.id);
  next();
});

app.use(express.json());
app.use(cors());

const ProductRoutes = require("./routes/productRoutes");
app.use("/api", ProductRoutes); 
app.use(errorMiddleware);

module.exports = app;
