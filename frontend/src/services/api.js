import axios from 'axios';

// A URL do backend agora virá de uma variável de ambiente
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'https://e-commerce-rastreio.onrender.com',
});

// Adiciona o token em todas as requisições autenticadas
api.interceptors.request.use(async config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
