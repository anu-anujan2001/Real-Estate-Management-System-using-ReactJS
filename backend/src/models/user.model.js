const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    role: {
        type: String,
        enum: ['buyer', 'seller', 'admin'],
        default: 'buyer',
    },
    phone: {
        type: String,
    },
    isBlocked: {
        type: Boolean,
        default: false,
    },
    profilePic: {
        type: String,
    },
    address: {
        type: String,
    },
    isApproved: {
        type: Boolean,
        default: true,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    verificationToken: {
        type: String,
    },
    resetPasswordToken: {
        type: String,
    },
    resetPasswordExpires: {
        type: Date,
    },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
