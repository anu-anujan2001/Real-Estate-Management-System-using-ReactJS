const User = require("../models/user.model");
const asyncHandler = require("express-async-handler");
const uploadToCloudinary = require("../lib/uploadToCloudinary");


// user profile
const getUserProfile = asyncHandler(async (req, res) => {
  try {
    if (!req.user) {
        res.status(401)
        throw new Error("Not authorized");
    }
    res.status(200).json({
      user: req.user,
    });
  } catch (error) {
    console.error("Error fetching user profile:", error.message);
    res.status(500).json({ message: "Server error fetching user profile" });
    }
    
});

// to get public user profile by id
const getPublicUserProfile = asyncHandler(async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId).select('-password -verificationToken -resetPasswordToken');

    if (!user) {
      res.status(404);
      throw new Error("User not found");
        }
    res.status(200).json({
      user,
    });
  } catch (error) {
    console.error("Error fetching public user profile:", error.message);
    res.status(500).json({ message: "Server error fetching public user profile" });
    }
    
});

// to update user profile
const updateUserProfile = asyncHandler(async (req, res) => {
    try {
        const user = req.user;
        const { name, phone, address, removeProfilePic } = req.body;
        
        if(!user) {
            res.status(401);
            throw new Error("Not authorized");
        }

        // image handling
        if (req.file) {
            const result = await uploadToCloudinary(req.file.buffer, 'profile_pics');
            user.profilePic = result.secure_url;
        } else if (removeProfilePic === 'true') {
            user.profilePic = undefined;
        }

        if (name) user.name = name;
        if (phone) user.phone = phone;
        if (address) user.address = address;

        const updatedUser = await user.save();

        res.status(200).json({
            user: updatedUser,
        });

    } catch (error) {
        console.error("Error updating user profile:", error.message);
        res.status(500).json({ message: "Server error updating user profile" });
    }
    
});


module.exports = {
    getUserProfile,
    updateUserProfile,
    getPublicUserProfile
    
};