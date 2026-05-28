const asyncHandler = require('express-async-handler');
const Animal = require('../models/Animal');
const Notification = require('../models/Notification');

// @desc  Add animal for adoption
// @route POST /api/adoption
const addAnimal = asyncHandler(async (req, res) => {
  const { name, type, breed, age, gender, vaccinated, description, location } = req.body;
  const images = req.files ? req.files.map((f) => f.path) : [];

  const animal = await Animal.create({
    name, type, breed, age, gender,
    vaccinated: vaccinated === 'true',
    description, location, images, addedBy: req.user._id,
  });

  await animal.populate('addedBy', 'name profilePicture');
  res.status(201).json(animal);
});

// @desc  Get all animals
// @route GET /api/adoption
const getAnimals = asyncHandler(async (req, res) => {
  const { type, gender, vaccinated, status, search } = req.query;
  const query = {};
  if (type) query.type = type;
  if (gender) query.gender = gender;
  if (vaccinated !== undefined) query.vaccinated = vaccinated === 'true';
  if (status) query.status = status;
  if (search) query.name = { $regex: search, $options: 'i' };

  const animals = await Animal.find(query)
    .populate('addedBy', 'name profilePicture')
    .sort({ createdAt: -1 });
  res.json(animals);
});

// @desc  Get single animal
// @route GET /api/adoption/:id
const getAnimal = asyncHandler(async (req, res) => {
  const animal = await Animal.findById(req.params.id)
    .populate('addedBy', 'name profilePicture email phone')
    .populate('adoptionRequests.user', 'name email profilePicture');
  if (!animal) { res.status(404); throw new Error('Animal not found'); }
  res.json(animal);
});

// @desc  Apply for adoption
// @route POST /api/adoption/:id/apply
const applyForAdoption = asyncHandler(async (req, res) => {
  const animal = await Animal.findById(req.params.id);
  if (!animal) { res.status(404); throw new Error('Animal not found'); }
  if (animal.status !== 'available') { res.status(400); throw new Error('Animal is not available for adoption'); }

  const alreadyApplied = animal.adoptionRequests.find(
    (r) => r.user.toString() === req.user._id.toString()
  );
  if (alreadyApplied) { res.status(400); throw new Error('You already applied for this animal'); }

  animal.adoptionRequests.push({ user: req.user._id, message: req.body.message || '' });
  animal.status = 'pending';
  await animal.save();

  await Notification.create({
    recipient: animal.addedBy,
    type: 'adoption_update',
    message: `${req.user.name} has applied to adopt ${animal.name}`,
    link: `/adoption/${animal._id}`,
  });

  res.json({ message: 'Adoption application submitted successfully' });
});

// @desc  Approve/reject adoption request
// @route PUT /api/adoption/:id/request/:requestId
const handleAdoptionRequest = asyncHandler(async (req, res) => {
  const { status } = req.body; // 'approved' or 'rejected'
  const animal = await Animal.findById(req.params.id);
  if (!animal) { res.status(404); throw new Error('Animal not found'); }

  const request = animal.adoptionRequests.id(req.params.requestId);
  if (!request) { res.status(404); throw new Error('Request not found'); }

  request.status = status;
  if (status === 'approved') {
    animal.status = 'adopted';
    // Reject all other requests
    animal.adoptionRequests.forEach((r) => {
      if (r._id.toString() !== request._id.toString()) r.status = 'rejected';
    });
  }
  if (status === 'rejected' && animal.adoptionRequests.every((r) => r.status === 'rejected')) {
    animal.status = 'available';
  }

  await animal.save();

  await Notification.create({
    recipient: request.user,
    type: 'adoption_update',
    message: `Your adoption application for ${animal.name} has been ${status}!`,
    link: `/adoption/${animal._id}`,
  });

  res.json({ message: `Adoption request ${status}` });
});

// @desc  Delete animal listing
// @route DELETE /api/adoption/:id
const deleteAnimal = asyncHandler(async (req, res) => {
  const animal = await Animal.findById(req.params.id);
  if (!animal) { res.status(404); throw new Error('Animal not found'); }
  await animal.deleteOne();
  res.json({ message: 'Animal listing removed' });
});

module.exports = { addAnimal, getAnimals, getAnimal, applyForAdoption, handleAdoptionRequest, deleteAnimal };
