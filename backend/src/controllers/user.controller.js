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

// get all users

const getAllUsers = asyncHandler(async (req, res) => {
    try {
      const users = await User.find().select("-password");
      res.status(200).json({ users });
  }
    catch (error) {
      console.error("Error fetching users:", error.message);
      res.status(500).json({ message: "Server error fetching users" });
  }
});


// delete user (admin only) - optional, not implemented in routes yet
const deleteUser = asyncHandler(async (req, res) => {
    try {
      const userId = req.params.id;
      const userToDelete = await User.findById(userId);
      if (!userToDelete) {
        res.status(404);
        throw new Error("User not found");
      }
      await userToDelete.remove();
      res.status(200).json({ message: "User deleted successfully" });
  }
    catch (error) {
      console.error("Error deleting user:", error.message);
      res.status(500).json({ message: "Server error deleting user" });
  }
});


module.exports = {
    getUserProfile,
    updateUserProfile,
    getAllUsers,
    deleteUser,
};