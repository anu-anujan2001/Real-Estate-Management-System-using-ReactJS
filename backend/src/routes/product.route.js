const express = require("express");
const router = express.Router();
const { protectedRoute } = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");
const {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  toggleFeaturedProduct,
  toggleActiveStatus,
} = require("../controllers/product.controller");




// create a new product
router.post("/", protectedRoute, upload.array('images', 10), createProduct);

// get all products with filters, pagination, and sorting
router.get("/", getAllProducts);

// get single product by id
router.get("/:id", getSingleProduct);

// update product by id
router.put("/:id", protectedRoute, upload.array('images', 10), updateProduct);

// delete product by id
router.delete("/:id", protectedRoute, deleteProduct);


// toggle featured status
router.patch("/:id/featured", protectedRoute, toggleFeaturedProduct);

// toggle active status
router.patch("/:id/active", protectedRoute, toggleActiveStatus);













module.exports = router;