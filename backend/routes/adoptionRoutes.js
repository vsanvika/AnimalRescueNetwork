const express = require('express');
const router = express.Router();
const { addAnimal, getAnimals, getAnimal, applyForAdoption, handleAdoptionRequest, deleteAnimal, regenerateQr, generateQrForNewAnimal } = require('../controllers/adoptionController');
const { protect, rescueOrAdmin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.post('/', protect, rescueOrAdmin, upload.array('images', 5), addAnimal);
router.post('/generate-qr', protect, upload.single('image'), generateQrForNewAnimal);
router.get('/', getAnimals);
router.get('/:id', getAnimal);
router.post('/:id/apply', protect, applyForAdoption);
router.put('/:id/request/:requestId', protect, rescueOrAdmin, handleAdoptionRequest);
router.delete('/:id', protect, rescueOrAdmin, deleteAnimal);
router.post('/:id/regenerate-qr', protect, regenerateQr);

module.exports = router;
