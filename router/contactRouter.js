const express = require("express");
const router = express.Router();
const contactController = require("../authController/contactController");
router.post("/message", contactController.createContactMessage);
router.get("/messages", contactController.getAllContactMessages);
// Create contact us message
module.exports = router;
