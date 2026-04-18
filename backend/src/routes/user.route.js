const express = require("express");
const router = express.Router();
const { getUserProfile, updateUserProfile, getPublicUserProfile } = require("../controllers/user.controller");
const { protectedRoute } = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");

// get user profile
router.get("/profile", protectedRoute, getUserProfile);

// get public user profile by id
router.get("/profile/:id", getPublicUserProfile);

// update user profile
router.put("/profile", protectedRoute, upload.single('profilePic'), updateUserProfile);

module.exports = router;