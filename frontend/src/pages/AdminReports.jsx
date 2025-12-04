import { useState, useEffect } from 'react';
import { reportsAPI } from '../api/reports';
import { categoriesAPI } from '../api/client';
import { downloadBlob } from '../utils/downloadUtils';
import Toast from '../components/Toast';
import './AdminReports.css';

function AdminReports() {
    // Low Stock Report State
    const [lowStockData, setLowStockData] = useState([]);
    const [lowStockLoading, setLowStockLoading] = useState(false);

    // Monthly Sales Report State
    const [salesData, setSalesData] = useState([]);
    const [salesLoading, setSalesLoading] = useState(false);
    const [salesMonth, setSalesMonth] = useState(new Date().getMonth() + 1);
    const [salesYear, setSalesYear] = useState(new Date().getFullYear());

    // Batch Price Update State
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [pricePercentage, setPricePercentage] = useState('');
    const [priceUpdateLoading, setPriceUpdateLoading] = useState(false);
    const [updateResult, setUpdateResult] = useState(null);

    // Toast State
    const [toast, setToast] = useState(null);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await categoriesAPI.getAll();
            setCategories(response.data.results || response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    // Low Stock Report Functions
    const handleRunLowStockReport = async () => {
        setLowStockLoading(true);
        try {
            const response = await reportsAPI.getLowStockReport('json');
            if (response.data.success) {
                setLowStockData(response.data.data);
                setToast({
                    message: `Found ${response.data.count} low stock products`,
                    type: 'success'
                });
            } else {
                setToast({
                    message: response.data.error || 'Failed to generate report',
                    type: 'error'
                });
            }
        } catch (error) {
            setToast({
                message: error.response?.data?.error || 'Failed to generate report',
                type: 'error'
            });
        } finally {
            setLowStockLoading(false);
        }
    };

    const handleDownloadLowStock = async (format) => {
        try {
            const response = await reportsAPI.getLowStockReport(format);
            const filename = `low_stock_report.${format}`;

            if (format === 'pdf') {
                downloadBlob(response.data, filename);
            } else {
                downloadBlob(new Blob([response.data], { type: 'text/csv' }), filename);
            }

            setToast({
                message: `Downloaded ${filename}`,
                type: 'success'
            });
        } catch (error) {
            setToast({
                message: 'Failed to download report',
                type: 'error'
            });
        }
    };

    // Monthly Sales Report Functions
    const handleRunMonthlySales = async () => {
        setSalesLoading(true);
        try {
            const response = await reportsAPI.getMonthlySales(salesMonth, salesYear, 'json');
            if (response.data.success) {
                setSalesData(response.data.data);
                setToast({
                    message: `Found ${response.data.count} products with sales`,
                    type: 'success'
                });
            } else {
                setToast({
                    message: response.data.error || 'Failed to generate report',
                    type: 'error'
                });
            }
        } catch (error) {
            setToast({
                message: error.response?.data?.error || 'Failed to generate report',
                type: 'error'
            });
        } finally {
            setSalesLoading(false);
        }
    };

    const handleDownloadMonthlySales = async (format) => {
        try {
            const response = await reportsAPI.getMonthlySales(salesMonth, salesYear, format);
            const filename = `monthly_sales_${salesMonth}_${salesYear}.${format}`;

            if (format === 'pdf') {
                downloadBlob(response.data, filename);
            } else {
                downloadBlob(new Blob([response.data], { type: 'text/csv' }), filename);
            }

            setToast({
                message: `Downloaded ${filename}`,
                type: 'success'
            });
        } catch (error) {
            setToast({
                message: 'Failed to download report',
                type: 'error'
            });
        }
    };

    // Batch Price Update Functions
    const handleBatchPriceUpdate = async () => {
        if (!selectedCategory || !pricePercentage) {
            setToast({
                message: 'Please select a category and enter a percentage',
                type: 'error'
            });
            return;
        }

        const confirmed = window.confirm(
            `Are you sure you want to update all prices in this category by ${pricePercentage}%?`
        );

        if (!confirmed) return;

        setPriceUpdateLoading(true);
        try {
            const response = await reportsAPI.batchPriceUpdate(
                parseInt(selectedCategory),
                parseFloat(pricePercentage)
            );

            if (response.data.success) {
                setUpdateResult(response.data);
                setToast({
                    message: `Successfully updated ${response.data.updated_count} products`,
                    type: 'success'
                });
                setPricePercentage('');
            } else {
                setToast({
                    message: response.data.error || 'Failed to update prices',
                    type: 'error'
                });
            }
        } catch (error) {
            setToast({
                message: error.response?.data?.error || 'Failed to update prices',
                type: 'error'
            });
        } finally {
            setPriceUpdateLoading(false);
        }
    };

    return (
        <div className="admin-reports-container">
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}

            <div className="reports-header">
                <h1>Admin Reports Dashboard</h1>
                <p>Execute stored procedures and generate reports</p>
            </div>

            {/* Low Stock Report Section */}
            <div className="report-section">
                <div className="report-section-header">
                    <h2>📊 Low Stock Report</h2>
                    <p>Products with stock below threshold</p>
                </div>

                <div className="report-actions">
                    <button
                        className="btn-primary"
                        onClick={handleRunLowStockReport}
                        disabled={lowStockLoading}
                    >
                        {lowStockLoading ? 'Loading...' : 'Run Report'}
                    </button>
                    <button
                        className="btn-secondary"
                        onClick={() => handleDownloadLowStock('csv')}
                        disabled={lowStockData.length === 0}
                    >
                        Download CSV
                    </button>
                    <button
                        className="btn-secondary"
                        onClick={() => handleDownloadLowStock('pdf')}
                        disabled={lowStockData.length === 0}
                    >
                        Download PDF
                    </button>
                </div>

                {lowStockData.length > 0 && (
                    <div className="report-table-container">
                        <table className="report-table">
                            <thead>
                                <tr>
                                    <th>Product ID</th>
                                    <th>Product Name</th>
                                    <th>Current Stock</th>
                                    <th>Threshold</th>
                                    <th>Category</th>
                                </tr>
                            </thead>
                            <tbody>
                                {lowStockData.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.product_id}</td>
                                        <td>{item.product_name}</td>
                                        <td className="stock-warning">{item.current_stock}</td>
                                        <td>{item.threshold}</td>
                                        <td>{item.category_name}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Monthly Sales Report Section */}
            <div className="report-section">
                <div className="report-section-header">
                    <h2>📈 Monthly Sales Report</h2>
                    <p>Sales statistics for a specific month</p>
                </div>

                <div className="report-inputs">
                    <div className="input-group">
                        <label>Month:</label>
                        <select
                            value={salesMonth}
                            onChange={(e) => setSalesMonth(parseInt(e.target.value))}
                        >
                            {[...Array(12)].map((_, i) => (
                                <option key={i + 1} value={i + 1}>
                                    {new Date(2000, i).toLocaleString('default', { month: 'long' })}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="input-group">
                        <label>Year:</label>
                        <input
                            type="number"
                            value={salesYear}
                            onChange={(e) => setSalesYear(parseInt(e.target.value))}
                            min="2020"
                            max="2030"
                        />
                    </div>
                </div>

                <div className="report-actions">
                    <button
                        className="btn-primary"
                        onClick={handleRunMonthlySales}
                        disabled={salesLoading}
                    >
                        {salesLoading ? 'Loading...' : 'Run Report'}
                    </button>
                    <button
                        className="btn-secondary"
                        onClick={() => handleDownloadMonthlySales('csv')}
                        disabled={salesData.length === 0}
                    >
                        Download CSV
                    </button>
                    <button
                        className="btn-secondary"
                        onClick={() => handleDownloadMonthlySales('pdf')}
                        disabled={salesData.length === 0}
                    >
                        Download PDF
                    </button>
                </div>

                {salesData.length > 0 && (
                    <div className="report-table-container">
                        <table className="report-table">
                            <thead>
                                <tr>
                                    <th>Product ID</th>
                                    <th>Product Name</th>
                                    <th>Quantity Sold</th>
                                    <th>Total Revenue</th>
                                </tr>
                            </thead>
                            <tbody>
                                {salesData.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.product_id}</td>
                                        <td>{item.product_name}</td>
                                        <td>{item.total_quantity}</td>
                                        <td className="revenue">${parseFloat(item.total_revenue).toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Batch Price Update Section */}
            <div className="report-section">
                <div className="report-section-header">
                    <h2>💰 Batch Price Update</h2>
                    <p>Update prices for all products in a category</p>
                </div>

                <div className="report-inputs">
                    <div className="input-group">
                        <label>Category:</label>
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                        >
                            <option value="">Select a category</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="input-group">
                        <label>Percentage Change:</label>
                        <input
                            type="number"
                            value={pricePercentage}
                            onChange={(e) => setPricePercentage(e.target.value)}
                            placeholder="e.g., 10 for +10%, -5 for -5%"
                            step="0.1"
                        />
                    </div>
                </div>

                <div className="report-actions">
                    <button
                        className="btn-danger"
                        onClick={handleBatchPriceUpdate}
                        disabled={priceUpdateLoading || !selectedCategory || !pricePercentage}
                    >
                        {priceUpdateLoading ? 'Updating...' : 'Update Prices'}
                    </button>
                </div>

                {updateResult && (
                    <div className="update-result">
                        <p className="success-message">
                            ✓ Successfully updated {updateResult.updated_count} products
                            by {updateResult.percentage_change}%
                        </p>
                    </div>
                )}

                <div className="warning-box">
                    <strong>⚠️ Warning:</strong> This action will update prices for all active
                    products in the selected category and create audit log entries.
                </div>
            </div>
        </div>
    );
}

export default AdminReports;
