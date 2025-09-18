import React, { useState } from "react";
import "./Navbar.css";
import { assets } from "../../assets/assets";
import { useAppDispatch, useAdminAuth } from "../../store/hooks";
import { logout } from "../../store/slices/adminAuthSlice";
import { CircleUser } from "lucide-react";

const Navbar = () => {
  const dispatch = useAppDispatch();
  const { adminUser } = useAdminAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    setShowDropdown(false);
  };

  return (
    <div>
      <div className="navbar">
        <img className="logo" src={assets.logo} alt="YumExpress Admin" />
        <div className="navbar-right">
          <span className="admin-welcome">Welcome, {adminUser?.name}</span>
          <div className="profile-container">
            <CircleUser className="profile"  size={30}  onClick={() => setShowDropdown(!showDropdown)}/>
            {showDropdown && (
              <div className="profile-dropdown">
                <div className="dropdown-item">
                  <span>{adminUser?.email}</span>
                  <small>Admin</small>
                </div>
                <hr />
                <div className="dropdown-item logout" onClick={handleLogout}>
                  Logout
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
