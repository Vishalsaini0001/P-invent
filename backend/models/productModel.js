const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "user",
    },
    name: {
      type: String,
      required: [true, "Please enter a name"],
      trim: true,
    },
    sku: {
      type: String,
      required: true,
      trim: true,
      default: "SKU",
    },
    category: {
      type: String,
      required: [true, "Please add category"],
      trim: true,
    },
    quantity: {
      type: String,
      required: [true, "Please add quantity"],
      trim: true,
    },
    price: {
      type: String,
      required: [true, "Please add price"],
      trim: true,
    },
    discription: {
      type: String,
      required: [true, "Please add discription"],
      trim: true,
    },
    image: {
      type: Object,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

const product = mongoose.model("product", productSchema);

module.exports = product;
