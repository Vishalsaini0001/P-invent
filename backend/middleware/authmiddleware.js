const UserModel = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const protect = asyncHandler(async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      res.status(401);
      throw new Error("User Unauthorized! Please login");
    }

    //verify token
    const verifed = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const user = await UserModel.findById(verifed.id).select("-password");

    if (!user) {
      res.status(401);
      throw new Error("User not found!");
    }
    req.user = user;

    next();
  } catch (error) {
    res.status(401);
    throw new Error("User Unauthorized! Please login");
  }
});

module.exports = protect;
