const express = require("express");
const dotenv = require("dotenv").config();
const bodyParser = require("body-parser");
const ConnectDb = require("./utils/db");
const chalk = require('chalk');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("home page");
});

const PORT = process.env.PORT || 3000;

ConnectDb().then(() => {
  app.listen(PORT, () => {
    console.log(chalk.cyan("Server is running on port", PORT));
  });
});
