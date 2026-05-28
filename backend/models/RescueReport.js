const mongoose = require('mongoose');

const rescueReportSchema = new mongoose.Schema(
  {
    reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    animalType: {
      type: String,
      enum: ['dog', 'cat', 'bird', 'cow', 'horse', 'other'],
      required: true,
    },
    image: { type: String, default: '' },
    location: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
      address: { type: String, default: '' },
    },
    description: { type: String, required: true },
    emergencyLevel: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium',
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'in_progress', 'rescued', 'closed'],
      default: 'pending',
    },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    volunteers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('RescueReport', rescueReportSchema);
