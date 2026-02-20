const Loan = require("../models/Loan");
const FinancialProfile = require("../models/FinancialProfile");
const User = require("../models/User");
const { logAction } = require("../services/auditService");
const { calculateFraudScore } = require("../services/fraudService");
const { sendNotification } = require("../services/notificationService");

// create loan
exports.createLoan = async (req, res) => {
  try {
    const { customerName, amount, purpose } = req.body;

    const loan = await Loan.create({
      customerName,
      amount,
      purpose,
      branch: req.user.branch,
      createdBy: req.user._id,
    });

    // 🔹 Notification to user
    await sendNotification(
      req.user._id,
      "Loan application submitted",
      "loan"
    );

    // Fraud Detection
    const fraudScore = await calculateFraudScore(
      req.user._id,
      amount
    );

    loan.fraudScore = fraudScore;

    if (fraudScore > 50) {
      loan.fraudFlag = true;

      // 🔹 Fraud alert to admins
      const admins = await User.find({ role: "admin" });

      for (const admin of admins) {
        await sendNotification(
          admin._id,
          "Fraud risk detected in loan",
          "fraud"
        );
      }
    }

    await loan.save();

    // audit log
    await logAction({
      user: req.user._id,
      action: "CREATE_LOAN",
      entity: "Loan",
      entityId: loan._id,
      branch: req.user.branch,
    });

    res.status(201).json(loan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// get loans
exports.getLoans = async (req, res) => {
  try {
    let loans;

    if (req.user.role === "admin") {
      loans = await Loan.find().populate("createdBy", "name");
    } else {
      loans = await Loan.find({ branch: req.user.branch });
    }

    res.json(loans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// manager review
exports.reviewLoan = async (req, res) => {
  try {
    const loan = await Loan.findById(req.params.id);

    if (!loan) {
      return res.status(404).json({ message: "Loan not found" });
    }

    // 🚨 Block High Risk Loans
    if (loan.fraudFlag) {
      return res.status(400).json({
        message: "Loan flagged for fraud. Manual review required.",
      });
    }

    loan.status = "manager_approved";
    loan.reviewedBy = req.user._id;

    await loan.save();

    // audit log
    await logAction({
      user: req.user._id,
      action: "REVIEW_LOAN",
      entity: "Loan",
      entityId: loan._id,
      branch: req.user.branch,
    });

    res.json(loan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// admin approve
exports.approveLoan = async (req, res) => {
  try {
    const loan = await Loan.findById(req.params.id);

    if (!loan) {
      return res.status(404).json({ message: "Loan not found" });
    }

    // credit risk check
    const profile = await FinancialProfile.findOne({
      user: loan.createdBy,
    });

    if (profile && profile.creditScore < 600) {
      return res
        .status(400)
        .json({ message: "Loan rejected due to low credit score" });
    }

    loan.status = "approved";
    await loan.save();

    // audit log
    await logAction({
      user: req.user._id,
      action: "APPROVE_LOAN",
      entity: "Loan",
      entityId: loan._id,
      branch: req.user.branch,
    });

    res.json(loan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// reject
exports.rejectLoan = async (req, res) => {
  try {
    const loan = await Loan.findById(req.params.id);

    if (!loan) {
      return res.status(404).json({ message: "Loan not found" });
    }

    loan.status = "rejected";
    await loan.save();

    // audit log
    await logAction({
      user: req.user._id,
      action: "REJECT_LOAN",
      entity: "Loan",
      entityId: loan._id,
      branch: req.user.branch,
    });

    res.json(loan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔥 get fraud loans (admin only)
exports.getFraudLoans = async (req, res) => {
  try {
    const loans = await Loan.find({ fraudFlag: true })
      .populate("createdBy", "name email");

    res.json(loans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};