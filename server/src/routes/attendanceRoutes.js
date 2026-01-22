const express = require('express');
const router = express.Router();
const { getBatchAttendance, markBatchAttendance } = require('../controllers/attendanceController');

router.get('/batch/:batchId', getBatchAttendance);
router.post('/', markBatchAttendance);

module.exports = router;
