const UserModel = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { use } = require("../routes/userRoute");

//Generating JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET_KEY, { expiresIn: "1d" });
};
//register user
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
      token,
    });
  } else {
    res.status(400);
    throw new Error("Invalid email or Password");
  }
});
//logout
const logout = asyncHandler(async (req, res) => {
  res.cookie("token", "", {
    path: "/",
    httpOnly: true,
    secure: true,
    sameSite: "none",
    expires: new Date(0),
  });
  return res.status(200).json({ message: "logout Successfully" });
});
//get user data
const getUser = asyncHandler(async (req, res) => {
  const user = await UserModel.findById(req.user._id);

  if (user) {
    const { _id, name, email, password, phone, bio, photo } = user;
    res.status(200).json({
      _id,
      name,
      email,
      password,
      phone,
      bio,
      photo,
    });
  } else {
    res.status(400);
    throw new Error("User not found!");
  }
});
//logged in status
const loggedInStatus = asyncHandler(async (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.json(false);
  }
  //verify token
  const verifed = jwt.verify(token, process.env.JWT_SECRET_KEY);
  if (verifed) {
    return res.json(true);
  }
  return res.json(false);
});
//update user
const updateUser = asyncHandler(async (req, res) => {
  const user = await UserModel.findById(req.user._id);

  if (user) {
    const { name, email, phone, photo, bio } = user;
    user.email = email;
    user.name = req.body.name || name;
    user.phone = req.body.phone || phone;
    user.photo = req.body.photo || photo;
    user.bio = req.body.bio || bio;

    const updatedUser = await user.save();
    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      bio: updatedUser.bio,
      photo: updatedUser.photo,
    });
  } else {
    res.status(404);
    throw new Error("User not found!");
  }
});
//change password
const changepassword = asyncHandler(async (req, res) => {
  const user = await UserModel.findById(req.user._id);
  const { oldpassword, password } = req.body;

  //validate
  if (!user) {
    res.status(401);
    throw new Error("User not found! please login");
  }

  if (!oldpassword || !password) {
    res.status(400);
    throw new Error("Please Enter All Fields");
  }

  const passwordIsCorrect = await bcrypt.compare(oldpassword, user.password);

  if (!passwordIsCorrect) {
    res.status(400);
    throw new Error("Old password incorrect!");
  }

  if (passwordIsCorrect) {
    user.password = password;
    const updatedPassword = await user.save();
    res.status(200).send("password changed succesfully");
  } else {
    res.status(400);
    throw new Error("old password incorrect!");
  }
});
// forgot password
const forgotpassword = asyncHandler(async (req, res) => {
  res.send("forgot password...");
});

module.exports = {
  register,
  login,
  logout,
  getUser,
  loggedInStatus,
  updateUser,
  changepassword,
  forgotpassword
};
