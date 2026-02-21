const express = require("express");
const { protect, authorize } = require("../middlewares/authMiddleware");
const {
  getStats,
  loanDistribution,
  branchStats,
  fraudStats,
} = require("../controllers/analyticsController");

const router = express.Router();

// only admin
router.get("/stats", protect, authorize("admin"), getStats);
router.get("/distribution", protect, authorize("admin"), loanDistribution);
router.get("/branch", protect, authorize("admin"), branchStats);

// fraud analytics
router.get("/fraud-stats", protect, authorize("admin"), fraudStats);

module.exports = router;