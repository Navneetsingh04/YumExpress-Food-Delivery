import React from "react";
import "./AboutUs.css";

const AboutUs = () => {
  return (
    <div className="about-container">
      <h1>About Us</h1>
      <p>
        Welcome to <strong>YumExpress</strong>, your trusted food delivery
        partner. We are dedicated to delivering fresh, delicious meals straight
        to your doorstep with speed and efficiency.
      </p>

      <h2>Our Mission</h2>
      <p>
        We aim to make ordering food online easy, convenient, and enjoyable.
        With a wide selection of restaurants and cuisines, we bring flavors from
        around the world to your table.
      </p>

      <h2>Why Choose Us?</h2>
      <ul>
        <li>✅ Fresh & High-Quality Meals</li>
        <li>✅ Fast & Reliable Delivery</li>
        <li>✅ User-Friendly Ordering Experience</li>
        <li>✅ 24/7 Customer Support</li>
      </ul>

      <p>
        Join us on this journey and let’s redefine the food delivery experience
        together!
      </p>
    </div>
  );
};

export default AboutUs;
