const express = require("express");
const router = express.Router();

const {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
} = require("../controllers/wishlist.controller");

const { protectedRoute } = require("../middleware/auth.middleware");

router.post("/", protectedRoute, addToWishlist);
router.get("/", protectedRoute, getWishlist);
router.delete("/:productId", protectedRoute, removeFromWishlist);

module.exports = router;
