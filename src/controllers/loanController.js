const Loan = require("../models/Loan");

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

// admin approve
exports.approveLoan = async (req, res) => {
  try {
    const loan = await Loan.findById(req.params.id);

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