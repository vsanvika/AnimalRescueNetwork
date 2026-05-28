const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Generate JWT
const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

// @desc  Register user
// @route POST /api/auth/register
const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    res.status(400); throw new Error('Please fill all fields');
  }

  const exists = await User.findOne({ email });
  if (exists) { res.status(400); throw new Error('Email already registered'); }

  const allowedRoles = ['user', 'rescue_team'];
  const assignedRole = allowedRoles.includes(role) ? role : 'user';

  const user = await User.create({ name, email, password, role: assignedRole });

  res.status(201).json({
    _id: user._id, name: user.name, email: user.email, role: user.role,
    profilePicture: user.profilePicture, token: generateToken(user._id),
  });
});

// @desc  Login user
// @route POST /api/auth/login
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !(await user.matchPassword(password))) {
    res.status(401); throw new Error('Invalid email or password');
  }
  if (user.isBlocked) { res.status(403); throw new Error('Your account has been blocked'); }

  res.json({
    _id: user._id, name: user.name, email: user.email, role: user.role,
    profilePicture: user.profilePicture, bio: user.bio, token: generateToken(user._id),
  });
});

// @desc  Get profile
// @route GET /api/auth/profile
const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  res.json(user);
});

// @desc  Update profile
// @route PUT /api/auth/profile
const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  user.name = req.body.name || user.name;
  user.bio = req.body.bio || user.bio;
  user.phone = req.body.phone || user.phone;
  if (req.file) user.profilePicture = req.file.path;
  if (req.body.password) user.password = req.body.password;

  const updated = await user.save();
  res.json({ _id: updated._id, name: updated.name, email: updated.email, role: updated.role, profilePicture: updated.profilePicture, bio: updated.bio, token: generateToken(updated._id) });
});

// @desc  Get all users (for chat user list)
// @route GET /api/auth/users
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({ _id: { $ne: req.user._id } }).select('-password');
  res.json(users);
});

module.exports = { register, login, getProfile, updateProfile, getAllUsers };
