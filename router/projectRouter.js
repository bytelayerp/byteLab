const projectController = require("../authController/projectController");
const authController = require("../authController/authController");
const express = require("express");
const router = express.Router();
router.post("/create", authController.protect, projectController.createProject);
router.get("/all", projectController.getAllProjects);
router.get("/get/:id", projectController.getProjectById);
router.delete(
  "/delete/:id",
  authController.protect,
  projectController.deleteProject
);
module.exports = router;
