const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide your name"],
    maxlength: 50,
  },
  rating: {
    type: Number,
    required: [true, "Please provide a rating"],
    miilength: 1,
    maxlength: 5,
  },
  photo: {
    type: String,
    required: [true, "Please provide photo URL"],
  },
});
const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;
