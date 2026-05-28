const asyncHandler = require('express-async-handler');
const Donation = require('../models/Donation');
const Notification = require('../models/Notification');

// @desc  Create a donation
// @route POST /api/donations
const createDonation = asyncHandler(async (req, res) => {
  const { amount, message, anonymous } = req.body;
  if (!amount || amount <= 0) { res.status(400); throw new Error('Invalid donation amount'); }

  const donation = await Donation.create({
    donor: req.user._id,
    amount,
    message,
    anonymous: anonymous === true,
    status: 'completed',
    paymentId: `mock_${Date.now()}`,
  });

  await Notification.create({
    recipient: req.user._id,
    type: 'donation_success',
    message: `Thank you for your donation of Rs.${amount}! Your generosity helps save lives.`,
    link: '/donate',
  });

  res.status(201).json(donation);
});

// @desc  Get all donations (admin)
// @route GET /api/donations
const getAllDonations = asyncHandler(async (req, res) => {
  const donations = await Donation.find()
    .populate('donor', 'name email profilePicture')
    .sort({ createdAt: -1 });
  const total = donations.reduce((sum, d) => sum + (d.status === 'completed' ? d.amount : 0), 0);
  res.json({ donations, total });
});

// @desc  Get my donations
// @route GET /api/donations/me
const getMyDonations = asyncHandler(async (req, res) => {
  const donations = await Donation.find({ donor: req.user._id }).sort({ createdAt: -1 });
  res.json(donations);
});

module.exports = { createDonation, getAllDonations, getMyDonations };
