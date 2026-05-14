import React from 'react';
import './Features.css';

const Features = () => {
    return (
        <div className="features-section" id="features">
            <div className="features-header">
                <h2 className="gradient-text">Why Choose Us?</h2>
                <p>We provide the best food delivery experience in town</p>
            </div>
            
            <div className="features-grid">
                <div className="feature-card">
                    <div className="feature-icon">🥬</div>
                    <h3>Fresh Ingredients</h3>
                    <p>We only use the freshest, highest quality ingredients sourced locally every day.</p>
                </div>
                
                <div className="feature-card">
                    <div className="feature-icon">⚡</div>
                    <h3>Lightning Fast</h3>
                    <p>Our optimized delivery routes ensure your food arrives hot in record time.</p>
                </div>
                
                <div className="feature-card">
                    <div className="feature-icon">💰</div>
                    <h3>Best Offers</h3>
                    <p>Enjoy exclusive discounts, loyalty rewards, and daily special deals.</p>
                </div>
                
                <div className="feature-card">
                    <div className="feature-icon">🛡️</div>
                    <h3>Secure Payments</h3>
                    <p>100% secure payment gateways with multiple options for your convenience.</p>
                </div>
            </div>
        </div>
    );
}

export default Features;
