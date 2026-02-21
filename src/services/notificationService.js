const Notification = require("../models/Notification");

const sendNotification = async (user, message, type) => {
  try {
    await Notification.create({
      user,
      message,
      type,
    });

    // Real-time notification emit
    if (global.io) {
      global.io.emit("notification", {
        userId: user,
        message,
        type,
      });
    }
  } catch (error) {
    console.error("Notification error:", error);
  }
};

module.exports = { sendNotification };