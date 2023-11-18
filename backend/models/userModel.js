const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userModel = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      require: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    pic: {
      type: String,
      default:
        "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    },
  },
  {
    timestamps: true,
  }
);

userModel.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

//middleware

//before saving the data User into database its gonna encrypt the password
userModel.pre("save", async function (next) {
  if (!this.isModified("password")) {
    // Check if the password field is modified
    return next(); // Return and continue with the save operation
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt); // Correctly hash the password
  next(); // Continue with the save operation
});

const User = mongoose.model("User", userModel);
module.exports = User;
