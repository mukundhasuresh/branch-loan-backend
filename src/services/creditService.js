const calculateCreditScore = ({ income, existingLoans, repaymentHistory }) => {
  let score = 300;

  // income factor
  if (income > 100000) score += 200;
  else if (income > 50000) score += 150;
  else score += 100;

  // loan burden
  if (existingLoans < income * 2) score += 150;
  else score -= 50;

  // repayment
  score += repaymentHistory * 2;

  return Math.min(score, 900);
};

module.exports = { calculateCreditScore };
