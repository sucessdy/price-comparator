require("dotenv").config();

const mongoose = require("mongoose");
const Product = require("./src/models/productModel");
const { getMongoOffers } = require("./src/services/offer/offerService") ; 

async function test() {
  try {
    const mongoUrl = process.env.MONGO_URI || process.env.MONGODB_URI;

    await mongoose.connect(mongoUrl);

    console.log("✅ MongoDB connected");
const offers = await getMongoOffers(["milk"]); 

//    const products = await Product.find()
//   .limit(10)
//   .select("name category price platform")
//   .lean();

    // console.log("MongoDB Products:");
    // console.dir(products, { depth: null });

    console.log("Mongo Offers:");
    console.dir(offers, { depth: null }); 

  } catch (error) {
    console.error("❌ Test failed:", error);
  } finally {
    await mongoose.disconnect();
  }
}

test();