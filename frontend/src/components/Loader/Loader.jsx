import React, { useContext } from 'react';
import './Loader.css';
import { StoreContext } from '../../Context/StoreContext';

const Loader = () => {
    const { isLoading } = useContext(StoreContext);

    if (!isLoading) return null;

    return (
        <div className="global-loader-overlay">
            <div className="loader-content">
                <div className="moving-scooter">🛵</div>
                <div className="loader-text">
                    <span>L</span>
                    <span>o</span>
                    <span>a</span>
                    <span>d</span>
                    <span>i</span>
                    <span>n</span>
                    <span>g</span>
                    <span>.</span>
                    <span>.</span>
                    <span>.</span>
                </div>
            </div>
        </div>
    );
};

export default Loader;
