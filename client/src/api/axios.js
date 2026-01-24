import axios from 'axios';

// const BASE_URL = 'https://tution-app-4esn.onrender.com/api';
const BASE_URL = 'http://localhost:5000/api';
const api = axios.create({
    baseURL: BASE_URL,
});

export default api;