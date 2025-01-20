const express = require("express");
const dotenv = require("dotenv").config();

const ConnectDb = require("./utils/db");
const cookieParser = require("cookie-parser");
const chalk = require("chalk");
const route = require("./routes/userRoute");
const errorHandler = require("./middleware/errorMiddleware");

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(express.urlencoded({ extended: false }));

app.use("/api", route);

app.use(errorHandler);
const PORT = process.env.PORT || 3000;

ConnectDb().then(() => {
  app.listen(PORT, () => {
    console.log(chalk.cyan("Server is running on port", PORT));
  });
});
