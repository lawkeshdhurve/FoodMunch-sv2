import React, { useEffect, useRef } from 'react'
import './Header.css'

const particles = ['🍕', '🍔', '🌮', '🍜', '🍣', '🧆', '🍰', '🥗'];

const Header = () => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, []);

  return (
    <div className='header'>
        {/* 🎬 Background Video served from public/ folder */}
        <video
            ref={videoRef}
            className='header-video'
            src="/background.mp4"
            poster="/header_img.png"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
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