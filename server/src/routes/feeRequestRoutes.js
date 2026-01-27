const express = require('express');
const router = express.Router();
const { createFeeRequest } = require('../controllers/feeRequestController');

// POST /api/feerequests
router.post('/', createFeeRequest);

// GET /api/feerequests/batch/:batchId
const { getFeeRequestsByBatch } = require('../controllers/feeRequestController');
router.get('/batch/:batchId', getFeeRequestsByBatch);

module.exports = router;
