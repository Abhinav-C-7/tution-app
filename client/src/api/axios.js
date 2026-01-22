import axios from 'axios';

// ❌ Comment out the Live URL when testing locally
const BASE_URL = 'https://tution-app-4esn.onrender.com/api';

// ✅ Uncomment this for Local Development
// const BASE_URL = 'http://localhost:5000/api'; // Make sure this matches your Backend PORT!

const api = axios.create({
    baseURL: BASE_URL,
});

export default api;