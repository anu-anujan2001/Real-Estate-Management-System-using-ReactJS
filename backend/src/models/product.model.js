const mongoose = require("mongoose");

const variantSchema = new mongoose.Schema(
  {
    size: {
      type: String,
      trim: true,
    },
    color: {
      type: String,
      trim: true,
    },
    stock: {
      type: Number,
      default: 0,
      min: 0,
    },
    price: {
      type: Number,
      min: 0,
    },
  },
  { _id: false },
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },

    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },

    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },

    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
    },

    brand: {
      type: String,
      trim: true,
      default: "",
    },

    images: [
      {
        type: String,
        required: true,
      },
    ],

    stock: {
      type: Number,
      required: [true, "Stock is required"],
      default: 0,
      min: [0, "Stock cannot be negative"],
    },

    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    numReviews: {
      type: Number,
      default: 0,
      min: 0,
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    sku: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
    },

    variants: [variantSchema],
  },
  { timestamps: true },
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
