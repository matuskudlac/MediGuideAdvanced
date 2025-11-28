import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCart, removeFromCart, updateCartQuantity, getCartTotal } from '../utils/cartUtils';
import Toast from '../components/Toast';
import './Cart.css';

function Cart() {
    const [cartItems, setCartItems] = useState([]);
    const [toast, setToast] = useState(null);

    useEffect(() => {
        loadCart();
    }, []);

    const loadCart = () => {
        setCartItems(getCart());
    };

    const handleRemove = (productId, productName) => {
        removeFromCart(productId);
        loadCart();
        setToast({
            message: `Removed ${productName} from cart`,
            type: 'info'
        });
    };

    const handleQuantityChange = (productId, newQuantity) => {
        updateCartQuantity(productId, parseInt(newQuantity));
        loadCart();
    };

    const total = getCartTotal();

    if (cartItems.length === 0) {
        return (
            <div className="cart-container">
                <h1>Shopping Cart</h1>
                <div className="empty-cart">
                    <div className="empty-cart-icon">🛒</div>
                    <h2>Your cart is empty</h2>
                    <p>Add some products to get started!</p>
                    <Link to="/products" className="btn-shop">
                        Browse Products
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="cart-container">
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}

            <h1>Shopping Cart</h1>

            <div className="cart-content">
                <div className="cart-items">
                    {cartItems.map((item) => (
                        <div key={item.id} className="cart-item">
                            <div className="cart-item-image">
                                {item.image ? (
                                    <img src={item.image} alt={item.name} />
                                ) : (
                                    <div className="placeholder-image">💊</div>
                                )}
                            </div>

                            <div className="cart-item-details">
                                <h3>{item.name}</h3>
                                {item.dosage && <p className="item-dosage">{item.dosage}</p>}
                                <p className="item-price">${item.price}</p>
                            </div>

                            <div className="cart-item-quantity">
                                <label>Qty:</label>
                                <input
                                    type="number"
                                    min="1"
                                    value={item.quantity}
                                    onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                                />
                            </div>

                            <div className="cart-item-total">
                                ${(item.price * item.quantity).toFixed(2)}
                            </div>

                            <button
                                className="cart-item-remove"
                                onClick={() => handleRemove(item.id, item.name)}
                            >
                                ×
                            </button>
                        </div>
                    ))}
                </div>

                <div className="cart-summary">
                    <h2>Order Summary</h2>
                    <div className="summary-row">
                        <span>Subtotal:</span>
                        <span>${total.toFixed(2)}</span>
                    </div>
                    <div className="summary-row">
                        <span>Shipping:</span>
                        <span>FREE</span>
                    </div>
                    <div className="summary-row total">
                        <span>Total:</span>
                        <span>${total.toFixed(2)}</span>
                    </div>
                    <button className="btn-checkout">
                        Proceed to Checkout
                    </button>
                    <Link to="/products" className="btn-continue">
                        Continue Shopping
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Cart;
