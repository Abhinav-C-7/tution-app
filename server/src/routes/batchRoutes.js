const express = require('express');
const router = express.Router();
const { getBatches, createBatch, getBatchDetails, updateBatch } = require('../controllers/batchController');

router.get('/', getBatches);
router.post('/', createBatch);
router.get('/:id', getBatchDetails);
router.put('/:id', updateBatch);

module.exports = router;