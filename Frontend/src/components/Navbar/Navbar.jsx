import React, { useEffect, useRef, useState } from "react";
import "./Navbar.css";
import { assets } from "../../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAuth, useCartTotal, useFood } from "../../store/hooks";
import { logout as logoutAction } from "../../store/slices/authSlice";
import { setSearchTerm, filterFoodList } from "../../store/slices/foodSlice";
import { HandbagIcon, LogOut, SearchIcon, ShoppingBag, User, UserCircle2 } from "lucide-react";

const Navbar = ({ setShowLogin }) => {
  const [menu, setMenu] = useState("home");
  const [showSearch, setShowSearch] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const navigate = useNavigate();
  const dropdownRef = useRef();
  const dispatch = useAppDispatch();

  const { token } = useAuth();
  const totalAmount = useCartTotal();
  const { searchTerm } = useFood();

  const handleSearchChange = (e) => {
    const term = e.target.value;
    dispatch(setSearchTerm(term));
    dispatch(filterFoodList());
    if (term && window.location.pathname !== "/") {
      navigate("/");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      setShowSearch(false);
      dispatch(setSearchTerm(""));
      dispatch(filterFoodList());
    }
  };

  const toggleSearch = () => {
    setShowSearch(!showSearch);
    if (!showSearch) {
      dispatch(setSearchTerm(""));
      dispatch(filterFoodList());
    }
  };

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  const handleLogout = () => {
    dispatch(logoutAction());
    navigate("/");
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
          <SearchIcon size={30} onClick={toggleSearch} />
        </div>
        <div className="navbar-search-icon">
          <Link to="/Cart">
            <HandbagIcon size={30} />
          </Link>
          {totalAmount > 0 && <div className="dot"></div>}
        </div>
        {!token ? (
          <button onClick={() => setShowLogin(true)}>Sign In</button>
        ) : (
          <div className="navbar-profile" onClick={toggleDropdown} ref={dropdownRef}>
            <UserCircle2 size={30} />
            {showDropdown && (
              <ul className="navbar-profile-dropdown">
                <li
                  onClick={() => {
                    navigate("/profile");
                    setShowDropdown(false);
                  }}
                >
                  <User size={20} />
                  <p>Profile</p>
                </li>
                <li
                  onClick={() => {
                    navigate("/profile?tab=orders");
                    setShowDropdown(false);
                  }}
                >
                  <ShoppingBag size={20} />
                  <p>Orders</p>
                </li>
                <hr />
                <li
                  onClick={() => {
                    handleLogout();
                    setShowDropdown(false);
                  }}
                >
                  <LogOut size={20} />
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
