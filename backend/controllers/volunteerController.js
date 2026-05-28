const asyncHandler = require('express-async-handler');
const Volunteer = require('../models/Volunteer');
const RescueReport = require('../models/RescueReport');
const Notification = require('../models/Notification');

// @desc  Register as volunteer
// @route POST /api/volunteers/register
const registerVolunteer = asyncHandler(async (req, res) => {
  const { skills, availability, bio, location } = req.body;

  const existing = await Volunteer.findOne({ user: req.user._id });
  if (existing) { res.status(400); throw new Error('You are already registered as a volunteer'); }

  const volunteer = await Volunteer.create({ user: req.user._id, skills: skills || [], availability, bio, location });
  await volunteer.populate('user', 'name email profilePicture');
  res.status(201).json(volunteer);
});

// @desc  Get all volunteers (admin)
// @route GET /api/volunteers
const getVolunteers = asyncHandler(async (req, res) => {
  const volunteers = await Volunteer.find()
    .populate('user', 'name email profilePicture')
    .populate('assignedRescues', 'animalType status location')
    .sort({ createdAt: -1 });
  res.json(volunteers);
});

// @desc  Get my volunteer profile
// @route GET /api/volunteers/me
const getMyVolunteerProfile = asyncHandler(async (req, res) => {
  const volunteer = await Volunteer.findOne({ user: req.user._id })
    .populate('user', 'name email profilePicture')
    .populate('assignedRescues')
    .populate('completedRescues');
  if (!volunteer) { res.status(404); throw new Error('Volunteer profile not found'); }
  res.json(volunteer);
});

// @desc  Assign volunteer to rescue (admin)
// @route PUT /api/volunteers/:id/assign/:rescueId
const assignVolunteer = asyncHandler(async (req, res) => {
  const volunteer = await Volunteer.findById(req.params.id);
  const rescue = await RescueReport.findById(req.params.rescueId);

  if (!volunteer || !rescue) { res.status(404); throw new Error('Volunteer or Rescue not found'); }

  volunteer.assignedRescues.push(rescue._id);
  rescue.volunteers.push(volunteer.user);
  volunteer.status = 'active';

  await volunteer.save();
  await rescue.save();

  await Notification.create({
    recipient: volunteer.user,
    type: 'volunteer_assigned',
    message: `You have been assigned to a rescue operation for a ${rescue.animalType}`,
    link: `/rescue/${rescue._id}`,
  });

  res.json({ message: 'Volunteer assigned successfully' });
});

// @desc  Mark rescue as completed
// @route PUT /api/volunteers/complete/:rescueId
const completeRescue = asyncHandler(async (req, res) => {
  const volunteer = await Volunteer.findOne({ user: req.user._id });
  if (!volunteer) { res.status(404); throw new Error('Volunteer profile not found'); }

  volunteer.completedRescues.push(req.params.rescueId);
  volunteer.assignedRescues = volunteer.assignedRescues.filter(
    (id) => id.toString() !== req.params.rescueId
  );
  volunteer.totalRescues += 1;
  await volunteer.save();

  res.json({ message: 'Rescue marked as completed', totalRescues: volunteer.totalRescues });
});

// @desc  Update volunteer status (admin)
// @route PUT /api/volunteers/:id/status
const updateVolunteerStatus = asyncHandler(async (req, res) => {
  const volunteer = await Volunteer.findByIdAndUpdate(
    req.params.id, { status: req.body.status }, { new: true }
  );
  if (!volunteer) { res.status(404); throw new Error('Volunteer not found'); }
  res.json(volunteer);
});

module.exports = { registerVolunteer, getVolunteers, getMyVolunteerProfile, assignVolunteer, completeRescue, updateVolunteerStatus };
