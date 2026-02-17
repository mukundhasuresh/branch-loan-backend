const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const {
  updateProfile,
  getScore,
} = require("../controllers/financialController");

const router = express.Router();

router.post("/profile", protect, updateProfile);
router.get("/score", protect, getScore);

module.exports = router;
