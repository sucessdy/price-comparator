// scripts/seedDB.js
require("dotenv").config()
const mongoose = require("mongoose");
// const connectDB = require("../src/config/db");   // 👈 reuse
const Product = require("../src/model/productModel");
const data = require("../dummyData.json");

async function seed() {
  try {
    // await connectDB();   
    await mongoose.connect(process.env.MONGO_URI);
    await Product.deleteMany({});
    await Product.insertMany(data);

    console.log("🔥 Data inserted");

    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();