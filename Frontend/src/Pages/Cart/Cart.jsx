import React from "react";
import "./Cart.css";
import { useNavigate } from "react-router-dom";
import {
  useAppDispatch,
  useCart,
  useFood,
  useCartTotal,
} from "../../store/hooks";
import {
  addToCart,
  removeFromCart,
  syncCartWithBackend,
} from "../../store/slices/cartSlice";
import { assets } from "../../assets/assets";

const Cart = () => {
  const dispatch = useAppDispatch();
  const { items: cartItem } = useCart();
  const { foodList } = useFood();
  const totalCartAmount = useCartTotal();
  const url = import.meta.env.VITE_URL;

  const navigate = useNavigate();

  // Check if cart is empty
  const isCartEmpty = totalCartAmount === 0;

  const handleAddToCart = (itemId) => {
    dispatch(addToCart({ itemId }));
    dispatch(syncCartWithBackend({ itemId, action: "add" }));
  };

  const handleRemoveFromCart = (itemId) => {
    dispatch(removeFromCart({ itemId }));
    dispatch(syncCartWithBackend({ itemId, action: "remove" }));
  };

  return (
    <div className="cart">
      <div className="free-delivery-info">
        <p>Orders above ₹199 and get free delivery!</p>
      </div>

      {isCartEmpty ? (
        <div className="empty-cart">
          <div className="empty-cart-content">
            <img
              src={assets.abandoned_cart}
              alt="Empty Cart"
              className="empty-cart-image"
            />
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added anything to your cart yet.</p>
            <p>Start shopping to fill it up!</p>
            <button
              className="continue-shopping-btn"
              onClick={() => navigate("/")}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="cart-items">
            <div className="cart-items-title">
              <p>Items</p>
              <p>Title</p>
              <p>Price</p>
              <p>Quantity</p>
              <p>Total</p>
              <p>Remove</p>
              <p>Add</p>
            </div>
            <br />
            <hr />
            {foodList.map((item, index) => {
              if (cartItem[item._id] > 0) {
                return (
                  <div key={index}>
                    <div className="cart-items-title cart-items-item">
                      <img
                        src={
                          item.image?.startsWith("http")
                            ? item.image
                            : url + "/images/" + item.image
                        }
                        alt={item.name || "food"}
                      />
                      <p>{item.name}</p>
                      <p>₹{item.price}</p>
                      <p>{cartItem[item._id]}</p>
                      <p>₹{item.price * cartItem[item._id]}</p>
                      <p
                        onClick={() => handleRemoveFromCart(item._id)}
                        className="x"
                      >
                        X
                      </p>
                      <p
                        onClick={() => handleAddToCart(item._id)}
                        className="add"
                      >
                        +
                      </p>
                    </div>
                    <hr />
                  </div>
                );
              }
              return null;
            })}
          </div>
          <div className="cart-bottom">
            <div className="cart-total">
              <h2>Cart total</h2>
              <div>
                <div className="cart-total-details">
                  <p>Subtotal</p>
                  <p>₹{totalCartAmount}</p>
                </div>
                <hr />
                {totalCartAmount > 0 && (
                  <>
                    {totalCartAmount > 199 && (
                      <div className="free-delivery-message">
                        <p>
                          <strong>Congratulations!</strong> You are eligible for
                          free delivery.
                        </p>
                      </div>
                    )}
                    <div className="cart-total-details">
                      <p>Delivery fee</p>
                      <p>₹{totalCartAmount > 199 ? 0 : 40}</p>
                    </div>
                    <hr />
                  </>
                )}
                <div className="cart-total-details">
                  <b>Total</b>
                  <b>
                    ₹
                    {totalCartAmount === 0
                      ? 0
                      : totalCartAmount + (totalCartAmount > 199 ? 0 : 40)}
                  </b>
                </div>
              </div>
              <button onClick={() => navigate("/order")}>
                Proceed to checkout
              </button>
            </div>
            <div className="cart-promocode">
              <div>
                <p>If you have a promo code, enter it here</p>
                <div className="cart-promocode-input">
                  <input type="text" placeholder="promo code" />
                  <button>Submit</button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
