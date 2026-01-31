require('dotenv').config();

const express = require('express');
const cors = require('cors');

const batchRoutes = require('./routes/batchRoutes');
const studentRoutes = require('./routes/studentRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const feeRequestRoutes = require('./routes/feeRequestRoutes');

const webhookRoutes = require('./routes/webhookRoutes');
const requireAuth = require('./middleware/authMiddleware');
const { handleWebhook } = require('./controllers/webhookController');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());

/**
 * CRITICAL: Webhook route must use express.raw()
 * and MUST come BEFORE express.json()
 */
app.post(
    '/api/webhooks/clerk',
    express.raw({ type: 'application/json' }),
    handleWebhook
);

// Global middleware for all other JSON routes
app.use(express.json());

app.get('/', (req, res) => {
    res.send('API is running...');
});

// Any future webhook routes (non-Clerk)
app.use('/api/webhooks', webhookRoutes);

// Protected routes
app.use('/api/dashboard', requireAuth, dashboardRoutes);
app.use('/api/batches', requireAuth, batchRoutes);
app.use('/api/feerequests', requireAuth, feeRequestRoutes);
app.use('/api/students', requireAuth, studentRoutes);
app.use('/api/attendance', requireAuth, attendanceRoutes);
app.use('/api/payments', requireAuth, paymentRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
