import React from "react";
import "./FoodItem.css";
import { assets } from "../../assets/assets";
import { useAppDispatch, useCart } from "../../store/hooks";
import { addToCart, removeFromCart, syncCartWithBackend } from "../../store/slices/cartSlice";

const FoodItem = ({ id, name, price, description, image }) => {
  const dispatch = useAppDispatch();
  const { items: cartItem = {} } = useCart();
  const url = import.meta.env.VITE_URL;

  const quantity = cartItem?.[id] || 0;

  const handleAddToCart = () => {
    dispatch(addToCart({ itemId: id }));
    dispatch(syncCartWithBackend({ itemId: id, action: 'add' }));
  };

  const handleRemoveFromCart = () => {
    dispatch(removeFromCart({ itemId: id }));
    dispatch(syncCartWithBackend({ itemId: id, action: 'remove' }));
  };

  return (
    <div className="food-item">
      <div className="food-item-img-container">
        <img
          className="food-item-image"
          src={image?.startsWith("http") ? image : url + "/images/" + image}
          alt={name || "food"}
        />

        {quantity === 0 ? (
          <img
            className="add"
            onClick={handleAddToCart}
            src={assets.add_icon_white}
            alt="add"
          />
        ) : (
          <div className="food-item-counter">
            <img
              onClick={handleRemoveFromCart}
              src={assets.remove_icon_red}
              alt="remove"
            />
            <p>{quantity}</p>
            <img
              onClick={handleAddToCart}
              src={assets.add_icon_green}
              alt="add"
            />
          </div>
        )}
      </div>

      <div className="food-item-info">
        <div className="food-item-name-rating">
          <p>{name}</p>
          <img src={assets.rating_starts} alt="rating" />
        </div>
        <p className="food-item-desc">{description}</p>
        <p className="food-item-price">₹{price}</p>
      </div>
    </div>
  );
};

export default FoodItem;
