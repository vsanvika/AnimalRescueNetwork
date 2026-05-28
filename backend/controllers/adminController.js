const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const RescueReport = require('../models/RescueReport');
const Animal = require('../models/Animal');
const Donation = require('../models/Donation');
const Volunteer = require('../models/Volunteer');

// @desc  Get dashboard analytics
// @route GET /api/admin/analytics
const getAnalytics = asyncHandler(async (req, res) => {
  const [totalUsers, totalRescues, totalAnimals, totalVolunteers, donations] = await Promise.all([
    User.countDocuments(),
    RescueReport.countDocuments(),
    Animal.countDocuments(),
    Volunteer.countDocuments(),
    Donation.find({ status: 'completed' }),
  ]);

  const rescuesByStatus = await RescueReport.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);

  const rescuesByMonth = await RescueReport.aggregate([
    { $group: { _id: { month: { $month: '$createdAt' }, year: { $year: '$createdAt' } }, count: { $sum: 1 } } },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
    { $limit: 12 },
  ]);

  const totalDonations = donations.reduce((sum, d) => sum + d.amount, 0);

  res.json({
    totalUsers,
    totalRescues,
    totalAnimals,
    totalVolunteers,
    totalDonations,
    rescuesByStatus,
    rescuesByMonth,
  });
});

// @desc  Get all users
// @route GET /api/admin/users
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('-password').sort({ createdAt: -1 });
  res.json(users);
});

// @desc  Block/unblock user
// @route PUT /api/admin/users/:id/block
const toggleBlockUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) { res.status(404); throw new Error('User not found'); }
  if (user.role === 'admin') { res.status(403); throw new Error('Cannot block an admin'); }
  user.isBlocked = !user.isBlocked;
  await user.save();
  res.json({ message: `User ${user.isBlocked ? 'blocked' : 'unblocked'}`, isBlocked: user.isBlocked });
});

// @desc  Verify rescue team
// @route PUT /api/admin/users/:id/verify
const verifyRescueTeam = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) { res.status(404); throw new Error('User not found'); }
  user.isVerified = true;
  await user.save();
  res.json({ message: 'Rescue team verified', user });
});

// @desc  Delete user
// @route DELETE /api/admin/users/:id
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) { res.status(404); throw new Error('User not found'); }
  await user.deleteOne();
  res.json({ message: 'User deleted' });
});

// @desc  Delete any rescue report (admin)
// @route DELETE /api/admin/rescue/:id
const deleteRescueReport = asyncHandler(async (req, res) => {
  const report = await RescueReport.findByIdAndDelete(req.params.id);
  if (!report) { res.status(404); throw new Error('Report not found'); }
  res.json({ message: 'Report deleted by admin' });
});

module.exports = { getAnalytics, getAllUsers, toggleBlockUser, verifyRescueTeam, deleteUser, deleteRescueReport };
