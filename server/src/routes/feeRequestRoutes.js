const express = require('express');
const router = express.Router();
const { createFeeRequest } = require('../controllers/feeRequestController');

// POST /api/feerequests
router.post('/', createFeeRequest);

module.exports = router;
