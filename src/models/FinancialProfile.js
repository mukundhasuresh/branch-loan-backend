const mongoose = require("mongoose");

const financialProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  income: Number,
  existingLoans: Number,
  repaymentHistory: {
    type: Number, // 0 to 100
    default: 50,
  },
  creditScore: {
    type: Number,
    default: 650,
  },
});

module.exports = mongoose.model("FinancialProfile", financialProfileSchema);
