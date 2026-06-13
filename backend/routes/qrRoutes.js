const express = require('express');
const router = express.Router();
const { scanQr } = require('../controllers/qrController');

router.get('/scan/:token', scanQr);

module.exports = router;
