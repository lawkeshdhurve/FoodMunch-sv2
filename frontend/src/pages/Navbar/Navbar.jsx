import React, { useContext, useState } from 'react'
import './Navbar.css'
import {assets} from '../../assets/assets'
import {Link, useNavigate} from 'react-router-dom'
import { StoreContext } from '../../Context/StoreContext'


const Navbar = ({setShowLogin, theme, toggleTheme}) => {
    
    const [menu,setMenu]=useState("home");
    const {getTotalCartAmount,token,setToken}=useContext(StoreContext);
    
    const navigate = useNavigate();
    const logout =()=>{
        localStorage.removeItem("token");
        setToken("");
        navigate("/");
    }
  
    return (

        <div className='navbar'>
        <Link to='/'>
  <img
  src="https://d2clawv67efefq.cloudfront.net/ccbp-responsive-website/food-munch-img.png"
  alt="FoodMunch Logo"
  className="logo"
  onClick={() => {
    window.open(
      "https://leodhurve.app.n8n.cloud/webhook/62a87793-1c1d-4364-bddd-11339a91b452/chat",
      "_blank"
    );
  }}
/>
</Link>

        <ul className='navbar-menu'>
            <Link to='/' onClick={()=>setMenu("home")} className={menu==="home"?"active":""}>Home</Link>
            <a href='#explore-menu' onClick={()=>setMenu("menu")} className={menu==="menu"?"active":""}>Menu</a>
            <a href='#app-download' onClick={()=>setMenu("mobile-app")} className={menu==="mobile-app"?"active":""}>Mobile-App</a>
            <a href='#footer' onClick={()=>setMenu("contact-us")} className={menu==="contact-us"?"active":""}>Contact Us</a>
        </ul>
        
        <div className="navbar-right">
            <button className="theme-toggle" onClick={toggleTheme}>
                {theme === 'light' ? '🌙' : '☀️'}
            </button>
            <img src={assets.search_icon} alt="search" className="search-icon icon-adaptive" />
            <div className="navbar-search-icon">
                <Link to='/cart'><img src={assets.basket_icon} alt="" className="icon-adaptive" /></Link>
                <div className={getTotalCartAmount()===0?"":"dot"}></div>
            </div>
            {!token?<button onClick={()=>setShowLogin(true)} >Sign in</button>
            : <div className="navbar-profile">
                <img src={assets.profile_icon} alt='' className="icon-adaptive"></img>
                <ul className="nav-profile-dropdown">
                    <li onClick={()=>navigate('/myorders')}><img src={assets.bag_icon} alt="" className="icon-adaptive" /><p>Orders</p></li>
                    <hr />
                    <li onClick={logout}><img src={assets.logout_icon} alt="" className="icon-adaptive" /><p>Logout</p></li>
                </ul>
            </div>
            }
        </div>
    </div>
  )
}

export default Navbar