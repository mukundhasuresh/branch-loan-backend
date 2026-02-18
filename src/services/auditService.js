const AuditLog = require("../models/AuditLog");

const logAction = async ({
  user,
  action,
  entity,
  entityId,
  branch,
  metadata = {},
}) => {
  try {
    await AuditLog.create({
      user,
      action,
      entity,
      entityId,
      branch,
      metadata,
    });
  } catch (error) {
    console.error("Audit error:", error);
  }
};

module.exports = { logAction };
