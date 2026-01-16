// src/api/axios.js
import axios from 'axios';

// This creates a "standard" version of axios with your server address already saved
const api = axios.create({
    baseURL: 'http://localhost:5000/api',
});

export default api;