const FinancialProfile = require("../models/FinancialProfile");

const calculateFraudScore = async (user, loanAmount) => {
  let score = 0;

  const profile = await FinancialProfile.findOne({ user });

  if (!profile) return 20;

  // high amount relative to income
  if (loanAmount > profile.income * 5) score += 40;

  // low credit score
  if (profile.creditScore < 600) score += 30;

  // many existing loans
  if (profile.existingLoans > 3) score += 20;

  return score;
};

module.exports = { calculateFraudScore };
