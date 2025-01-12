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
        try {
            const loginData = {
                email,
                password
            };
            console.log('Enviando dados de login:', loginData);
            
            const response = await api.post('/sign-in', loginData);
            console.log('Resposta do login:', response.data);
            return response.data;
        } catch (error) {
            console.error('Erro completo:', error.response?.data);
            if (error.response?.data?.message) {
                throw new Error(error.response.data.message);
            }
            throw error;
        }
    },
    
    signUp: async (name, email, password) => {
        try {
            const userData = {
                name,
                email,
                password,
                confirmPassword: password
            };
            console.log('Enviando dados de registro:', userData);
            
            const response = await api.post('/sign-up', userData);
            console.log('Resposta do registro:', response.data);
            return response.data;
        } catch (error) {
            console.error('Erro detalhado:', error.response?.data);
            if (error.response?.data?.message) {
                throw new Error(error.response.data.message);
            }
            if (error.response?.data?.details) {
                throw new Error(error.response.data.details[0]);
            }
            throw error;
        }
    },

    signOut: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userData');
    }
};

export const transactionService = {
    create: async (transactionData) => {
        try {
            const response = await api.post('/transactions', transactionData);
            return response.data;
        } catch (error) {
            if (error.response?.data?.message) {
                throw new Error(error.response.data.message);
            }
            throw error;
        }
    },

    getAll: async () => {
        try {
            const response = await api.get('/transactions');
            return response.data;
        } catch (error) {
            if (error.response?.data?.message) {
                throw new Error(error.response.data.message);
            }
            throw error;
        }
    },

    delete: async (id) => {
        try {
            const response = await api.delete(`/transactions/${id}`);
            return response.data;
        } catch (error) {
            if (error.response?.data?.message) {
                throw new Error(error.response.data.message);
            }
            throw error;
        }
    }
};

export default api;
