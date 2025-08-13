// src/api.js
import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:8000', // URL de tu backend FastAPI
});

apiClient.interceptors.request.use(config => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default apiClient;