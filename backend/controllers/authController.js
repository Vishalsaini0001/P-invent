const UserModel = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

  //   Generating JWT token
  const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET_KEY, { expiresIn: "1d" });
  };

const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Validate fields presence
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please Enter All Fields");
  }

  // Validate password length
  if (password.length < 6) {
    res.status(400);
    throw new Error("Password must be at least 6 characters");
  }

  // Check if user already exists
  const userExists = await UserModel.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already registered! Try a different email.");
  }

  // Create the user
  const user = await UserModel.create({
    name,
    email,
    password,
  });

  //   Gererate token
  const token = generateToken(user._id);

  //send cookie
  res.cookie("token", token, {
    path: "/",
    httpOnly: true,
    secure: true,
    sameSite: "none",
    expires: new Date(Date.now() + 1000 * 86400), //1 day
  });

  if (user) {
    const { _id, name, email, password, phone, bio, photo } = user;
    res.status(201).json({
      _id,
      name,
      email,
      password,
      phone,
      bio,
      photo,
      token,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user input");
  }
});

//login
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  //validation
  if (!email || !password) {
    res.status(400);
    throw new Error("please enter email or password");
  }

  //find user in database
  const existUser = await UserModel.findOne({ email });

  if (!existUser) {
    res.status(400);
    throw new Error("User not exists! Register First..");
  }

  //check password
  const correctPassword = await bcrypt.compare(password, existUser.password);

  const token = generateToken(existUser._id);

  //send cookie
  res.cookie("token", token, {
    path: "/",
    httpOnly: true,
    secure: true,
    sameSite: "none",
    expires: new Date(Date.now() + 1000 * 86400), //1 day
  });

  if (existUser && correctPassword) {
    const { _id, name, email, password, phone, bio, photo } = existUser;
    res.status(201).json({
      _id,
      name,
      email,
      password,
      phone,
      bio,
      photo,
      token
    });
  } else {
    res.status(400);
    throw new Error("Invalid email or Password");
  }
});

const logout = asyncHandler( async (req,res)=>{
    res.cookie("token", "");
    res.send("logout")
})

module.exports = { register, login, logout};
