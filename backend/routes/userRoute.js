const express = require("express");
const Router = express.Router();
const authController = require("../controllers/authController")

Router.route("/register").post(authController.register)

module.exports = Router;