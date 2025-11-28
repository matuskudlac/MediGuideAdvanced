import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productsAPI } from '../api/client';
import './Products.css';

function Products() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await productsAPI.getAll();
            setProducts(response.data.results || response.data);
            setError(null);
        } catch (err) {
            setError('Failed to load products. Please try again later.');
            console.error('Error fetching products:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="products-container">
                <div className="products-header">
                    <h1>Our Products</h1>
                    <p>Browse our wide selection of quality medications</p>
                </div>
                <div className="products-grid">
                    {[...Array(8)].map((_, index) => (
                        <div key={index} className="product-card skeleton">
                            <div className="product-image skeleton-image"></div>
                            <div className="product-info">
                                <div className="skeleton-text skeleton-title"></div>
                                <div className="skeleton-text skeleton-dosage"></div>
                                <div className="skeleton-text skeleton-price"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="products-container">
                <div className="error">{error}</div>
            </div>
        );
    }

    return (
        <div className="products-container">
            <div className="products-header">
                <h1>Our Products</h1>
                <p>Browse our wide selection of quality medications</p>
            </div>

            <div className="products-grid">
                {products.length === 0 ? (
                    <div className="no-products">
                        <p>No products available at the moment.</p>
                        <p className="hint">Please check back later or contact support.</p>
                    </div>
                ) : (
                    products.map((product) => (
                        <Link
                            to={`/products/${product.id}`}
                            key={product.id}
                            className="product-card"
                        >
                            <div className="product-image">
                                {product.image ? (
                                    <img src={product.image} alt={product.name} />
                                ) : (
                                    <div className="placeholder-image">💊</div>
                                )}
                            </div>
                            <div className="product-info">
                                <h3 className="product-name">{product.name}</h3>
                                {product.dosage && (
                                    <p className="product-dosage">{product.dosage}</p>
                                )}
                                <p className="product-price">${product.price}</p>
                                {product.requires_prescription && (
                                    <span className="prescription-badge">Prescription Required</span>
                                )}
                                {!product.is_in_stock && (
                                    <span className="out-of-stock-badge">Out of Stock</span>
                                )}
                            </div>
                        </Link>
                    ))
                )}
            </div>
        </div>
    );
}

export default Products;
