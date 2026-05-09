
require("dotenv").config()
const mongoose = require("mongoose");

const Product = require("../src/model/productModel");
const data = require("../dummyData.json");

async function seed() {
  try {
    
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