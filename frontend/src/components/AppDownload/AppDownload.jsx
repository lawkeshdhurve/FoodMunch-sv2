import React from 'react'
import "./AppDownload.css"
import { assets } from '../../assets/assets'
const AppDownload = () => {
  return (
    <div className='app-download' id='app-download'>
        <h2 className='app-download-title'>Get the Best Experience</h2>
        <p className='app-download-subtitle'>Download the Food Munch app and enjoy exclusive offers, real-time tracking, and lightning-fast ordering.</p>
        <div className='app-download-banner'>
            <div className='app-download-banner-left'>
                <h2>Download Food Munch App</h2>
                <p>Available on iOS & Android — Free to download</p>
            </div>
            <div className='app-download-platforms'>
                <img src={assets.play_store} alt='Play Store'/>
                <img src={assets.app_store} alt='App Store'/>
            </div>
        </div>
    </div>
  )
}

export default AppDownload