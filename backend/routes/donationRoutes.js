const express = require('express');
const router = express.Router();
const { createDonation, getAllDonations, getMyDonations } = require('../controllers/donationController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.post('/', protect, createDonation);
router.get('/', protect, adminOnly, getAllDonations);
router.get('/me', protect, getMyDonations);

module.exports = router;
