const express = require("express");
const { protect, authorize } = require("../middlewares/authMiddleware");

const router = express.Router();

// protected route
router.get("/profile", protect, (req, res) => {
  res.json(req.user);
});

// admin only
router.get("/admin", protect, authorize("admin"), (req, res) => {
  res.json({ message: "Welcome Admin" });
});

module.exports = router;