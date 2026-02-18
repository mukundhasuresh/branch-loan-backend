const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    type: {
      type: String,
      enum: ["aadhaar", "pan", "salary"],
    },
    fileUrl: String,
    status: {
      type: String,
      enum: ["pending", "verified", "rejected"],
      default: "pending",
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Document", documentSchema);
