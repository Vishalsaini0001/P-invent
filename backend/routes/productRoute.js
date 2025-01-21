const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const protect = require("../middleware/authmiddleware");
const { upload } = require("../utils/fileUpload");

router.post(
  "/",
  protect,
  upload.single("image"),
  productController.createProduct
);

module.exports = router;
