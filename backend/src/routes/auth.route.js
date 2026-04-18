const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserProfile, verifyEmail, forgotPassword, resetPassword } = require('../controllers/auth.controller');
const { protectedRoute, authorize } = require('../middleware/auth.middleware');

// Register a new user
router.post('/register', registerUser);

// Login user
router.post('/login', loginUser);

// Get user profile
router.get('/me', protectedRoute, getUserProfile);

// Verify email
router.post('/verify-email', verifyEmail);

// Forgot password
router.post('/forgot-password', forgotPassword);

// Reset password
router.post('/reset-password/:token', resetPassword);

module.exports = router;