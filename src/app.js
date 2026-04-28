// const express = require("express");
// const productModel = require("./model/productModel");

// const app = express();
// app.use(express.json());

// app.get("/compare", async (req, res) => {
//   try {
//     const productName = req.query.product?.toLowerCase();

//     if (!productName) {
//       return res.status(400).json({
//         error: "Product query is required",
//       });
//     }

//     const items = await Product.find({ name: productName });

//     if (items.length === 0) {
//       return res.status(404).json({
//         error: "Product not found",
//       });
//     }

//     let prices = {};
//     let cheapest = null;
//     let lowest = Infinity;

//     items.forEach((p) => {
//       prices[p.platform] = p.price;

//       if (p.price < lowest) {
//         lowest = p.price;
//         cheapest = p.platform;
//       }
//     });

//     res.json({
//       product: productName,
//       prices,
//       cheapest,
//     });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// app.post("/product", async (req, res) => {
//   try {
//     const { name, price, platform } = req.body;

//     if (!name || price == null || !platform) {
//       return res.status(400).json({
//         error: "name, price and platform are required",
//       });
//     }

//     const normalizedName = name.toLowerCase();

//     const existing = await Product.findOne({
//       name: normalizedName,
//       platform,
//     });

//     // 🔥 CASE 1: Update existing
//     if (existing) {
//       existing.priceHistory.push({
//         price: existing.price,
//       });

//       existing.price = price;

//       await existing.save();

//       return res.json({
//         message: "Price updated ✅",
//         product: existing,
//       });
//     }

//     // 🔥 CASE 2: Create new
//     const newProduct = new Product({
//       name: normalizedName,
//       price,
//       platform,
//       priceHistory: [], // initialize
//     });

//     await newProduct.save();

//     res.status(201).json({
//       message: "Product added successfully",
//       product: newProduct,
//     });

//   } catch (err) {
//     res.status(500).json({
//       error: "Failed to add product",
//       details: err.message,
//     });
//   }
// });
// module.exports = app;


const express = require("express")
const app = express() ; 
app.use(express.json() )
 
const ProductRoutes = require("./routes/productRoutes")

app.use("/", ProductRoutes) ; 
module.exports = app 
