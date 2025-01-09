const UserModel = require("../models/userModel");
const asyncHandler = require("express-async-handler")

const register = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    
    // Validate fields presence
    if (!name || !email || !password) {
        res.status(400);
        throw new Error("Please Enter All Fields");
    }

    // Validate password length
    if (password.length < 6) {
        res.status(400);
        throw new Error("Password must be at least 6 characters");
    }

    // Check if user already exists
    const userExists = await UserModel.findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error("User already registered! Try a different email.");
    }

    // Create the user
    const user = await UserModel.create({
        name,
        email,
        password,
    });

    if (user) {
        const { _id, name, email,password, phone, bio, photo } = user;
        res.status(201).json({
            _id, name, email, password, phone, bio, photo
        });
    } else {
        res.status(400);
        throw new Error("Invalid user input");
    }
});

  
module.exports = { register };
