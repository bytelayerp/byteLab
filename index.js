require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const app = express();
const userRouter = require("./router/userRouter.js");
const contactRouter = require("./router/contactRouter.js");
const projectRouter = require("./router/projectRouter.js");
// Security// Trust proxy for Replit environment
app.set("trust proxy", 1);
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate limit
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour!",
});
app.use(limiter);

// Routes
app.use("/api/users", userRouter);
app.use("/api/contact", contactRouter);
app.use("/api/projects", projectRouter);
app.get("/api/public", (req, res) => {
  res.send("Hello World!");
});

// DB Connection
mongoose
  .connect(process.env.MONGDB_URL) // 🔥 Fixed ENV name
  .then(() => {
    console.log("✅ MongoDB Connected");

    app.listen(process.env.PORT, () => {
      console.log(`🚀 Server is running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err.message);
  });
