const express = require("express");
const router = express.Router();

const {
  createCashOrderFromCart,
  createPaidOrderAfterStripeSuccess,
  getMyOrders,
  getOrderById,
} = require("../controllers/order.controller");

const { protectedRoute } = require("../middleware/auth.middleware");

router.post("/cash", protectedRoute, createCashOrderFromCart);
router.post(
  "/stripe-success",
  protectedRoute,
  createPaidOrderAfterStripeSuccess,
);
router.get("/my-orders", protectedRoute, getMyOrders);
router.get("/:id", protectedRoute, getOrderById);

module.exports = router;
