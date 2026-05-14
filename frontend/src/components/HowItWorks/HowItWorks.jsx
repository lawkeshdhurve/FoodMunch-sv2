import React from 'react';
import './HowItWorks.css';

const HowItWorks = () => {
    return (
        <div className="how-it-works" id="how-it-works">
            <div className="how-it-works-header">
                <h2 className="gradient-text">How It Works</h2>
                <p>Get your favorite food delivered in 3 simple steps</p>
            </div>
            
            <div className="steps-container">
                <div className="step-card">
                    <div className="step-icon">🍔</div>
                    <h3>Choose Your Meals</h3>
                    <p>Browse our extensive menu and select your favorite dishes.</p>
                </div>
                
                <div className="step-arrow">➔</div>
                
                <div className="step-card">
                    <div className="step-icon">🛵</div>
                    <h3>Fast Delivery</h3>
                    <p>Our riders will deliver your food fresh and hot to your doorstep.</p>
                </div>
                
                <div className="step-arrow">➔</div>
                
                <div className="step-card">
                    <div className="step-icon">✨</div>
                    <h3>Enjoy Your Food</h3>
                    <p>Sit back, relax, and relish the delicious taste!</p>
                </div>
            </div>
        </div>
    );
}

export default HowItWorks;
