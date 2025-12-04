/**
 * Reports API Client
 * 
 * API functions for executing stored procedures and downloading reports
 */

import axios from 'axios';

let API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Normalize API_URL to ensure it doesn't end with /api or /
if (API_URL.endsWith('/api')) {
    API_URL = API_URL.slice(0, -4);
}
if (API_URL.endsWith('/')) {
    API_URL = API_URL.slice(0, -1);
}

// Helper to get auth headers
const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Token ${token}` } : {};
};

export const reportsAPI = {
    /**
     * Get low stock report
     * @param {string} format - 'json', 'csv', or 'pdf'
     */
    getLowStockReport: async (format = 'json') => {
        const response = await axios.get(`${API_URL}/api/reports/low-stock/`, {
            params: { report_format: format },
            headers: getAuthHeaders(),
            responseType: format === 'pdf' ? 'blob' : 'json'
        });
        return response;
    },

    /**
     * Get monthly sales report
     * @param {number} month - Month (1-12)
     * @param {number} year - Year
     * @param {string} format - 'json', 'csv', or 'pdf'
     */
    getMonthlySales: async (month, year, format = 'json') => {
        const response = await axios.get(`${API_URL}/api/reports/monthly-sales/`, {
            params: { month, year, report_format: format },
            headers: getAuthHeaders(),
            responseType: format === 'pdf' ? 'blob' : 'json'
        });
        return response;
    },

    /**
     * Execute batch price update
     * @param {number} categoryId - Category ID
     * @param {number} percentage - Percentage change
     */
    batchPriceUpdate: async (categoryId, percentage) => {
        const response = await axios.post(`${API_URL}/api/reports/batch-price-update/`, {
            category_id: categoryId,
            percentage: percentage
        }, {
            headers: getAuthHeaders()
        });
        return response;
    }
};
