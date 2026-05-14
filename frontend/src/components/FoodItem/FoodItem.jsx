import React, { useContext } from 'react'
import './FoodItem.css'
import { assets } from '../../assets/assets'
import { StoreContext } from '../../Context/StoreContext'

// Generate a stable pseudo-random rating (3.8 – 5.0) seeded by id
const getStarRating = (id) => {
  const seed = parseInt(id, 10) || id.charCodeAt(0);
  const frac = ((seed * 7 + 13) % 13) / 10; // 0.0 – 1.2
  return Math.min(5.0, (3.8 + frac)).toFixed(1);
};

const StarRating = ({ rating }) => {
  const num = parseFloat(rating);
  const full = Math.floor(num);
  const half = num - full >= 0.3;
  return (
    <div className="star-rating">
      {[1,2,3,4,5].map(i => (
        <span key={i} className={
          i <= full ? 'star filled' :
          (i === full + 1 && half ? 'star half' : 'star empty')
        }>★</span>
      ))}
      <span className="star-score">{rating}</span>
    </div>
  );
};

const FoodItem = ({id, name, price, description, image}) => {
  const {cartItems, addToCart, removeFromCart, url} = useContext(StoreContext);
  const rating = getStarRating(id);

  return (
    <div className='food-item'>
        <div className="food-item-img-container">
            <img className='food-item-image' src={url+"/images/"+image} alt={name}/>
            {!cartItems[id]
              ? <img className='add' onClick={() => addToCart(id)} src={assets.add_icon_white} alt="Add"/>
              : <div className='food-item-counter'>
                  <img onClick={() => removeFromCart(id)} src={assets.remove_icon_red} alt='Remove'/>
                  <p>{cartItems[id]}</p>
                  <img onClick={() => addToCart(id)} src={assets.add_icon_green} alt='Add'/>
                </div>
            }
        </div>

        <div className="food-item-info">
          <div className="food-item-name-rating">
              <p>{name}</p>
              <StarRating rating={rating} />
          </div>
          <p className="food-item-desc">{description}</p>
          <p className="food-item-price">₹{price}</p>
        </div>
    </div>
  )
}

export default FoodItem;