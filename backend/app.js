const express = require("express");
const dotenv = require("dotenv").config();
const ConnectDb = require("./utils/db");

const app = express();

const PORT = process.env.PORT || 3000;

ConnectDb().then(() => {
  app.listen(PORT, () => {
    console.log("Server is running on port", PORT);
  });
});
