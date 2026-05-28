const express = require('express');
const router = express.Router();
const { createReport, getReports, getReport, acceptReport, updateStatus, deleteReport } = require('../controllers/rescueController');
const { protect, rescueOrAdmin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.post('/', protect, upload.single('image'), createReport);
router.get('/', protect, getReports);
router.get('/:id', protect, getReport);
router.put('/:id/accept', protect, rescueOrAdmin, acceptReport);
router.put('/:id/status', protect, rescueOrAdmin, updateStatus);
router.delete('/:id', protect, deleteReport);

module.exports = router;
