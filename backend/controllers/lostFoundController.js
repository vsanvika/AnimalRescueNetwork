const asyncHandler = require('express-async-handler');
const LostFound = require('../models/LostFound');

// @desc  Create lost/found report
// @route POST /api/lostfound
const createReport = asyncHandler(async (req, res) => {
  const { type, animalType, description, lat, lng, address, contactName, contactPhone, contactEmail, color, distinctiveFeatures } = req.body;
  const images = req.files ? req.files.map((f) => f.path) : [];

  const report = await LostFound.create({
    type, animalType, images, description,
    lastSeenLocation: { lat: parseFloat(lat) || 0, lng: parseFloat(lng) || 0, address },
    contactName, contactPhone, contactEmail,
    color, distinctiveFeatures,
    reportedBy: req.user._id,
  });

  await report.populate('reportedBy', 'name profilePicture');
  res.status(201).json(report);
});

// @desc  Get all reports
// @route GET /api/lostfound
const getReports = asyncHandler(async (req, res) => {
  const { type, animalType, status } = req.query;
  const query = {};
  if (type) query.type = type;
  if (animalType) query.animalType = animalType;
  if (status) query.status = status;

  const reports = await LostFound.find(query)
    .populate('reportedBy', 'name profilePicture')
    .sort({ createdAt: -1 });
  res.json(reports);
});

// @desc  Get single report
// @route GET /api/lostfound/:id
const getReport = asyncHandler(async (req, res) => {
  const report = await LostFound.findById(req.params.id).populate('reportedBy', 'name profilePicture email');
  if (!report) { res.status(404); throw new Error('Report not found'); }
  res.json(report);
});

// @desc  Mark as resolved
// @route PUT /api/lostfound/:id/resolve
const resolveReport = asyncHandler(async (req, res) => {
  const report = await LostFound.findById(req.params.id);
  if (!report) { res.status(404); throw new Error('Report not found'); }
  report.status = 'resolved';
  await report.save();
  res.json(report);
});

// @desc  Delete report
// @route DELETE /api/lostfound/:id
const deleteReport = asyncHandler(async (req, res) => {
  const report = await LostFound.findById(req.params.id);
  if (!report) { res.status(404); throw new Error('Report not found'); }
  await report.deleteOne();
  res.json({ message: 'Report deleted' });
});

module.exports = { createReport, getReports, getReport, resolveReport, deleteReport };
