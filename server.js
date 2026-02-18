require("dotenv").config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const connectDB = require("./src/config/db");

// 👉 import routes
const authRoutes = require("./src/routes/authRoutes");
const userRoutes = require("./src/routes/userRoutes");
const loanRoutes = require("./src/routes/loanRoutes");
const financialRoutes = require("./src/routes/financialRoutes");
const documentRoutes = require("./src/routes/documentRoutes"); // ✅ NEW

// 👉 custom sanitize middleware
const sanitizeMiddleware = require("./src/middlewares/sanitizeMiddleware");

const app = express();

// connect database
connectDB();

/* 🔥 SECURITY MIDDLEWARES */

// secure HTTP headers
app.use(helmet());

// rate limiting (anti brute-force)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

/* 🔥 BASIC MIDDLEWARES */

app.use(express.json());
app.use(cookieParser());

// 👉 manual Mongo injection protection
app.use(sanitizeMiddleware);

// ✅ Production-ready CORS
const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:5173",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS blocked"));
      }
    },
    credentials: true,
  })
);

// 👉 routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/loan", loanRoutes);
app.use("/api/financial", financialRoutes);
app.use("/api/document", documentRoutes); // ✅ NEW

app.get("/", (req, res) => {
  res.send("Branch Loan API running 🚀");
});

// 🔥 Debug (optional – remove in production)
console.log("JWT_SECRET:", process.env.JWT_SECRET);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
