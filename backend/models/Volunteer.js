const mongoose = require('mongoose');

const volunteerSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    skills: [{ type: String }],
    availability: { type: String, enum: ['full_time', 'part_time', 'weekends'], default: 'part_time' },
    assignedRescues: [{ type: mongoose.Schema.Types.ObjectId, ref: 'RescueReport' }],
    completedRescues: [{ type: mongoose.Schema.Types.ObjectId, ref: 'RescueReport' }],
    totalRescues: { type: Number, default: 0 },
    status: { type: String, enum: ['active', 'inactive', 'pending'], default: 'pending' },
    bio: { type: String, default: '' },
    location: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Volunteer', volunteerSchema);
