import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './Navbar.css';
import cartIcon from '../assets/cart-icon.png';
import { getCart } from '../utils/cartUtils';

function Navbar() {
    const [user, setUser] = useState(null);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [cartCount, setCartCount] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }

        // Update cart count on mount
        updateCartCount();

        // Listen for cart updates (custom event)
        window.addEventListener('cartUpdated', updateCartCount);

        return () => {
            window.removeEventListener('cartUpdated', updateCartCount);
        };
    }, []);

    const updateCartCount = () => {
        const cart = getCart();
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        setCartCount(totalItems);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setShowUserMenu(false);
        navigate('/');
    };

    const toggleUserMenu = () => {
        setShowUserMenu(!showUserMenu);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showUserMenu && !event.target.closest('.user-menu-container')) {
                setShowUserMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showUserMenu]);

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-logo">
                    <span className="logo-icon"></span>
                    MediGuide
                </Link>

                <ul className="navbar-menu">
                    <li className="cart-link-container">
                        <Link to="/cart" className="navbar-link cart-icon-link" title="Cart">
                            <img src={cartIcon} alt="Cart" className="cart-icon" />
                            {cartCount > 0 && (
                                <span className="cart-badge">{cartCount}</span>
                            )}
                        </Link>
                    </li>

                    {user ? (
                        <li className="user-menu-container">
                            <button
                                onClick={toggleUserMenu}
                                className="navbar-link user-menu-btn"
                            >
                                👤 {user.full_name || user.first_name || user.email}
                            </button>

                            {showUserMenu && (
                                <div className="user-dropdown">
                                    <Link to="/profile" className="dropdown-item" onClick={() => setShowUserMenu(false)}>
                                        👤 Profile
                                    </Link>
                                    <Link to="/orders" className="dropdown-item" onClick={() => setShowUserMenu(false)}>
                                        📦 Orders
                                    </Link>
                                    <button onClick={handleLogout} className="dropdown-item logout-item">
                                        🚪 Logout
                                    </button>
                                </div>
                            )}
                        </li>
                    ) : (
                        <>
                            <li><Link to="/login" className="navbar-link login-link">Login</Link></li>
                            <li><Link to="/register" className="navbar-link register-link">Sign Up</Link></li>
                        </>
                    )}
                </ul>
            </div>
        </nav>
    );
}

export default Navbar;
