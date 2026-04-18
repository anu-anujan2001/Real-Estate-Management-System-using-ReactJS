const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/user.model");


const protectedRoute = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      res.status(401);
      throw new Error("Not authorized, no token");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      res.status(401);
      throw new Error("Not authorized, invalid token");
    }

    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      res.status(401);
      throw new Error("Not authorized, user not found");
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(401);
    throw new Error("Not authorized, token failed");
  }
};



const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      res.status(401);
      throw new Error("Not authorized");
    }

    if (!roles.includes(req.user.role)) {
      res.status(403);
      throw new Error("Forbidden: You do not have access to this resource");
    }

    next();
  };
};

module.exports = { protectedRoute, authorize };
