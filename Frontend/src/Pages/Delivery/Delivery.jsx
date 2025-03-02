import React from "react";
import "./Delivery.css";

const Delivery = () => {
  return (
    <div className="delivery-container">
      <h1>Delivery Information</h1>
      <p>
        At <strong>YumExpress</strong>, we take pride in ensuring your food is
        delivered fresh and on time. We have a team of dedicated delivery
        partners working tirelessly to provide a seamless experience.
      </p>

      <h2>How Our Delivery Works</h2>
      <ol>
        <li>🛍️ Select your favorite dishes and place an order.</li>
        <li>🚀 Our partner restaurant prepares your meal with care.</li>
        <li>
          📦 A delivery agent picks up your order and ensures quick delivery.
        </li>
      </ol>

      <h2>Delivery Charges</h2>
      <p>
        💰 Free delivery on orders above ₹199. Otherwise, a small charge of ₹40
        applies.
      </p>

      <h2>Estimated Delivery Time</h2>
      <p>⏳ Standard delivery time: 30-45 minutes (may vary by location).</p>

      <h2>Tracking Your Order</h2>
      <p>📍 You can track your order in real-time through our app.</p>
    </div>
  );
};

export default Delivery;
