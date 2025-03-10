const UserModel = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const tokenModel = require("../models/tokenModel");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");
const { userInfo } = require("os");

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
    await user.save();
    res.status(200).send("password changed succesfully");
  } else {
    res.status(400);
    throw new Error("old password incorrect!");
  }
});
// forgot password
const forgotpassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await UserModel.findOne({ email });

  if (!user) {
    res.status(400);
    throw new Error("email not exist");
  }
  //delete the token if already exists in db
  let token = await tokenModel.findOne({ userId: user._id });
  if (token) {
    await tokenModel.deleteOne();
  }

  let resetToken = crypto.randomBytes(32).toString("hex") + user._id;

  const hashToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  await tokenModel.create({
    userId: user._id,
    token: hashToken,
    createdAt: Date.now(),
    expireAt: Date.now() + 30 * (60 * 1000), //after 30 min
  });

  const resetUrl = `${process.env.FRONTEND_URL}/resetPassword/${resetToken}`;
  console.log(resetToken);
  const message = `
  <h2>Hello  ${user.name} </h2>
  <p>Please use the URL below to reset your password</p>
  <p>This Reset URL is valid for 30 Minutes</p>

  <a href=${resetUrl}  clicktracking=off >${resetUrl}</a>
   
  <p>Regards...</p>
  <h3>Pinvent team</h3>
  
  `;
  const subject = "Password Reset Request";
  const send_to = user.email;
  const send_from = process.env.EMAIL_USER;

  try {
    await sendEmail(subject, message, send_to, send_from);
    res.status(200);
    res.json({ success: true, message: "Reset Email Sent Successfully " });
  } catch (error) {
    res.status(500);
    throw new Error("Email not sent, Please try again later");
  }
});
// reset password
const resetPassword = asyncHandler(async (req, res) => {
  const { password } = req.body;
  const { resetToken } = req.params;

  // hash token and then compare to the token in DB
  const hashToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // find the token in DB

  const userToken = await tokenModel.findOne({
    token: hashToken,
    expireAt: { $gt: Date.now() },
  });
  if (!userToken) {
    res.status(404);
    throw new Error("Invalid or Expired Token");
  }

  const user = await UserModel.findOne({ _id: userToken.userId });
  user.password = password;
  await user.save();

  res.status(200).json({
    message: "Password Reset Successfully!",
  });
});

module.exports = {
  register,
  login,
  logout,
  getUser,
  loggedInStatus,
  updateUser,
  changepassword,
  forgotpassword,
  resetPassword,
};
