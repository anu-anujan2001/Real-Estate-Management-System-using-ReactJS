const express = require("express");
const router = express.Router();
const { getUserProfile, updateUserProfile ,getAllUsers} = require("../controllers/user.controller");
const { protectedRoute, authorize } = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");

// get user profile
router.get("/profile", protectedRoute, getUserProfile);

// get all users
router.get("/", protectedRoute, authorize("admin"), getAllUsers);

// update user profile
router.put("/profile", protectedRoute, upload.single('profilePic'), updateUserProfile);

module.exports = router;