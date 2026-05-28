const express = require('express');
const router = express.Router();
const { getAnalytics, getAllUsers, toggleBlockUser, verifyRescueTeam, deleteUser, deleteRescueReport } = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.use(protect, adminOnly);

router.get('/analytics', getAnalytics);
router.get('/users', getAllUsers);
router.put('/users/:id/block', toggleBlockUser);
router.put('/users/:id/verify', verifyRescueTeam);
router.delete('/users/:id', deleteUser);
router.delete('/rescue/:id', deleteRescueReport);

module.exports = router;
