// src/api/apiClient.js
import axios from 'axios';

// 1. Crea la instancia de Axios
const apiClient = axios.create({
    baseURL: 'http://localhost:8000', // La URL de tu backend
});

// 2. Configura el interceptor para añadir el token a todas las peticiones
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            // Si hay un token, lo añade a la cabecera de autorización
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        // Maneja errores en la configuración de la petición
        return Promise.reject(error);
    }
);

// 3. ¡LA LÍNEA MÁS IMPORTANTE! Exporta la instancia configurada por defecto.
export default apiClient;