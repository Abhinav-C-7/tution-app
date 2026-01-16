const batchRoutes = require('./routes/batchRoutes');
const studentRoutes = require('./routes/studentRoutes');
require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());



app.get('/', (req, res) => {
    res.send("API is running...");
});


app.use('/api/batches', batchRoutes);
app.use('/api/students', studentRoutes);
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});