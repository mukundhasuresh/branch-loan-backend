const Loan = require("../models/Loan");
const FinancialProfile = require("../models/FinancialProfile"); // ✅ NEW

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

    res.status(201).json(loan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// get loans
exports.getLoans = async (req, res) => {
  try {
    let loans;

    // admin sees all
    if (req.user.role === "admin") {
      loans = await Loan.find().populate("createdBy", "name");
    } else {
      // branch-based
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

    loan.status = "manager_approved";
    loan.reviewedBy = req.user._id;

    await loan.save();

    res.json(loan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// admin approve (✅ risk-based)
exports.approveLoan = async (req, res) => {
  try {
    const loan = await Loan.findById(req.params.id);

    if (!loan) {
      return res.status(404).json({ message: "Loan not found" });
    }

    // ✅ Get financial profile
    const profile = await FinancialProfile.findOne({
      user: loan.createdBy,
    });

    // ✅ Risk check
    if (profile && profile.creditScore < 600) {
      return res
        .status(400)
        .json({ message: "Loan rejected due to low credit score" });
    }

    // approve
    loan.status = "approved";
    await loan.save();

    res.json(loan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// reject
exports.rejectLoan = async (req, res) => {
  try {
    const loan = await Loan.findById(req.params.id);

    loan.status = "rejected";
    await loan.save();

    res.json(loan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
