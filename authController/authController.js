const User = require("../models/users.model.js");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
// Function to sign JWT token
const Tokensing = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Create user
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, confirmPassword, role } = req.body;
    if (!email || !password || !confirmPassword) {
      return res.status(400).json({ message: "Please fill all fields" });
    }
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      password,
      confirmPassword,
      role,
    });

    // Generate JWT Token
    const token = Tokensing(user._id);
    user.password = undefined;
    res.cookie("jwt", token, {
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });

    res.status(201).json({
      status: "success",
      token,
      data: {
        user,
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
// lOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    // Check if user exists
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(401).json({ message: "Incorrect email or password" });
    }

    // Generate JWT Token
    const token = Tokensing(user._id);
    user.password = undefined;
    user.email = undefined;
    res.cookie("jwt", token, {
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });

    res.status(200).json({
      status: "success",
      token,
      data: {
        user,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "server error",
      message: err.message,
    });
  }
};
// get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password -email");
    res.status(200).json({
      status: "success",
      results: users.length,
      data: {
        users,
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
exports.protect = async (req, res, next) => {
  try {
    let token;

    // 1️⃣ Check if token exists
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "You are not logged in" });
    }

    // 2️⃣ Verify token
    let decoded;
    try {
      decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    } catch (error) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    // 3️⃣ Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return res.status(401).json({ message: "User no longer exists" });
    }

    // 4️⃣ Attach user to request object
    req.user = currentUser;

    next();
  } catch (err) {
    res.status(500).json({
      status: "server error",
      message: err.message,
    });
  }
};
exports.strictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: "You do not have the authority to perform this action",
      });
    }
    next();
  };
};
