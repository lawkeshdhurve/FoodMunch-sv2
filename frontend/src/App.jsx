import React, { useState, useEffect } from 'react'
import Navbar from './pages/Navbar/Navbar';
import Loader from './components/Loader/Loader';
import Toast from './components/Toast/Toast';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home/Home'
import Cart from './pages/Cart/Cart'
import PlaceOrder from './pages/PlaceOrder/PlaceOrder';
import Footer from './components/Footer/Footer';
import LoginPopup from'./components/LoginPopup/LoginPopup';
import Verify from './pages/Verify/Verify';
import MyOrders from './pages/MyOrders/MyOrders'
import VerifyEmail from './pages/VerifyEmail/VerifyEmail';
import DummyPayment from './pages/DummyPayment/DummyPayment';

const App = () => {

  const [showLogin, setShowLogin] = useState(false)
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme((curr) => (curr === 'light' ? 'dark' : 'light'))
  }

  return (
    <>
    <Loader />
    <Toast />
    {showLogin?<LoginPopup setShowLogin={setShowLogin}/>:<></>}
    <div className='app'>
      <Navbar setShowLogin={setShowLogin} theme={theme} toggleTheme={toggleTheme} />  
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/cart' element={<Cart/>}/>
        <Route path='/order' element={<PlaceOrder/>}/>
        <Route path='/verify' element={<Verify />} />
        <Route path='/myorders' element={<MyOrders />} />
        <Route path='/verify-email' element={<VerifyEmail />} />
        <Route path='/dummy-payment' element={<DummyPayment />} />

      </Routes>
    </div>
    <Footer/>
    </>
  )
}

export default App;