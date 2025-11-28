import './Cart.css';

function Cart() {
    // TODO: Implement cart functionality with state management
    const cartItems = [];

    return (
        <div className="cart-container">
            <h1>Shopping Cart</h1>

            {cartItems.length === 0 ? (
                <div className="empty-cart">
                    <div className="empty-cart-icon">🛒</div>
                    <h2>Your cart is empty</h2>
                    <p>Add some products to get started!</p>
                    <a href="/products" className="btn btn-primary">
                        Browse Products
                    </a>
                </div>
            ) : (
                <div className="cart-content">
                    {/* Cart items will be displayed here */}
                    <div className="cart-items">
                        {/* TODO: Map through cart items */}
                    </div>
                    <div className="cart-summary">
                        <h3>Order Summary</h3>
                        {/* TODO: Display totals */}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Cart;
