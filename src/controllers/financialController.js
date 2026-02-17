const FinancialProfile = require("../models/FinancialProfile");
const { calculateCreditScore } = require("../services/creditService");

// create/update profile
exports.updateProfile = async (req, res) => {
  try {
    const { income, existingLoans, repaymentHistory } = req.body;

    const creditScore = calculateCreditScore({
      income,
      existingLoans,
      repaymentHistory,
    });

    const profile = await FinancialProfile.findOneAndUpdate(
      { user: req.user._id },
      { income, existingLoans, repaymentHistory, creditScore },
      { upsert: true, new: true }
    );

    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// get score
exports.getScore = async (req, res) => {
  const profile = await FinancialProfile.findOne({ user: req.user._id });
  res.json(profile);
};
