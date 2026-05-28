const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: {
      type: String,
      enum: ['rescue_update', 'adoption_update', 'new_message', 'donation_success', 'volunteer_assigned', 'general'],
      default: 'general',
    },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
    link: { type: String, default: '' }, // frontend route link
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notification', notificationSchema);
