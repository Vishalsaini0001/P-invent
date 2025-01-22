const asyncHandler = require("express-async-handler");
const productModel = require("../models/productModel");
const { formatFileSize } = require("../utils/fileUpload");
const cloudinary = require("cloudinary");

const createProduct = asyncHandler(async (req, res) => {
  const { name, sku, category, quantity, price, discription } = req.body;

  if (!name || !sku || !category || !quantity || !price || !discription) {
    res.status(400);
    throw new Error("Please enter all fields");
  }

  //hanlde image updload
  let fileData = {};
  if (req.file) {
    //save to cloudinary
    let uploadFile;
    try {
      uploadFile = await cloudinary.uploader.upload(req.file.path, {
        folder: "Pinvent App",
        resource_type: "image",
      });
    } catch (error) {
      res.status(500);
      throw new Error("failed to upload imgage");
    }

    fileData = {
      fileName: req.file.originalname,
      filePath: uploadFile.secure_url,
      fileType: req.file.mimetype,
      fileSize: formatFileSize(req.file.size, 2),
    };
  }

  //create product
  const product = await productModel.create({
    user: req.user._id,
    name,
    sku,
    category,
    quantity,
    price,
    discription,
    image: fileData,
  });

  res.status(201).json(product);
});

module.exports = { createProduct };
