import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './OrderSuccess.css';

export default function OrderSuccess() {
    const navigate = useNavigate();

    return (
        <div className="order-success-container">
            <div className="success-content">
                <div className="success-icon">✓</div>
                <h1>Order Placed Successfully!</h1>
                <p>Thank you for your purchase. Your order has been confirmed.</p>
                <p className="order-info">You will receive an email confirmation shortly.</p>

                <div className="success-actions">
                    <button
                        className="btn-continue-shopping"
                        onClick={() => navigate('/products')}
                    >
                        Continue Shopping
                    </button>
                </div>
            </div>
        </div>
    );
}
