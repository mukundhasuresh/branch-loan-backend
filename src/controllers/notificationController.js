const Notification = require("../models/Notification");

// get notifications
exports.getNotifications = async (req, res) => {
  const notifications = await Notification.find({
    user: req.user._id,
  }).sort({ createdAt: -1 });

  res.json(notifications);
};

// mark as read
exports.markRead = async (req, res) => {
  const notif = await Notification.findById(req.params.id);
  notif.read = true;
  await notif.save();
  res.json(notif);
};
