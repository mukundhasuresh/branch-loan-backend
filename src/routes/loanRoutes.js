const express = require("express");
const {
  createLoan,
  getLoans,
  reviewLoan,
  approveLoan,
  rejectLoan,
  getFraudLoans, // ✅ ADD THIS
} = require("../controllers/loanController");

const { protect, authorize } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/", protect, createLoan);
router.get("/", protect, getLoans);

// 🔥 ADD THIS ROUTE
router.get("/fraud", protect, authorize("admin"), getFraudLoans);

router.put("/review/:id", protect, authorize("manager"), reviewLoan);
router.put("/approve/:id", protect, authorize("admin"), approveLoan);
router.put("/reject/:id", protect, authorize("admin"), rejectLoan);

module.exports = router;