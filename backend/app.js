const express = require("express");
const dotenv = require("dotenv").config();
const ConnectDb = require("./utils/db");
const cookieParser = require("cookie-parser");
const chalk = require("chalk");
const errorHandler = require("./middleware/errorMiddleware");
const userRoute = require("./routes/userRoute");
const productRoute = require("./routes/productRoute");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");


const app = express();

// middlewares
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// routes
app.use("/api", userRoute);
app.use("/api/products", productRoute);

//error handler
app.use(errorHandler);


const PORT = process.env.PORT || 3000;

ConnectDb().then(() => {
  app.listen(PORT, () => {
    console.log(chalk.cyan("Server is running on port", PORT));
  });
});
