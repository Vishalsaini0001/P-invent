const express = require("express");
const Router = express.Router();
const authController = require("../controllers/authController");
const protect = require("../middleware/authmiddleware");

Router.route("/register").post(authController.register);
Router.route("/login").post(authController.login);
Router.route("/logout").get(authController.logout);
Router.route("/getUser").get(protect, authController.getUser);
Router.route("/loggedin").get(authController.loggedInStatus);
Router.route("/updateuser").patch(protect, authController.updateUser);
Router.route("/changepassword").patch(protect, authController.changepassword);
Router.route("/forgotpassword").post(authController.forgotpassword);
Router.route("/resetPassword/:resetToken").put(authController.resetPassword);

module.exports = Router;
