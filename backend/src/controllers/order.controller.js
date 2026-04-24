const asyncHandler = require("express-async-handler");
const Order = require("../models/order.model");
const Product = require("../models/product.model");
const Cart = require("../models/cart.model");

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

const reduceStock = async (orderItems) => {
  for (const item of orderItems) {
    const product = await Product.findById(item.product);
    if (!product) continue;

    if (item.variant?.size || item.variant?.color) {
      const matchedVariant = findMatchingVariant(product, item.variant);

      if (!matchedVariant) {
        throw new Error(`Variant not found for ${product.name}`);
      }

      if (matchedVariant.stock < item.quantity) {
        throw new Error(`${product.name} variant is out of stock`);
      }

      matchedVariant.stock -= item.quantity;
      product.stock = product.variants.reduce(
        (sum, variant) => sum + Number(variant.stock || 0),
        0,
      );
    } else {
      if (product.stock < item.quantity) {
        throw new Error(`${product.name} is out of stock`);
      }

      product.stock -= item.quantity;
    }

    await product.save();
  }
};

// CREATE CASH ORDER FROM CART
const createCashOrderFromCart = asyncHandler(async (req, res) => {
  const { shippingAddress } = req.body;

  if (
    !shippingAddress?.fullName ||
    !shippingAddress?.phone ||
    !shippingAddress?.address ||
    !shippingAddress?.city
  ) {
    return res.status(400).json({ message: "Shipping address is incomplete" });
  }

  const cart = await Cart.findOne({ user: req.user._id }).populate(
    "items.product",
  );

  if (!cart || !cart.items.length) {
    return res.status(400).json({ message: "Cart is empty" });
  }

  const orderItems = cart.items.map((item) => ({
    product: item.product._id,
    name: item.name || item.product.name,
    image: item.image || item.product.images?.[0] || "",
    price: Number(item.price || item.product.price || 0),
    quantity: Number(item.quantity || 1),
    variant: item.variant
      ? {
          size: item.variant.size || "",
          color: item.variant.color || "",
        }
      : undefined,
  }));

  await reduceStock(orderItems);

  const itemsPrice = orderItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const shippingPrice = itemsPrice > 0 ? 500 : 0;
  const taxPrice = 0;
  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  const order = await Order.create({
    user: req.user._id,
    orderItems,
    shippingAddress,
    paymentMethod: "COD",
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
    orderStatus: "Pending",
  });

  cart.items = [];
  await cart.save();

  res.status(201).json({
    success: true,
    message: "Order placed successfully",
    order,
  });
});

// CREATE PAID ORDER AFTER STRIPE SUCCESS
const createPaidOrderAfterStripeSuccess = asyncHandler(async (req, res) => {
  const { shippingAddress, stripeSessionId } = req.body;

  if (!stripeSessionId) {
    return res.status(400).json({ message: "Stripe session id is required" });
  }

  if (
    !shippingAddress?.fullName ||
    !shippingAddress?.phone ||
    !shippingAddress?.address ||
    !shippingAddress?.city
  ) {
    return res.status(400).json({ message: "Shipping address is incomplete" });
  }

  const existingOrder = await Order.findOne({ stripeSessionId });

  if (existingOrder) {
    return res.status(200).json({
      success: true,
      message: "Order already created",
      order: existingOrder,
    });
  }

  const cart = await Cart.findOne({ user: req.user._id }).populate(
    "items.product",
  );

  if (!cart || !cart.items.length) {
    return res.status(400).json({ message: "Cart is empty" });
  }

  const orderItems = cart.items.map((item) => ({
    product: item.product._id,
    name: item.name || item.product.name,
    image: item.image || item.product.images?.[0] || "",
    price: Number(item.price || item.product.price || 0),
    quantity: Number(item.quantity || 1),
    variant: item.variant
      ? {
          size: item.variant.size || "",
          color: item.variant.color || "",
        }
      : undefined,
  }));

  const itemsPrice = orderItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const shippingPrice = itemsPrice > 0 ? 500 : 0;
  const taxPrice = 0;
  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  await reduceStock(orderItems);

  const order = await Order.create({
    user: req.user._id,
    orderItems,
    shippingAddress,
    paymentMethod: "CARD",
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
    isPaid: true,
    paidAt: new Date(),
    orderStatus: "Paid",
    stripeSessionId,
    paymentResult: {
      id: stripeSessionId,
      status: "paid",
    },
  });

  cart.items = [];
  await cart.save();

  res.status(201).json({
    success: true,
    message: "Order created successfully",
    order,
  });
});

const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({
    createdAt: -1,
  });

  res.status(200).json({
    success: true,
    orders,
  });
});

const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email",
  );

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  if (
    order.user._id.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    return res.status(403).json({ message: "Forbidden" });
  }

  res.status(200).json({
    success: true,
    order,
  });
});

module.exports = {
  createCashOrderFromCart,
  createPaidOrderAfterStripeSuccess,
  getMyOrders,
  getOrderById,
};
