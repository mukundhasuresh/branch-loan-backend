require("dotenv").config();

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const connectDB = require("./src/config/db");

// routes
const authRoutes = require("./src/routes/authRoutes");
const userRoutes = require("./src/routes/userRoutes");
const loanRoutes = require("./src/routes/loanRoutes");
const financialRoutes = require("./src/routes/financialRoutes");
const documentRoutes = require("./src/routes/documentRoutes");
const notificationRoutes = require("./src/routes/notificationRoutes");
const analyticsRoutes = require("./src/routes/analyticsRoutes");

// sanitize middleware
const sanitizeMiddleware = require("./src/middlewares/sanitizeMiddleware");

const app = express();
const server = http.createServer(app);

// allowed origins (local + production)
const allowedOrigins = [
  "http://localhost:5173",
  process.env.CLIENT_URL, // Vercel URL
];

// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});

global.io = io;

// connect database
connectDB();

/* SECURITY */

// secure headers
app.use(helmet());

// rate limit
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

/* BASIC */

app.use(express.json());
app.use(cookieParser());
app.use(sanitizeMiddleware);

// CORS config
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

app.use(express.static("public"));

/* ROUTES */
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/loan", loanRoutes);
app.use("/api/financial", financialRoutes);
app.use("/api/document", documentRoutes);
app.use("/api/notification", notificationRoutes);
app.use("/api/analytics", analyticsRoutes);

app.get("/", (req, res) => {
  res.send("Branch Loan API running");
});

/* DEBUG */
if (process.env.NODE_ENV !== "production") {
  console.log("JWT_SECRET:", process.env.JWT_SECRET);
}

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});