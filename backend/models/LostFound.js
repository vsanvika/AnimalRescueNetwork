const mongoose = require('mongoose');

const lostFoundSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ['lost', 'found'], required: true },
    animalType: { type: String, required: true },
    images: [{ type: String }],
    description: { type: String, required: true },
    lastSeenLocation: {
      lat: { type: Number, default: 0 },
      lng: { type: Number, default: 0 },
      address: { type: String, default: '' },
    },
    contactName: { type: String, required: true },
    contactPhone: { type: String, required: true },
    contactEmail: { type: String, default: '' },
    reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['open', 'resolved'], default: 'open' },
    color: { type: String, default: '' },
    distinctiveFeatures: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('LostFound', lostFoundSchema);
