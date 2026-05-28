const asyncHandler = require('express-async-handler');
const Notification = require('../models/Notification');

// @desc  Get my notifications
// @route GET /api/notifications
const getNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ recipient: req.user._id })
    .sort({ createdAt: -1 })
    .limit(50);
  const unreadCount = notifications.filter((n) => !n.read).length;
  res.json({ notifications, unreadCount });
});

// @desc  Mark notification as read
// @route PUT /api/notifications/:id/read
const markRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.id);
  if (!notification) { res.status(404); throw new Error('Notification not found'); }
  notification.read = true;
  await notification.save();
  res.json(notification);
});

// @desc  Mark all as read
// @route PUT /api/notifications/read-all
const markAllRead = asyncHandler(async (req, res) => {
  await Notification.updateMany({ recipient: req.user._id, read: false }, { read: true });
  res.json({ message: 'All notifications marked as read' });
});

// @desc  Delete notification
// @route DELETE /api/notifications/:id
const deleteNotification = asyncHandler(async (req, res) => {
  await Notification.findByIdAndDelete(req.params.id);
  res.json({ message: 'Notification deleted' });
});

module.exports = { getNotifications, markRead, markAllRead, deleteNotification };
