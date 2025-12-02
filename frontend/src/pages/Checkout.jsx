import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import './Checkout.css';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_your_key_here');

const CARD_ELEMENT_OPTIONS = {
    style: {
        base: {
            fontSize: '16px',
            color: '#1e293b',
            '::placeholder': {
                color: '#94a3b8',
            },
        },
        invalid: {
            color: '#ef4444',
        },
    },
};

function CheckoutForm() {
    const navigate = useNavigate();
    const stripe = useStripe();
    const elements = useElements();

    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [clientSecret, setClientSecret] = useState('');

    const [shippingInfo, setShippingInfo] = useState({
        name: '',
        address: '',
        city: '',
        state: '',
        zip: '',
        phone: '',
    });

    const [pricing, setPricing] = useState({
        subtotal: 0,
        tax: 0,
        shipping: 5.00,
        total: 0,
    });

    useEffect(() => {
        const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
        setCart(savedCart);

        if (savedCart.length === 0) {
            navigate('/cart');
            return;
        }

        createPaymentIntent(savedCart);
    }, []);

    const createPaymentIntent = async (cartItems) => {
        try {
            const response = await axios.post('http://localhost:8000/api/create-payment-intent/', {
                cart_items: cartItems.map(item => ({
                    product_id: item.id,
                    quantity: item.quantity,
                    price: item.price,
                })),
                shipping_cost: 5.00,
            });

            setClientSecret(response.data.client_secret);
            setPricing({
                subtotal: response.data.subtotal,
                tax: response.data.tax,
                shipping: response.data.shipping,
                total: response.data.total,
            });
        } catch (err) {
            setError('Failed to initialize payment. Please try again.');
            console.error(err);
        }
    };

    const handleInputChange = (e) => {
        setShippingInfo({
            ...shippingInfo,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        if (!shippingInfo.name || !shippingInfo.address || !shippingInfo.city ||
            !shippingInfo.state || !shippingInfo.zip || !shippingInfo.phone) {
            setError('Please fill in all shipping information');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement),
                    billing_details: {
                        name: shippingInfo.name,
                        address: {
                            line1: shippingInfo.address,
                            city: shippingInfo.city,
                            state: shippingInfo.state,
                            postal_code: shippingInfo.zip,
                        },
                        phone: shippingInfo.phone,
                    },
                },
            });

            if (stripeError) {
                setError(stripeError.message);
                setLoading(false);
                return;
            }

            if (paymentIntent.status === 'succeeded') {
                try {
                    const orderData = {
                        user: 1,
                        shipping_name: shippingInfo.name,
                        shipping_address: shippingInfo.address,
                        shipping_city: shippingInfo.city,
                        shipping_state: shippingInfo.state,
                        shipping_zip: shippingInfo.zip,
                        shipping_phone: shippingInfo.phone,
                        payment_intent_id: paymentIntent.id,
                        subtotal: pricing.subtotal.toFixed(2),
                        tax: pricing.tax.toFixed(2),
                        shipping_cost: pricing.shipping.toFixed(2),
                        total: pricing.total.toFixed(2),
                        items: cart.map(item => ({
                            product: item.id,
                            quantity: item.quantity,
                            price: typeof item.price === 'number' ? item.price.toFixed(2) : item.price,
                        })),
                    };

                    console.log('Sending order data:', orderData);
                    const response = await axios.post('http://localhost:8000/api/orders/', orderData);
                    console.log('Order created successfully:', response.data);

                    // Clear cart and trigger update
                    localStorage.removeItem('cart');
                    window.dispatchEvent(new Event('cartUpdated'));

                    // Redirect to success page
                    navigate('/order-success');
                } catch (orderError) {
                    console.error('Failed to save order:', orderError);
                    console.error('Error response:', orderError.response?.data);
                    setError('Order creation failed. Please contact support with your payment confirmation.');
                    setLoading(false);
                    return;
                }
            }
        } catch (err) {
            setError('Payment failed. Please try again.');
            setLoading(false);
        }
    };

    return (
        <div className="checkout-container">
            <h1>Checkout</h1>

            <div className="checkout-content">
                <div className="checkout-form-section">
                    <form onSubmit={handleSubmit}>
                        <div className="form-section">
                            <h2>Shipping Information</h2>

                            <div className="form-group">
                                <label>Full Name *</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={shippingInfo.name}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Address *</label>
                                <input
                                    type="text"
                                    name="address"
                                    value={shippingInfo.address}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>City *</label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={shippingInfo.city}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>State *</label>
                                    <select
                                        name="state"
                                        value={shippingInfo.state}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <option value="">Select State</option>
                                        <option value="AL">AL</option>
                                        <option value="AK">AK</option>
                                        <option value="AZ">AZ</option>
                                        <option value="AR">AR</option>
                                        <option value="CA">CA</option>
                                        <option value="CO">CO</option>
                                        <option value="CT">CT</option>
                                        <option value="DE">DE</option>
                                        <option value="FL">FL</option>
                                        <option value="GA">GA</option>
                                        <option value="HI">HI</option>
                                        <option value="ID">ID</option>
                                        <option value="IL">IL</option>
                                        <option value="IN">IN</option>
                                        <option value="IA">IA</option>
                                        <option value="KS">KS</option>
                                        <option value="KY">KY</option>
                                        <option value="LA">LA</option>
                                        <option value="ME">ME</option>
                                        <option value="MD">MD</option>
                                        <option value="MA">MA</option>
                                        <option value="MI">MI</option>
                                        <option value="MN">MN</option>
                                        <option value="MS">MS</option>
                                        <option value="MO">MO</option>
                                        <option value="MT">MT</option>
                                        <option value="NE">NE</option>
                                        <option value="NV">NV</option>
                                        <option value="NH">NH</option>
                                        <option value="NJ">NJ</option>
                                        <option value="NM">NM</option>
                                        <option value="NY">NY</option>
                                        <option value="NC">NC</option>
                                        <option value="ND">ND</option>
                                        <option value="OH">OH</option>
                                        <option value="OK">OK</option>
                                        <option value="OR">OR</option>
                                        <option value="PA">PA</option>
                                        <option value="RI">RI</option>
                                        <option value="SC">SC</option>
                                        <option value="SD">SD</option>
                                        <option value="TN">TN</option>
                                        <option value="TX">TX</option>
                                        <option value="UT">UT</option>
                                        <option value="VT">VT</option>
                                        <option value="VA">VA</option>
                                        <option value="WA">WA</option>
                                        <option value="WV">WV</option>
                                        <option value="WI">WI</option>
                                        <option value="WY">WY</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>ZIP Code *</label>
                                    <input
                                        type="text"
                                        name="zip"
                                        value={shippingInfo.zip}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Phone Number *</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={shippingInfo.phone}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="form-section">
                            <h2>Payment Information</h2>

                            <div className="form-group">
                                <label>Card Details *</label>
                                <div className="card-element-wrapper">
                                    <CardElement options={CARD_ELEMENT_OPTIONS} />
                                </div>
                                <p className="test-card-info">
                                    Test card: 4242 4242 4242 4242
                                </p>
                            </div>
                        </div>

                        {error && <div className="error-message">{error}</div>}

                        <button
                            type="submit"
                            className="place-order-btn"
                            disabled={!stripe || loading}
                        >
                            {loading ? 'Processing...' : `Place Order - $${pricing.total.toFixed(2)}`}
                        </button>
                    </form>
                </div>

                <div className="order-summary-section">
                    <h2>Order Summary</h2>

                    <div className="cart-items">
                        {cart.map((item) => (
                            <div key={item.id} className="cart-item">
                                <img src={item.image} alt={item.name} />
                                <div className="item-details">
                                    <h3>{item.name}</h3>
                                    <p>Qty: {item.quantity}</p>
                                </div>
                                <div className="item-price">
                                    ${(item.price * item.quantity).toFixed(2)}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="summary-totals">
                        <div className="summary-row">
                            <span>Subtotal:</span>
                            <span>${pricing.subtotal.toFixed(2)}</span>
                        </div>
                        <div className="summary-row">
                            <span>Tax (8%):</span>
                            <span>${pricing.tax.toFixed(2)}</span>
                        </div>
                        <div className="summary-row">
                            <span>Shipping:</span>
                            <span>${pricing.shipping.toFixed(2)}</span>
                        </div>
                        <div className="summary-row total">
                            <span>Total:</span>
                            <span>${pricing.total.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function Checkout() {
    return (
        <Elements stripe={stripePromise}>
            <CheckoutForm />
        </Elements>
    );
}
