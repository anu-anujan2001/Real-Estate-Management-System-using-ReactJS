const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
  verifyEmail,
  resendVerificationCode,
  forgotPassword,
  resetPassword,
  checkAuth,
  logout,
} = require("../controllers/auth.controller");
const { protectedRoute, authorize } = require('../middleware/auth.middleware');

// Register a new user
router.post('/register', registerUser);

// Login user
router.post('/login', loginUser);

// Get user profile
router.get('/me', protectedRoute, getUserProfile);

// Verify email
router.post('/verify-email', verifyEmail);

// Resend verification code
router.post('/resend-verification-code', resendVerificationCode);

// Forgot password
router.post('/forgot-password', forgotPassword);

// Reset password
router.post('/reset-password/:token', resetPassword);

// Check authentication
router.get('/check-auth', protectedRoute, checkAuth);

// Logout
router.post('/logout', protectedRoute, logout);

module.exports = router;