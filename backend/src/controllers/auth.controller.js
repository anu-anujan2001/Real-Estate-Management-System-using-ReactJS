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
        const { name, email, password, role } = req.body;

        if (!name || !email || !password || !role) {
            res.status(400);
            throw new Error('Please provide all required fields');
        }

        if (password.length < 6) {
            res.status(400);
            throw new Error('Password must be at least 6 characters long');
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            res.status(400);
            throw new Error('Invalid email format');
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            res.status(400);
            throw new Error('User already exists');
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // verification token
        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString(); // Generate a random 6-digit token

        // Create new user
        const user = new User({
            name,
            email,
            password: hashedPassword,
            role,
            verificationToken,
        });
     
        // Send verification email
        const message = `
            <h1>Email Verification</h1>
            <p>Your verification code is: <strong>${verificationToken}</strong></p>
        `;

        try {
            await sendEmail({
                email: user.email,
                subject: 'Email Verification',
                message,
            });
        } catch (error) {
            console.error('Error sending verification email:', error);
            res.status(500);
            throw new Error('Failed to send verification email');
        }

        await user.save();

        res.status(201).json({
            message: 'User registered successfully. Please check your email for the verification code.',
            user: {
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });

    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ message: 'Server error during registration' });
    }
});


// Login user
const loginUser = asyncHandler(async (req, res) => {
    
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400);
            throw new Error('Please provide email and password');
        }

        // email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            res.status(400);
            throw new Error('Invalid email format');
        }

        const user = await User.findOne({ email });

        if (!user) {
            res.status(400);
            throw new Error('Invalid credentials');
        }

        if(!user.isVerified) {
            return res.status(400).json({ message: 'Please verify your email before logging in' });
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
            res.status(400);
            throw new Error('Please provide email and verification code');
        }

        const user = await User.findOne({ email });

        if (!user) {
            res.status(400);
            throw new Error('Invalid email');
        }

        if (user.isVerified) {
            res.status(400);
            throw new Error('Email already verified');
        }

        if (user.verificationToken !== code) {
            res.status(400);
            throw new Error('Invalid verification code');
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        await user.save();

        res.status(200).json({
            message: 'Email verified successfully',
        });
    } catch (error) {
        console.error('Error during email verification:', error);
        res.status(500).json({ message: 'Server error during email verification' });
    }
});


//forget password, reset password, change password can be implemented similarly with appropriate routes and logic.
const forgotPassword = asyncHandler(async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            res.status(400);
            throw new Error('User with this email does not exist');
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
            res.status(500);
            throw new Error('Failed to send password reset email');
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
            res.status(400);
            throw new Error('Invalid or expired password reset token');
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


module.exports = {
    registerUser,
    loginUser,
    getUserProfile,
    verifyEmail,
    forgotPassword,
    resetPassword,
};