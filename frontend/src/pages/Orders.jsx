import { useState, useEffect } from 'react';
import { ordersAPI } from '../api/client';
import './Orders.css';

function Orders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await ordersAPI.getUserOrders();
            console.log('Orders API response:', response.data);

            // Handle both array response and paginated response
            const ordersData = Array.isArray(response.data)
                ? response.data
                : response.data.results || [];

            setOrders(ordersData);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching orders:', err);
            // ... keep existing error handling
            setError('Failed to load orders');
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending':
                return 'status-pending';
            case 'processing':
                return 'status-processing';
            case 'shipped':
                return 'status-shipped';
            case 'delivered':
                return 'status-delivered';
            case 'cancelled':
                return 'status-cancelled';
            default:
                return '';
        }
    };

    const [expandedOrder, setExpandedOrder] = useState(null);

    const toggleOrder = (orderId) => {
        setExpandedOrder(expandedOrder === orderId ? null : orderId);
    };

    if (loading) {
        return (
            <div className="orders-container">
                <div className="loading">Loading your orders...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="orders-container">
                <div className="error-message">{error}</div>
            </div>
        );
    }

    return (
        <div className="orders-container">
            <div className="orders-page-header">
                <h1>My Orders</h1>
                <a href="/products" className="btn-continue-shopping">
                    ← Continue Shopping
                </a>
            </div>

            {orders.length === 0 ? (
                <div className="no-orders">
                    <p>You haven't placed any orders yet.</p>
                    <a href="/products" className="btn-shop">Start Shopping</a>
                </div>
            ) : (
                <div className="orders-list">
                    {orders.map((order) => (
                        <div key={order.id} className="order-card">
                            <div className="order-header" onClick={() => toggleOrder(order.id)}>
                                <div className="order-summary-row">
                                    <div className="order-info">
                                        <span className="order-number">Order #{order.id}</span>
                                        <span className="order-date">{formatDate(order.created_at)}</span>
                                    </div>
                                    <div className="order-meta">
                                        <span className={`status-badge ${getStatusColor(order.status)}`}>
                                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                        </span>
                                        <span className="order-total">${parseFloat(order.total).toFixed(2)}</span>
                                        <button className="expand-btn">
                                            <span className={expandedOrder === order.id ? 'arrow-up' : 'arrow-down'}>
                                                ▼
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {expandedOrder === order.id && (
                                <div className="order-details">
                                    <div className="details-grid">
                                        <div className="shipping-info">
                                            <h4>Shipping Address</h4>
                                            <p>{order.shipping_name}</p>
                                            <p>{order.shipping_address}</p>
                                            <p>{order.shipping_city}, {order.shipping_state} {order.shipping_zip}</p>
                                            <p>Phone: {order.shipping_phone}</p>
                                        </div>

                                        <div className="order-items">
                                            <h4>Items ({order.items?.length || 0})</h4>
                                            {order.items?.map((item, index) => (
                                                <div key={index} className="order-item">
                                                    <div className="item-info">
                                                        <span className="item-name">{item.product_name}</span>
                                                        <span className="item-quantity">Qty: {item.quantity}</span>
                                                    </div>
                                                    <span className="item-price">${parseFloat(item.price).toFixed(2)}</span>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="order-pricing">
                                            <h4>Order Summary</h4>
                                            <div className="summary-row">
                                                <span>Subtotal:</span>
                                                <span>${parseFloat(order.subtotal).toFixed(2)}</span>
                                            </div>
                                            <div className="summary-row">
                                                <span>Tax:</span>
                                                <span>${parseFloat(order.tax).toFixed(2)}</span>
                                            </div>
                                            <div className="summary-row">
                                                <span>Shipping:</span>
                                                <span>${parseFloat(order.shipping_cost).toFixed(2)}</span>
                                            </div>
                                            <div className="summary-row total">
                                                <span>Total:</span>
                                                <span>${parseFloat(order.total).toFixed(2)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {order.payment_intent_id && (
                                        <div className="payment-info">
                                            <small>Payment ID: {order.payment_intent_id}</small>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Orders;
