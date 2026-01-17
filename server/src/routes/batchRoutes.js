const express = require('express');
const router = express.Router();
const { getBatches, createBatch, getBatchDetails } = require('../controllers/batchController');

router.get('/', getBatches);
router.post('/', createBatch);
router.get('/:id', getBatchDetails);
module.exports = router;