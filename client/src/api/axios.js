import axios from 'axios';

// Vite automatically sets this to TRUE when you run 'npm run dev'
// and FALSE when you run 'npm run build'
const isDev = import.meta.env.DEV;

const BASE_URL = isDev
    ? 'http://localhost:5000/api'       // Use Localhost when coding
    : 'https://coursecore.online/api';  // Use Live Server when deployed

const api = axios.create({
    baseURL: BASE_URL,
    // (Optional) Add this line if you use Cookies/Sessions
    withCredentials: true,
});

export default api;