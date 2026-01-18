import axios from 'axios';

const BASE_URL = 'https://tution-app-4esn.onrender.com/api';

const api = axios.create({
    baseURL: BASE_URL,
});
export default api;