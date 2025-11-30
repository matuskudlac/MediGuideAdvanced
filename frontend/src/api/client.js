import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Products API
export const productsAPI = {
    getAll: (params) => api.get('/products/', { params }),
    getById: (id) => api.get(`/products/${id}/`),
    getCategories: () => api.get('/categories/'),
};

// Categories API
export const categoriesAPI = {
    getAll: () => api.get('/categories/'),
};

// Orders API
export const ordersAPI = {
    create: (orderData) => api.post('/orders/', orderData),
    getById: (id) => api.get(`/orders/${id}/`),
    getUserOrders: () => api.get('/orders/my-orders/'),
};

// Auth API (if implementing authentication)
export const authAPI = {
    login: (credentials) => api.post('/auth/login/', credentials),
    register: (userData) => api.post('/auth/register/', userData),
    logout: () => api.post('/auth/logout/'),
};

export default api;
