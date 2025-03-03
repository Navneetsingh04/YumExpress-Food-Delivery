import React from "react";
import "./Footer.css";
import { assets } from "../../assets/assets";
import { Link, useLocation } from "react-router-dom";
import AppDownload from "../AppDownload/AppDownload";

const Footer = () => {
  const location = useLocation();

  const handleHomeClick = () => {
    if (location.pathname === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };
  return (
    <>
      <div className="footer" id="footer">
        <div className="footer-content">
          <div className="footer-content-left">
            <img className="footer-logo" src={assets.logo} alt="" />
            <p>
              At YumExpress, we bring delicious meals from your favorite
              restaurants straight to your doorstep. With a focus on speed,
              quality, and customer satisfaction, we aim to make every bite
              memorable. From local delights to international cuisines, explore
              a world of flavors with us.
              <br />
              <br />
              YumExpress where convenience meets taste!
            </p>
            <div className="footer-social-icon">
              <img src={assets.facebook_icon} alt="" />
              <img src={assets.twitter_icon} alt="" />
              <img src={assets.linkedin_icon} alt="" />
            </div>
            <div className="footer-bottom">
              <h3 className="footer-developer">
                Made With 💕 by Navneet Singh
              </h3>
            </div>
          </div>
          <div className="footer-content-center">
            <h2>Quick Links</h2>
            <ul>
              <li>
                <Link to="/" onClick={handleHomeClick}>
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about">About Us</Link>
              </li>
              <li>
                <Link to="/delivery">Delivery</Link>
              </li>
              <li>
                <Link to="/privacy-policy">Privacy Policy</Link>
              </li>
            </ul>
          </div>
          <div className="footer-content-right">
            <h2>Contact Us</h2>
            <ul>
              <li>
                <a href="tel:+91-9135573167">+91-9135573167</a>
              </li>
              <li>
                <a href="mailto:yumexpress04@gmail.com">yumexpress04@gmail.com</a>
              </li>
            </ul>
          </div>
        </div>
        <p className="footer-copyright">
          Copyright 2025 ©️ YumExpress.com. All Rights Reserved!
        </p>
        <hr />
        <AppDownload />
      </div>
    </>
  );
};

export default Footer;
