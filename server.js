require("dotenv").config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./src/config/db");

// 👉 import routes
const authRoutes = require("./src/routes/authRoutes");

const app = express();

// connect database
connectDB();

// middlewares
app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));

// 👉 use routes
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Branch Loan API running 🚀");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

console.log("JWT_SECRET:", process.env.JWT_SECRET);