const express = require('express');
const router = express.Router();
const { getBatches, createBatch } = require('../controllers/batchController');

router.get('/', getBatches);
router.post('/', createBatch);

module.exports = router;