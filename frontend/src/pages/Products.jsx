import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productsAPI, categoriesAPI } from '../api/client';
import { addToCart } from '../utils/cartUtils';
import Toast from '../components/Toast';
import './Products.css';
import addToCartIcon from '../assets/add-to-cart.png';

function Products() {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [sortBy, setSortBy] = useState('none');
    const [showFilters, setShowFilters] = useState(false);
    const [toast, setToast] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        filterAndSortProducts();
    }, [searchQuery, selectedCategory, sortBy, products]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [productsRes, categoriesRes] = await Promise.all([
                productsAPI.getAll(),
                categoriesAPI.getAll()
            ]);

            setProducts(productsRes.data.results || productsRes.data);
            setCategories(categoriesRes.data.results || categoriesRes.data);
            setError(null);
        } catch (err) {
            setError('Failed to load products. Please try again later.');
            console.error('Error fetching data:', err);
        } finally {
            setLoading(false);
        }
    };

    const filterAndSortProducts = () => {
        let filtered = [...products];

        // Filter by search query
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(product =>
                product.name.toLowerCase().includes(query) ||
                product.description?.toLowerCase().includes(query) ||
                product.manufacturer?.toLowerCase().includes(query)
            );
        }

        // Filter by category
        if (selectedCategory !== 'all') {
            filtered = filtered.filter(product =>
                product.category === parseInt(selectedCategory)
            );
        }

        // Sort by price
        if (sortBy === 'price-asc') {
            filtered.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        } else if (sortBy === 'price-desc') {
            filtered.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
        }

        setFilteredProducts(filtered);
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleCategoryChange = (categoryId) => {
        setSelectedCategory(categoryId);
        setShowFilters(false);
    };

    const handleSortChange = (e) => {
        setSortBy(e.target.value);
    };

    const clearFilters = () => {
        setSearchQuery('');
        setSelectedCategory('all');
        setSortBy('none');
    };

    const toggleFilters = () => {
        setShowFilters(!showFilters);
    };

    const clearSearch = () => {
        setSearchQuery('');
    };

    const handleAddToCart = (e, product) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            addToCart(product, 1);
            setToast({ message: `${product.name} added to cart!`, type: 'success' });
        } catch (error) {
            setToast({ message: error.message, type: 'error' });
        }
    };

    if (loading) {
        return (
            <div className="products-container">
                <div className="products-header">
                    <h1>Our Products</h1>
                    <p>Browse our wide selection of quality medications</p>
                </div>

                {/* Skeleton Filters Toolbar */}
                <div className="filters-toolbar">
                    <div className="filters-left">
                        <div className="skeleton-filter-btn"></div>
                        <div className="skeleton-sort-select"></div>
                    </div>
                    <div className="skeleton-search-bar"></div>
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
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}

            <div className="products-header">
                <h1>Our Products</h1>
                <p>Browse our wide selection of quality medications</p>
            </div>

            {/* Filters and Search Bar */}
            <div className="filters-toolbar">
                <div className="filters-left">
                    <button className="filter-toggle-btn" onClick={toggleFilters}>
                        Filters
                    </button>

                    {showFilters && (
                        <div className="filter-dropdown">
                            <div className="filter-section">
                                <h4>Category</h4>
                                <button
                                    className={`filter-option ${selectedCategory === 'all' ? 'active' : ''}`}
                                    onClick={() => handleCategoryChange('all')}
                                >
                                    All Categories
                                </button>
                                {categories.map((category) => (
                                    <button
                                        key={category.id}
                                        className={`filter-option ${selectedCategory === category.id.toString() ? 'active' : ''}`}
                                        onClick={() => handleCategoryChange(category.id.toString())}
                                    >
                                        {category.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <select className="sort-select" value={sortBy} onChange={handleSortChange}>
                        <option value="none">Sort by</option>
                        <option value="price-asc">Price: Low to High</option>
                        <option value="price-desc">Price: High to Low</option>
                    </select>

                    {(searchQuery || selectedCategory !== 'all' || sortBy !== 'none') && (
                        <button className="clear-filters-btn" onClick={clearFilters}>
                            Clear All
                        </button>
                    )}
                </div>

                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        className="search-input"
                    />
                    {searchQuery ? (
                        <button className="search-icon clear-search" onClick={clearSearch}>
                            ✕
                        </button>
                    ) : (
                        <span className="search-icon">🔍</span>
                    )}
                </div>
            </div>

            {/* Products Grid */}
            <div className="products-grid">
                {filteredProducts.length === 0 ? (
                    <div className="no-products">
                        <p>No products found matching your criteria.</p>
                        <p className="hint">Try adjusting your search or filters.</p>
                    </div>
                ) : (
                    filteredProducts.map((product) => (
                        <div key={product.id} className="product-card-wrapper">
                            <Link
                                to={`/products/${product.id}`}
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

                            {product.is_in_stock && (
                                <button
                                    className="add-to-cart-btn-quick"
                                    onClick={(e) => handleAddToCart(e, product)}
                                    title="Add to cart"
                                >
                                    <img src={addToCartIcon} alt="Add to cart" className="cart-btn-icon" />
                                </button>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default Products;
