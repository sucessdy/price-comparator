const mongoose = require("mongoose");
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
  
      lowercase: true,
      trim: true, 
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    platform: {
      type: String,
      required: true,
      lowercase: true,
    },
    priceHistory: [
      {
        price: Number,
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true },
);

const productModel = mongoose.model(
  "Product",
  productSchema.index({ name: 1, platform: 1 }, { unique: true }),
);

module.exports = productModel;
