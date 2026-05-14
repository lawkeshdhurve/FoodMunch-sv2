import React, { useState } from 'react'
import './Home.css'
import Header from '../../components/Header/Header';
import HowItWorks from '../../components/HowItWorks/HowItWorks';
import ExploreMenu from '../../components/ExploreMenu/ExploreMenu';
import FoodDisplay from '../../components/FoodDisplay/FoodDisplay';
import Features from '../../components/Features/Features';
import AppDownload from '../../components/AppDownload/AppDownload';

const Home = () => {

  const [category,setCategory]=useState("All");
  return (
    <div>
      <Header/>
      <HowItWorks />
      <ExploreMenu category={category} setCategory={setCategory}/>
      <FoodDisplay category={category}/>
      <Features />
      <AppDownload/>
    </div>
  )
}

export default Home;