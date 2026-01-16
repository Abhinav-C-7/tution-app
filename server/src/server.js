const batchRoutes = require('./routes/batchRoutes');
const studentRoutes = require('./routes/studentRoutes');
require('dotenv').config(); // Load environment variables
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());             // Allow React to talk to us
app.use(express.json());     // Allow us to read JSON from body (req.body)



// A Simple Test Route
app.get('/', (req, res) => {
    res.send("API is running...");
});


app.use('/api/batches', batchRoutes);
app.use('/api/students', studentRoutes);
// Start the Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});