const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    action: String,
    entity: String,
    entityId: mongoose.Schema.Types.ObjectId,
    branch: String,
    metadata: Object,
  },
  { timestamps: true }
);

module.exports = mongoose.model("AuditLog", auditLogSchema);
