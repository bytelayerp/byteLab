const ContactUs = require("../models/contactus.model");
const validator = require("validator");
exports.createContactMessage = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;
    const contactMessage = await ContactUs.create({
      name,
      email,
      phone,
      message,
    });
    res.status(201).json({
      status: "success",
      data: {
        contactMessage,
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
exports.getAllContactMessages = async (req, res) => {
  try {
    const messages = await ContactUs.find();
    res.status(200).json({
      status: "success",
      results: messages.length,
      data: {
        messages,
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
