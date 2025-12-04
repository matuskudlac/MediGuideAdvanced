import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
console.log('API_BASE_URL:', API_BASE_URL); // Debug log

// Normalize API_BASE_URL
if (API_BASE_URL.endsWith('/api')) {
    // Keep it as is, or ensure we don't double append if we were constructing manually
    // But here we use it as baseURL.
}

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add auth interceptor
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Token ${token}`;
    }
    return config;
});

// Products API
export const productsAPI = {
    getAll: (params) => api.get('/products/', { params }),
    getById: (id) => api.get(`/products/${id}/`),
    getCategories: () => api.get('/categories/'),
};

// Categories API
export const categoriesAPI = {
    getAll: (params) => api.get('/categories/', { params }),
};

// Orders API
export const ordersAPI = {
    create: (orderData) => api.post('/orders/', orderData),
    getById: (id) => api.get(`/orders/${id}/`),
    getUserOrders: () => api.get('/orders/'), // Fixed path from /orders/my-orders/
};

// Auth API (if implementing authentication)
export const authAPI = {
    login: (credentials) => api.post('/auth/login/', credentials),
    register: (userData) => api.post('/auth/register/', userData),
    logout: () => api.post('/auth/logout/'),
};

export default api;
