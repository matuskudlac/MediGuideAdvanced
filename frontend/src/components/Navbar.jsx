import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './Navbar.css';

function Navbar() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        navigate('/');
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-logo">
                    <span className="logo-icon">💊</span>
                    MediGuide
                </Link>

                <ul className="navbar-menu">
                    <li><Link to="/" className="navbar-link">Home</Link></li>
                    <li><Link to="/products" className="navbar-link">Products</Link></li>
                    <li><Link to="/cart" className="navbar-link">Cart</Link></li>

                    {user ? (
                        <>
                            <li>
                                <Link to="/profile" className="navbar-link navbar-user-link">
                                    👤 {user.full_name || user.first_name || user.email}
                                </Link>
                            </li>
                            <li><button onClick={handleLogout} className="navbar-link logout-btn">Logout</button></li>
                        </>
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
