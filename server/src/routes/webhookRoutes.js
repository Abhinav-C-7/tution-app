const express = require('express');
const router = express.Router();
const { handleWebhook } = require('../controllers/webhookController');
const bodyParser = require('body-parser');

// Webhook needs raw body for signature verification
router.post('/clerk', bodyParser.raw({ type: 'application/json' }), handleWebhook);

module.exports = router;
