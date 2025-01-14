import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
    baseURL: API_URL,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const authService = {
    signIn: async (email, password) => {
        const response = await api.post('/sign-in', { email, password });
        return response.data;
    },
    
    signUp: async (name, email, password) => {
        const response = await api.post('/auth/sign-up', { name, email, password });
        return response.data;
    },

    signOut: () => {
        localStorage.removeItem('token');
    }
};

export const transactionService = {
    create: async (transactionData) => {
        const response = await api.post('/transactions', transactionData);
        return response.data;
    },

    getAll: async () => {
        const response = await api.get('/transactions');
        return response.data;
    }
};

export default api;
