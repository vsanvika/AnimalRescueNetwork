const express = require('express');
const router = express.Router();
const { createReport, getReports, getReport, resolveReport, deleteReport } = require('../controllers/lostFoundController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.post('/', protect, upload.array('images', 5), createReport);
router.get('/', getReports);
router.get('/:id', getReport);
router.put('/:id/resolve', protect, resolveReport);
router.delete('/:id', protect, deleteReport);

module.exports = router;
