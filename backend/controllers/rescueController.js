const asyncHandler = require('express-async-handler');
const RescueReport = require('../models/RescueReport');
const Notification = require('../models/Notification');

// @desc  Create rescue report
// @route POST /api/rescue
const createReport = asyncHandler(async (req, res) => {
  const { animalType, lat, lng, address, description, emergencyLevel } = req.body;
  const report = await RescueReport.create({
    reportedBy: req.user._id,
    animalType,
    image: req.file ? req.file.path : '',
    location: { lat: parseFloat(lat), lng: parseFloat(lng), address },
    description,
    emergencyLevel,
  });
  await report.populate('reportedBy', 'name profilePicture');
  res.status(201).json(report);
});

// @desc  Get all reports (rescue team/admin sees all, user sees own)
// @route GET /api/rescue
const getReports = asyncHandler(async (req, res) => {
  let query = {};
  if (req.user.role === 'user') query.reportedBy = req.user._id;

  const { status, emergencyLevel, animalType } = req.query;
  if (status) query.status = status;
  if (emergencyLevel) query.emergencyLevel = emergencyLevel;
  if (animalType) query.animalType = animalType;

  const reports = await RescueReport.find(query)
    .populate('reportedBy', 'name profilePicture')
    .populate('assignedTo', 'name profilePicture')
    .sort({ createdAt: -1 });

  res.json(reports);
});

// @desc  Get single report
// @route GET /api/rescue/:id
const getReport = asyncHandler(async (req, res) => {
  const report = await RescueReport.findById(req.params.id)
    .populate('reportedBy', 'name profilePicture email phone')
    .populate('assignedTo', 'name profilePicture');
  if (!report) { res.status(404); throw new Error('Report not found'); }
  res.json(report);
});

// @desc  Accept rescue report (rescue team)
// @route PUT /api/rescue/:id/accept
const acceptReport = asyncHandler(async (req, res) => {
  const report = await RescueReport.findById(req.params.id);
  if (!report) { res.status(404); throw new Error('Report not found'); }

  report.status = 'accepted';
  report.assignedTo = req.user._id;
  await report.save();

  // Notify the reporter
  await Notification.create({
    recipient: report.reportedBy,
    type: 'rescue_update',
    message: `Your rescue report for ${report.animalType} has been accepted by a rescue team!`,
    link: `/rescue/${report._id}`,
  });

  res.json(report);
});

// @desc  Update report status
// @route PUT /api/rescue/:id/status
const updateStatus = asyncHandler(async (req, res) => {
  const { status, notes } = req.body;
  const report = await RescueReport.findById(req.params.id);
  if (!report) { res.status(404); throw new Error('Report not found'); }

  report.status = status;
  if (notes) report.notes = notes;
  await report.save();

  await Notification.create({
    recipient: report.reportedBy,
    type: 'rescue_update',
    message: `Your rescue report status updated to: ${status.replace('_', ' ')}`,
    link: `/rescue/${report._id}`,
  });

  res.json(report);
});

// @desc  Delete report
// @route DELETE /api/rescue/:id
const deleteReport = asyncHandler(async (req, res) => {
  const report = await RescueReport.findById(req.params.id);
  if (!report) { res.status(404); throw new Error('Report not found'); }
  if (report.reportedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403); throw new Error('Not authorized');
  }
  await report.deleteOne();
  res.json({ message: 'Report deleted' });
});

module.exports = { createReport, getReports, getReport, acceptReport, updateStatus, deleteReport };
