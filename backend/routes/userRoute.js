const express = require("express");
const Router = express.Router();
const authController = require("../controllers/authController")

Router.route("/register").post(authController.register)
Router.route("/login").post(authController.login)
Router.route("/logout").post(authController.logout)

module.exports = Router;