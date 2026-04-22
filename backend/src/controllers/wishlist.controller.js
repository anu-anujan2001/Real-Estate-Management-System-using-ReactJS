const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");
const Wishlist = require("../models/wishlist.model");
const Product = require("../models/product.model");

// ADD TO WISHLIST
const addToWishlist = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { productId } = req.body;

  if (!productId) {
    return res.status(400).json({
      success: false,
      message: "Product id is required",
    });
  }

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid product id",
    });
  }

  const productExists = await Product.findById(productId);

  if (!productExists) {
    return res.status(404).json({
      success: false,
      message: "Product not found",
    });
  }

  let wishlist = await Wishlist.findOne({ user: userId });

  if (!wishlist) {
    wishlist = await Wishlist.create({
      user: userId,
      products: [{ product: productId }],
    });

    await wishlist.populate("products.product");

    return res.status(201).json({
      success: true,
      message: "Product added to wishlist",
      wishlist,
    });
  }

  const alreadyExists = wishlist.products.some(
    (item) => item.product.toString() === productId,
  );

  if (alreadyExists) {
    await wishlist.populate("products.product");

    return res.status(400).json({
      success: false,
      message: "Product already in wishlist",
      wishlist,
    });
  }

  wishlist.products.push({ product: productId });
  await wishlist.save();
  await wishlist.populate("products.product");

  res.status(200).json({
    success: true,
    message: "Product added to wishlist",
    wishlist,
  });
});

// GET WISHLIST
const getWishlist = asyncHandler(async (req, res) => {
  const wishlist = await Wishlist.findOne({ user: req.user._id }).populate(
    "products.product",
  );

  res.status(200).json({
    success: true,
    wishlist: wishlist || {
      user: req.user._id,
      products: [],
    },
  });
});

// REMOVE FROM WISHLIST
const removeFromWishlist = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { productId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid product id",
    });
  }

  const wishlist = await Wishlist.findOne({ user: userId });

  if (!wishlist) {
    return res.status(404).json({
      success: false,
      message: "Wishlist not found",
    });
  }

  const productExists = wishlist.products.some(
    (item) => item.product.toString() === productId,
  );

  if (!productExists) {
    await wishlist.populate("products.product");

    return res.status(404).json({
      success: false,
      message: "Product not found in wishlist",
      wishlist,
    });
  }

  wishlist.products = wishlist.products.filter(
    (item) => item.product.toString() !== productId,
  );

  await wishlist.save();
  await wishlist.populate("products.product");

  res.status(200).json({
    success: true,
    message: "Product removed from wishlist",
    wishlist,
  });
});

module.exports = {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
};
