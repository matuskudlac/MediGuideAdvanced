import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
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
                </ul>
            </div>
        </nav>
    );
}

export default Navbar;
