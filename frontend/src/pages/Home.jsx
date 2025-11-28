import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
    return (
        <div className="home">
            <section className="hero">
                <div className="hero-content">
                    <h1 className="hero-title">
                        Welcome to <span className="gradient-text">MediGuide</span>
                    </h1>
                    <p className="hero-subtitle">
                        Your trusted online pharmacy for quality medications and healthcare products
                    </p>
                    <div className="hero-buttons">
                        <Link to="/products" className="btn btn-primary">
                            Browse Products
                        </Link>
                        <a href="#features" className="btn btn-secondary">
                            Learn More
                        </a>
                    </div>
                </div>
            </section>

            <section id="features" className="features">
                <h2 className="section-title">Why Choose MediGuide?</h2>
                <div className="features-grid">
                    <div className="feature-card">
                        <div className="feature-icon">🏥</div>
                        <h3>Quality Assured</h3>
                        <p>All medications are sourced from certified manufacturers</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">🚚</div>
                        <h3>Fast Delivery</h3>
                        <p>Quick and reliable shipping to your doorstep</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">💰</div>
                        <h3>Best Prices</h3>
                        <p>Competitive pricing on all healthcare products</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">🤖</div>
                        <h3>AI Assistant</h3>
                        <p>Get personalized recommendations and drug information</p>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Home;
