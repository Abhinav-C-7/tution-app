require('dotenv').config();
const batchRoutes = require('./routes/batchRoutes');
const studentRoutes = require('./routes/studentRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const feeRequestRoutes = require('./routes/feeRequestRoutes');
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

const webhookRoutes = require('./routes/webhookRoutes');
const requireAuth = require('./middleware/authMiddleware');

// Middleware
app.use(cors());

// Webhook route must be before express.json()
app.use('/api/webhooks', webhookRoutes);

app.use(express.json());



app.get('/', (req, res) => {
    res.send("API is running...");
});

app.use('/api/dashboard', requireAuth, dashboardRoutes);
app.use('/api/batches', requireAuth, batchRoutes);
app.use('/api/feerequests', requireAuth, feeRequestRoutes); // Corrected Route
app.use('/api/students', requireAuth, studentRoutes);
app.use('/api/attendance', requireAuth, attendanceRoutes);

app.use('/api/payments', requireAuth, paymentRoutes);
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});