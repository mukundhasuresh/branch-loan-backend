const mongoose = require("mongoose");

const loanSchema = new mongoose.Schema(
  {
    customerName: { type: String, required: true },
    amount: { type: Number, required: true },
    purpose: { type: String, required: true },

    status: {
      type: String,
      enum: ["pending", "manager_approved", "approved", "rejected"],
      default: "pending",
    },

    branch: { type: String, required: true },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Loan", loanSchema);