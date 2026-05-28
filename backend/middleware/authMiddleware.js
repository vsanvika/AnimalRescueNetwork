const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

// Protect route — verify JWT
const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) {
        res.status(401);
        throw new Error('User not found');
      }
      if (req.user.isBlocked) {
        res.status(403);
        throw new Error('Your account has been blocked');
      }
      next();
    } catch (error) {
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  } else {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

// Admin only
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403);
    throw new Error('Access denied: Admins only');
  }
};

// Rescue team or Admin
const rescueOrAdmin = (req, res, next) => {
  if (req.user && (req.user.role === 'rescue_team' || req.user.role === 'admin')) {
    next();
  } else {
    res.status(403);
    throw new Error('Access denied: Rescue Team or Admin only');
  }
};

module.exports = { protect, adminOnly, rescueOrAdmin };
