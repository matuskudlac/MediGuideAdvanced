import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { productsAPI } from '../api/client';
import { addToCart } from '../utils/cartUtils';
import Toast from '../components/Toast';
import './ProductDetail.css';

function ProductDetail() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [toast, setToast] = useState(null);

    useEffect(() => {
        fetchProduct();
    }, [id]);

    const fetchProduct = async () => {
        try {
            setLoading(true);
            const response = await productsAPI.getById(id);
            console.log('Product data:', response.data); // Debug: Check what fields are returned
            setProduct(response.data);
            setError(null);
        } catch (err) {
            setError('Product not found');
            console.error('Error fetching product:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = () => {
        addToCart(product, quantity);
        setToast({
            message: `Added ${quantity} ${product.name} to cart!`,
            type: 'success'
        });
        setQuantity(1);
    };

    if (loading) return (
        <div className="product-detail-container">
            <div className="skeleton-back-link"></div>
            <div className="product-detail">
                <div className="skeleton-image"></div>
                <div className="product-detail-info">
                    <div className="skeleton-title"></div>
                    <div className="skeleton-text skeleton-short"></div>
                    <div className="skeleton-text skeleton-short"></div>
                    <div className="skeleton-price"></div>
                    <div className="skeleton-description"></div>
                    <div className="skeleton-grid">
                        <div className="skeleton-box"></div>
                        <div className="skeleton-box"></div>
                    </div>
                    <div className="skeleton-usage"></div>
                </div>
            </div>
        </div>
    );

    if (error) return <div className="error">{error}</div>;
    if (!product) return <div className="error">Product not found</div>;

    return (
        <div className="product-detail-container">
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}

            <Link to="/products" className="back-link">← Back to Products</Link>

            <div className="product-detail">
                <div className="product-detail-image">
                    {product.image ? (
                        <img src={product.image} alt={product.name} />
                    ) : (
                        <div className="placeholder-image">💊</div>
                    )}
                </div>

                <div className="product-detail-info">
                    <h1>{product.name}</h1>
                    {product.dosage && <p className="dosage">{product.dosage}</p>}
                    {product.manufacturer && (
                        <p className="manufacturer">By {product.manufacturer}</p>
                    )}

                    <div className="price-section">
                        <span className="price">${product.price}</span>
                        {product.is_in_stock ? (
                            <span className="in-stock">In Stock ({product.stock_quantity} available)</span>
                        ) : (
                            <span className="out-of-stock">Out of Stock</span>
                        )}
                    </div>

                    {product.requires_prescription && (
                        <div className="prescription-notice">
                            ⚠️ Prescription Required
                        </div>
                    )}

                    <div className="description">
                        <h3>Description</h3>
                        <p>{product.description}</p>
                    </div>

                    <div className="product-details-grid">
                        {product.dosage && (
                            <div className="dosage-info">
                                <h3>Size/Dosage</h3>
                                <p>{product.dosage}</p>
                            </div>
                        )}

                        {product.ingredients && (
                            <div className="active-ingredients">
                                <h3>Active Ingredients</h3>
                                <p>{product.ingredients}</p>
                            </div>
                        )}
                    </div>

                    {product.recommended_usage && (
                        <div className="recommended-usage">
                            <h3>How to Use</h3>
                            <p>{product.recommended_usage}</p>
                        </div>
                    )}

                    {product.is_in_stock && (
                        <div className="purchase-section">
                            <div className="quantity-selector">
                                <label>Quantity:</label>
                                <input
                                    type="number"
                                    min="1"
                                    max={product.stock_quantity}
                                    value={quantity}
                                    onChange={(e) => setQuantity(parseInt(e.target.value))}
                                />
                            </div>
                            <button className="add-to-cart-btn" onClick={handleAddToCart}>
                                Add to Cart
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ProductDetail;
