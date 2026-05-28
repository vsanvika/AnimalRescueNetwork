const express = require('express');
const router = express.Router();
const { registerVolunteer, getVolunteers, getMyVolunteerProfile, assignVolunteer, completeRescue, updateVolunteerStatus } = require('../controllers/volunteerController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.post('/register', protect, registerVolunteer);
router.get('/', protect, adminOnly, getVolunteers);
router.get('/me', protect, getMyVolunteerProfile);
router.put('/:id/assign/:rescueId', protect, adminOnly, assignVolunteer);
router.put('/complete/:rescueId', protect, completeRescue);
router.put('/:id/status', protect, adminOnly, updateVolunteerStatus);

module.exports = router;
