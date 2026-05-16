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
      trim: true,
      lowercase: true,
    },
    priceHistory: [
      {
        price: {
          type: Number,
          require: true,
          min: 0,
        },
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true },
);

productSchema.index({ name: 1, platform: 1 }, { unique: 1 });
const productModel = mongoose.model("Product", productSchema);

module.exports = productModel;
