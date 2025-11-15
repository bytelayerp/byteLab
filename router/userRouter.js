const express = require("express");
const router = express.Router();
const authController = require("../authController/authController");

router.post(
  "/signup",
  authController.protect,
  authController.strictTo("admin"),
  authController.createUser
);
router.post("/login", authController.login);
module.exports = router;
