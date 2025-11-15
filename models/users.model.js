const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide your name"],
    maxlength: 50,
  },

  email: {
    type: String,
    required: [true, "Please provide your email"],
    validate: [validator.isEmail, "Please enter a valid email"],
    unique: true,
  },

  password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 12,
    select: false,
  },

  confirmPassword: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 12,
    validate: {
      validator: function (val) {
        return val === this.password;
      },
      message: "Passwords do not match!",
    },
  },

  role: {
    type: String,
    enum: ["Editor", "admin"],
    default: "Editor",
  },
});

// Hash password before saving
userSchema.pre("save", async function (next) {
  // Only run if password was modified or new
  if (!this.isModified("password")) return next();

  // Hash password
  this.password = await bcrypt.hash(this.password, 12);

  // Delete confirmPassword
  this.confirmPassword = undefined;

  next();
});

// Compare passwords for login
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model("User", userSchema);
module.exports = User;
