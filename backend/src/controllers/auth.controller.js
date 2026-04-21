const User = require('../models/user.model');
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const express = require('express');
const asyncHandler = require('express-async-handler');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');
const { generateToken } = require('../lib/utils');


// Register a new user
const registerUser = asyncHandler(async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser && existingUser.isVerified) {
      return res
        .status(400)
        .json({ message: "User with this email already exists" });
    }

    if (existingUser && !existingUser.isVerified) {
      await User.deleteOne({ _id: existingUser._id });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const verificationToken = Math.floor(
      100000 + Math.random() * 900000,
    ).toString();
    const verificationExpiresAt = new Date(Date.now() + 60 * 1000);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      verificationToken,
      verificationExpiresAt,
    });

    const message = `
      <h1>Email Verification</h1>
      <p>Your verification code is: <strong>${verificationToken}</strong></p>
      <p>This code expires in 60 seconds.</p>
    `;

    await sendEmail({
      email: user.email,
      subject: "Email Verification",
      message,
    });

    await user.save();
    const token = generateToken(res, user._id);

    res.status(201).json({
      message:
        "User registered successfully. Please verify your email within 60 seconds.",
      user,
      token,
      expiresAt: verificationExpiresAt,
    });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ message: "Server error during registration" });
  }
});

// Login user
const loginUser = asyncHandler(async (req, res) => {
    
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide email and password' });
        }

        // email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long' });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        if(!user.isVerified) {
            return res.status(400).json({ message: 'Please register and verify your email before logging in' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }


        // Generate JWT token
        const token = generateToken(res, user._id);

        res.status(200).json({
            message: 'Login successful',
            token,
            user
        });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Server error during login' });
    }
});


// to get user profile
const getUserProfile = asyncHandler(async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    res.status(200).json({
      user: req.user,
    });
  } catch (error) {
    console.error("Error fetching user profile:", error.message);
    res.status(500).json({ message: "Server error fetching user profile" });
  }
});

// verify email
const verifyEmail = asyncHandler(async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res
        .status(400)
        .json({ message: "Please provide email and verification code" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid email" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "Email already verified" });
    }

    if (
      !user.verificationExpiresAt ||
      user.verificationExpiresAt < new Date()
    ) {
      await User.deleteOne({ _id: user._id });
      return res.status(400).json({
        message: "Verification code expired. Please register again.",
      });
    }

    if (user.verificationToken !== code) {
      return res.status(400).json({ message: "Invalid verification code" });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationExpiresAt = undefined;
    await user.save();

    res.status(200).json({
      message: "Email verified successfully",
    });
  } catch (error) {
    console.error("Error during email verification:", error);
    res.status(500).json({ message: "Server error during email verification" });
  }
});


const resendVerificationCode = asyncHandler(async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found. Please register again." });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "Email is already verified" });
    }

    const verificationToken = Math.floor(
      100000 + Math.random() * 900000,
    ).toString();
    const verificationExpiresAt = new Date(Date.now() + 60 * 1000);

    user.verificationToken = verificationToken;
    user.verificationExpiresAt = verificationExpiresAt;
    await user.save();

    const message = `
      <h1>Email Verification</h1>
      <p>Your new verification code is: <strong>${verificationToken}</strong></p>
      <p>This code expires in 60 seconds.</p>
    `;

    await sendEmail({
      email: user.email,
      subject: "Resend Email Verification Code",
      message,
    });

    res.status(200).json({
      message: "Verification code resent successfully",
      expiresAt: verificationExpiresAt,
    });
  } catch (error) {
    console.error("Error resending verification code:", error);
    res.status(500).json({ message: "Server error while resending code" });
  }
});


//forget password, reset password, change password can be implemented similarly with appropriate routes and logic.
const forgotPassword = asyncHandler(async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: 'User with this email does not exist' });
        }

        const resetToken = crypto.randomBytes(20).toString("hex");
        const resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 mins

        user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
        user.resetPasswordExpire = resetPasswordExpire;
        await user.save();

        const clientUrl = "http://localhost:5173";
        const resetUrl = `${clientUrl}/reset-password/${resetToken}`;
        const message = `
            <h2>Password Reset Request</h2>
            <p>You requested a password reset. Please click on the link below to reset your password:</p>
            <a href="${resetUrl}" clicktracking="off">${resetUrl}</a>
            <p>This link will expire in 15 minutes.</p>
        `;

         try {
            await sendEmail({
                email: user.email,
                subject: "Password Reset - Real Estate Platform",
                message,
            });
             
            res.status(200).json({ message: "Password reset email sent"});
        } catch (error) {
             user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save();
            return res.status(500).json({ message: 'Failed to send password reset email' });
        }
    } catch (error) {
        console.error('Error during forgot password:', error);
        res.status(500).json({ message: 'Server error during forgot password' });
    }
});

const resetPassword = asyncHandler(async (req, res) => {
    // Implementation for reset password
    try {
        const { token } = req.params;
        const { newPassword } = req.body;

        const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpire: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired password reset token' });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        res.status(200).json({ message: 'Password reset successful' });
    } catch (error) {
        console.error('Error during reset password:', error);
        res.status(500).json({ message: 'Server error during reset password' });
    }

});

const logout = asyncHandler(async (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'strict',
    });
    res.json({ message: 'Logged out successfully' });
});

const checkAuth = asyncHandler(async (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        res.status(500).json({ message: 'Server error while checking authentication' });
    }
});


module.exports = {
    registerUser,
    loginUser,
    getUserProfile,
    verifyEmail,
    resendVerificationCode,
    checkAuth,
    forgotPassword,
    resetPassword,
    logout,
};