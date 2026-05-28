const mongoose = require('mongoose');

const adoptionRequestSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  message: { type: String, default: '' },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  date: { type: Date, default: Date.now },
});

const animalSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: { type: String, enum: ['dog', 'cat', 'bird', 'rabbit', 'other'], required: true },
    breed: { type: String, default: 'Unknown' },
    age: { type: Number, default: 0 }, // in months
    gender: { type: String, enum: ['male', 'female', 'unknown'], default: 'unknown' },
    vaccinated: { type: Boolean, default: false },
    images: [{ type: String }],
    description: { type: String, default: '' },
    status: { type: String, enum: ['available', 'pending', 'adopted'], default: 'available' },
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    adoptionRequests: [adoptionRequestSchema],
    location: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Animal', animalSchema);
