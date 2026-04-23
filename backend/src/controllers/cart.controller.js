const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const Cart = require("../models/cart.model");
const Product = require("../models/product.model");

const findMatchingVariant = (product, variant) => {
  if (!variant) return null;

  return product.variants.find(
    (v) =>
      String(v.size || "")
        .trim()
        .toLowerCase() ===
        String(variant.size || "")
          .trim()
          .toLowerCase() &&
      String(v.color || "")
        .trim()
        .toLowerCase() ===
        String(variant.color || "")
          .trim()
          .toLowerCase(),
  );
};

const normalizeVariant = (variant) => ({
  size: variant?.size?.trim() || "",
  color: variant?.color?.trim() || "",
});

const isSameVariant = (a, b) => {
  const v1 = normalizeVariant(a);
  const v2 = normalizeVariant(b);

  return v1.size === v2.size && v1.color === v2.color;
};

// GET CART
const getCart = asyncHandler(async (req, res) => {
  let cart = await Cart.findOne({ user: req.user._id }).populate(
    "items.product",
  );

  if (!cart) {
    cart = await Cart.create({
      user: req.user._id,
      items: [],
    });

    cart = await Cart.findById(cart._id).populate("items.product");
  }

  res.status(200).json({
    success: true,
    cart,
  });
});

// ADD TO CART
const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity = 1, variant } = req.body;

  if (!productId) {
    return res.status(400).json({ message: "Product id is required" });
  }

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).json({ message: "Invalid product id" });
  }

  const qty = Number(quantity);

  if (!qty || qty < 1) {
    return res.status(400).json({ message: "Quantity must be at least 1" });
  }

  const product = await Product.findById(productId);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  if (!product.isActive) {
    return res.status(400).json({ message: "Product is inactive" });
  }

  const hasVariants =
    Array.isArray(product.variants) && product.variants.length > 0;

  let finalVariant = null;
  let availableStock = Number(product.stock || 0);
  let finalPrice = Number(product.price || 0);

  if (hasVariants) {
    if (!variant || (!variant.size && !variant.color)) {
      return res.status(400).json({ message: "Please select a variant" });
    }

    const matchedVariant = findMatchingVariant(product, variant);

    if (!matchedVariant) {
      return res.status(400).json({ message: "Selected variant not found" });
    }

    finalVariant = normalizeVariant(matchedVariant);
    availableStock = Number(matchedVariant.stock || 0);
    finalPrice =
      matchedVariant.price !== undefined && matchedVariant.price !== null
        ? Number(matchedVariant.price)
        : Number(product.price || 0);
  }

  if (availableStock < qty) {
    return res
      .status(400)
      .json({ message: "Requested quantity exceeds stock" });
  }

  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    cart = await Cart.create({
      user: req.user._id,
      items: [],
    });
  }

  const existingItem = cart.items.find((item) => {
    const sameProduct = item.product.toString() === productId;
    const sameVariant = hasVariants
      ? isSameVariant(item.variant, finalVariant)
      : true;

    return sameProduct && sameVariant;
  });

  if (existingItem) {
    const newQty = existingItem.quantity + qty;

    if (newQty > availableStock) {
      return res.status(400).json({
        message: "Total cart quantity exceeds available stock",
      });
    }

    existingItem.quantity = newQty;
    existingItem.price = finalPrice;
    existingItem.name = product.name;
    existingItem.image = product.images?.[0] || "";
    existingItem.variant = finalVariant || { size: "", color: "" };
  } else {
    cart.items.push({
      product: product._id,
      name: product.name,
      image: product.images?.[0] || "",
      price: finalPrice,
      quantity: qty,
      variant: finalVariant || { size: "", color: "" },
    });
  }

  await cart.save();

  cart = await Cart.findById(cart._id).populate("items.product");

  res.status(200).json({
    success: true,
    message: "Product added to cart",
    cart,
  });
});

// UPDATE CART ITEM QUANTITY
const updateCartItemQuantity = asyncHandler(async (req, res) => {
  const { itemId } = req.params;
  const { quantity } = req.body;

  const qty = Number(quantity);

  if (!qty || qty < 1) {
    return res.status(400).json({ message: "Quantity must be at least 1" });
  }

  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    return res.status(404).json({ message: "Cart not found" });
  }

  const item = cart.items.id(itemId);

  if (!item) {
    return res.status(404).json({ message: "Cart item not found" });
  }

  const product = await Product.findById(item.product);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  const hasVariants =
    Array.isArray(product.variants) && product.variants.length > 0;

  let availableStock = Number(product.stock || 0);

  if (hasVariants) {
    const matchedVariant = findMatchingVariant(product, item.variant);

    if (!matchedVariant) {
      return res.status(400).json({ message: "Variant not found" });
    }

    availableStock = Number(matchedVariant.stock || 0);
    item.price =
      matchedVariant.price !== undefined && matchedVariant.price !== null
        ? Number(matchedVariant.price)
        : Number(product.price || 0);
  } else {
    item.price = Number(product.price || 0);
  }

  if (qty > availableStock) {
    return res
      .status(400)
      .json({ message: "Requested quantity exceeds stock" });
  }

  item.quantity = qty;
  item.name = product.name;
  item.image = product.images?.[0] || "";

  await cart.save();

  cart = await Cart.findById(cart._id).populate("items.product");

  res.status(200).json({
    success: true,
    message: "Cart item updated successfully",
    cart,
  });
});

// REMOVE SINGLE CART ITEM
const removeFromCart = asyncHandler(async (req, res) => {
  const { itemId } = req.params;

  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    return res.status(404).json({ message: "Cart not found" });
  }

  const item = cart.items.id(itemId);

  if (!item) {
    return res.status(404).json({ message: "Cart item not found" });
  }

  item.deleteOne();
  await cart.save();

  cart = await Cart.findById(cart._id).populate("items.product");

  res.status(200).json({
    success: true,
    message: "Item removed from cart",
    cart,
  });
});

// CLEAR CART
const clearCart = asyncHandler(async (req, res) => {
  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    cart = await Cart.create({
      user: req.user._id,
      items: [],
    });
  } else {
    cart.items = [];
    await cart.save();
  }

  cart = await Cart.findById(cart._id).populate("items.product");

  res.status(200).json({
    success: true,
    message: "Cart cleared successfully",
    cart,
  });
});

module.exports = {
  getCart,
  addToCart,
  updateCartItemQuantity,
  removeFromCart,
  clearCart,
};
