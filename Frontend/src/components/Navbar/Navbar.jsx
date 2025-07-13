import React, { useContext, useEffect, useRef, useState } from "react";
import "./Navbar.css";
import { assets } from "../../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";

const Navbar = ({ setShowLogin }) => {
  const [menu, setMenu] = useState("home");
  const [showSearch, setShowSearch] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const { getTotalCartAmount, token, setToken, searchTerm, searchFood } = useContext(StoreContext);

  const navigate = useNavigate();
  const dropdownRef = useRef();

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    navigate("/");
  };

  const handleSearchChange = (e) => {
    const term = e.target.value;
    searchFood(term);
    if (term && window.location.pathname !== "/") {
      navigate("/");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      setShowSearch(false);
      searchFood("");
    }
  };

  const toggleSearch = () => {
    setShowSearch(!showSearch);
    if (!showSearch) searchFood("");
  };

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="navbar">
      <Link to="/">
        <img src={assets.logo} alt="Logo" className="logo" />
      </Link>
      <ul className="navbar-menu">
        <Link to="/" onClick={() => setMenu("home")} className={menu === "home" ? "active" : ""}>
          Home
        </Link>
        <a href="#menu" onClick={() => setMenu("menu")} className={menu === "menu" ? "active" : ""}>
          Menu
        </a>
        <a href="#footer" onClick={() => setMenu("contact us")} className={menu === "contact us" ? "active" : ""}>
          Contact us
        </a>
      </ul>
      <div className="navbar-right">
        <div className="navbar-search">
          {showSearch && (
            <input
              type="text"
              placeholder="Search for food..."
              value={searchTerm}
              onChange={handleSearchChange}
              onKeyDown={handleKeyDown}
              className="search-input"
              autoFocus
            />
          )}
          <img src={assets.search_icon} alt="Search" onClick={toggleSearch} className="search-icon" />
        </div>
        <div className="navbar-search-icon">
          <Link to="/Cart">
            <img src={assets.basket_icon} alt="Cart" />
          </Link>
          {getTotalCartAmount() > 0 && <div className="dot"></div>}
        </div>
        {!token ? (
          <button onClick={() => setShowLogin(true)}>Sign In</button>
        ) : (
          <div className="navbar-profile" onClick={toggleDropdown} ref={dropdownRef}>
            <img src={assets.profile_icon} alt="Profile" />
            {showDropdown && (
              <ul className="navbar-profile-dropdown">
                <li
                  onClick={() => {
                    navigate("/myorders");
                    setShowDropdown(false);
                  }}
                >
                  <img src={assets.bag_icon} alt="Orders" />
                  <p>Orders</p>
                </li>
                <hr />
                <li
                  onClick={() => {
                    logout();
                    setShowDropdown(false);
                  }}
                >
                  <img src={assets.logout_icon} alt="Logout" />
                  <p>Logout</p>
                </li>
              </ul>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
