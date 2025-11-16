const mongoose = require("mongoose");
const validator = require("validator");
const reviewSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide your name"],
      maxlength: 50,
    },
    email: {
      type: String,
      required: [, "Please provide your email"],
      validator: [validator.isEmail, "Please enter a valid email"],
    },
    phone: {
      type: String,
      required: [true, "Please provide your phone number"],
      maxlength: 15,
      validator: [validator.isMobilePhone, "Please enter a valid phone number"],
    },
    message: {
      type: String,
      required: [true, "Please provide your message"],
      maxlength: 500,
    },
  },
  { timestamps: true }
);
const ContactUs = mongoose.model("ContactUs", reviewSchema);
module.exports = ContactUs;
