const mongoose = require("mongoose");
const validator = require("validator");
const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please provide project title"],
    maxlength: 100,
  },
  description: {
    type: String,
    required: [true, "Please provide project description"],
    maxlength: 1000,
  },

  photo: {
    type: String,
    required: [true, "Please provide project photo URL"],
  },
});
const Project = mongoose.model("Project", projectSchema);
module.exports = Project;
