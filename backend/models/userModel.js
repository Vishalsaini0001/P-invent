const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please Enter a Name"],
    },
    email: {
      type: String,
      required: [true, "Enter a Valid Email"],
      unique: true,
      trim: true,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please fill a valid email address",
      ],
    },
    password: {
      type: String,
      required: true,
      required: [true, "Please Enter valid password"],
      minLength: [6, "Password must be more than 6 letters"],
      maxLength: [12, "Password must be less than 12 letters"],
    },
    photo: {
      type: String,
      default:
        "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541",
      required: [true, "Please upload a Profile Picture"],
    },
    phone: {
      type: String,
    },
    bio: {
      type: String,
      maxLength: [32, "Bio must be less than 32 Characters"],
      default: "bio",
    },
  },
  { timestamps: true }
);
const User = mongoose.model("User", userSchema);

module.exports = User;
