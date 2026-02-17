require("dotenv").config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");

const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");

const connectDB = require("./src/config/db");

// 👉 import routes
const authRoutes = require("./src/routes/authRoutes");
const userRoutes = require("./src/routes/userRoutes");
const loanRoutes = require("./src/routes/loanRoutes");

const app = express();

// connect database
connectDB();

/* 🔥 SECURITY MIDDLEWARES */

// secure HTTP headers
app.use(helmet());

// prevent MongoDB injection
app.use(mongoSanitize());

// prevent XSS
app.use(xss());

// rate limiting (anti brute-force)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

/* 🔥 BASIC MIDDLEWARES */

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

// 👉 routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/loan", loanRoutes);

app.get("/", (req, res) => {
  res.send("Branch Loan API running 🚀");
});

// 🔥 Debug (optional – remove in production)
console.log("JWT_SECRET:", process.env.JWT_SECRET);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
