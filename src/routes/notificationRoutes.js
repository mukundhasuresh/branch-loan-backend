const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const {
  getNotifications,
  markRead,
} = require("../controllers/notificationController");

const router = express.Router();

router.get("/", protect, getNotifications);
router.put("/:id", protect, markRead);

module.exports = router;
