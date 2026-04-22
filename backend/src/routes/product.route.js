const express = require("express");
const router = express.Router();

const { protectedRoute, authorize } = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");

const {
  createProduct,
  getAllProducts,
  getCategorySummary,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  toggleFeaturedProduct,
  toggleActiveStatus,
  getBrandSummary,
} = require("../controllers/product.controller");

// 🔓 PUBLIC ROUTES
router.get("/", getAllProducts);
router.get("/categories", getCategorySummary);
router.get("/brands/summary", getBrandSummary);
router.get("/:id", getSingleProduct);

// 🔒 ADMIN ONLY ROUTES
router.post(
  "/",
  protectedRoute,
  authorize("admin"),
  upload.array("images", 10),
  createProduct,
);

router.put(
  "/:id",
  protectedRoute,
  authorize("admin"),
  upload.array("images", 10),
  updateProduct,
);

router.delete("/:id", protectedRoute, authorize("admin"), deleteProduct);

router.patch(
  "/:id/featured",
  protectedRoute,
  authorize("admin"),
  toggleFeaturedProduct,
);

router.patch(
  "/:id/active",
  protectedRoute,
  authorize("admin"),
  toggleActiveStatus,
);

module.exports = router;
