import React from 'react'
import './Header.css'

const particles = ['🍕', '🍔', '🌮', '🍜', '🍣', '🧆', '🍰', '🥗'];

// 🎬 Stream high-speed external video to bypass bundle size limits
import posterImg from '../../assets/header_img.png';
const VIDEO_SRC = "https://res.cloudinary.com/demo/video/upload/food.mp4";

const Header = () => {
  return (
    <div className='header'>
        {/* 🎬 Background Video Stream */}
        <video
            className='header-video'
            src={VIDEO_SRC}
            poster={posterImg}
            autoPlay
            muted
            loop
            playsInline
        />

        {/* Floating Food Particles */}
        <div className='header-particles'>
            {particles.map((emoji, i) => (
                <span key={i} className='particle' style={{ '--i': i }}>{emoji}</span>
            ))}
        </div>

        {/* Overlay gradient */}
        <div className='header-overlay'></div>

        <div className='header-contents'>
            <div className='header-badge'>No. 1 Food Delivery App</div>
            <h2>Order your <span className='header-highlight'>favourite food</span> here</h2>
            <p>Choose from a diverse menu featuring a delectable array of dishes crafted with the finest ingredients and culinary expertise. Our mission is to satisfy your cravings and elevate your dining experience, one delicious meal at a time.</p>
            <div className='header-actions'>
                <a href='#explore-menu'><button className='header-btn-primary'>Order Now 🛵</button></a>
            </div>
        </div>
    </div>
  )
}

export default Header;