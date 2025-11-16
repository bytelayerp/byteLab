const Project = require("../models/projects.model.js");
exports.createProject = async (req, res) => {
  try {
    const { title, description, photo } = req.body;
    const project = await Project.create({
      title,
      description,
      photo,
    });
    res.status(201).json({
      status: "success",
      data: {
        project,
      },
    });
  } catch (err) {
    if (err.name === "ValidationError") {
      const errors = Object.values(err.errors).map((el) => el.message);
      return res
        .status(400)
        .json({ status: "fail", message: errors.join(". ") });
    }
    res.status(500).json({
      status: "server error",
      message: err.message,
    });
  }
};
exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find();
    res.status(200).json({
      status: "success",
      results: projects.length,
      data: {
        projects,
      },
    });
  } catch (err) {
    if (err.name === "ValidationError") {
      const errors = Object.values(err.errors).map((el) => el.message);
      return res
        .status(400)
        .json({ status: "fail", message: errors.join(". ") });
    }
    res.status(500).json({
      status: "server error",
      message: err.message,
    });
  }
};
exports.getProjectById = async (req, res) => {
  const { id } = req.params;
  try {
    const project = await Project.findById(id);
    if (!project) {
      return res
        .status(404)
        .json({ status: "fail", message: "Project not found" });
    }
    res.status(200).json({
      status: "success",
      data: {
        project,
      },
    });
  } catch (err) {
    if (err.name === "ValidationError") {
      const errors = Object.values(err.errors).map((el) => el.message);
      return res
        .status(400)
        .json({ status: "fail", message: errors.join(". ") });
    }
    res.status(500).json({
      status: "server error",
      message: err.message,
    });
  }
};
exports.updateProject = async (req, res) => {};
exports.deleteProject = async (req, res) => {
  const { id } = req.params;

  try {
    const project = await Project.findByIdAndDelete(id);
    if (!project) {
      return res
        .status(404)
        .json({ status: "fail", message: "Project not found" });
    }
    res.status(201).json({
      status: "success",
      message: "Project deleted successfully",
    });
  } catch (err) {
    if (err.name === "ValidationError") {
      const errors = Object.values(err.errors).map((el) => el.message);
      return res
        .status(400)
        .json({ status: "fail", message: errors.join(". ") });
    }
    res.status(500).json({
      status: "server error",
      message: err.message,
    });
  }
};
