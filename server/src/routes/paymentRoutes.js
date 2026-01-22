const express = require('express');
const router = express.Router();
const { addPayment, getBatchPayments, getStudentPayments } = require('../controllers/paymentController');

router.post('/', addPayment);
router.get('/batch/:batchId', getBatchPayments);
router.get('/student/:studentId', getStudentPayments);

module.exports = router;
