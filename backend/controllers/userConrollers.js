const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const generateToken = require("../config/generateToken");

//register user
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, pic } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please enter all the fields");
  }

  // check if user already exist
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exist");
  }

  //create new user

  const user = await User.create({
    name,
    email,
    password,
    // pic,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      // pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Failed to create the user");
  }
});

// login user
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // find user exist in database or not
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      // pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid Email or Password");
  }
});

//get all users
// /api/user?search=akhtar
const allUser = asyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        // $or : operator performs a logical OR operation on an array of one or more <expressions>
        //regex: Provides regular expression capabilities for pattern matching strings in queries.

        $or: [
          { name: { $regex: req.query.search, $options: "i" } }, // i = case insensitive
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {}; // else we not gonna do anything

  const users = await User.find(keyword).find({ _id: { $ne: req.user_id } }); // find all user except current user
  res.send(users);
});

module.exports = { registerUser, loginUser, allUser };
