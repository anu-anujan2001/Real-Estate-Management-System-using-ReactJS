const express = require("express");
const router = express.Router();

const {
  getCart,
  addToCart,
  updateCartItemQuantity,
  removeFromCart,
  clearCart,
} = require("../controllers/cart.controller");

const { protectedRoute } = require("../middleware/auth.middleware");

router.get("/", protectedRoute, getCart);
router.post("/", protectedRoute, addToCart);
router.put("/:itemId", protectedRoute, updateCartItemQuantity);
router.delete("/:itemId", protectedRoute, removeFromCart);
router.delete("/", protectedRoute, clearCart);

module.exports = router;
