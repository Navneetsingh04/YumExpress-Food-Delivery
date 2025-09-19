import { useEffect, useState } from "react";
import "./Profile.css";
import { toast } from "react-hot-toast";
import AddressManager from "../../components/AddressManager/AddressManager";
import MyOrders from "../../components/MyOrders/MyOrders";
import { MapPin, ShoppingBag, User } from "lucide-react";
import { useLocation } from "react-router-dom";
import { getProfile } from "../../lib/api";

const Profile = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");
  const location = useLocation();

  const token = localStorage.getItem("token");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get("tab");
    if (tab && ["orders", "addresses", "profile"].includes(tab)) {
      setActiveTab(tab);
    }
  }, [location.search]);

  const fetchUserProfile = async () => {
    try {
      const res = await getProfile();
      if (res.success) {
        setUserProfile(res.user);
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchUserProfile();
    } else {
      setLoading(false);
    }
  }, [token]);

  const renderContent = () => {
    switch (activeTab) {
      case "orders":
        return <MyOrders />;
      case "addresses":
        return (
          <div className="profile-content left-align">
            <AddressManager />
          </div>
        );
      case "profile":
      default:
        return (
          <div className="profile-content left-align">
            <div className="account-info">
              <h3>Profile Details</h3>
              <div className="info-group">
                <label>Name:</label>
                <span>{userProfile?.name || "Not available"}</span>
              </div>
              <div className="info-group">
                <label>Email:</label>
                <span>{userProfile?.email || "Not available"}</span>
              </div>
              <div className="info-group">
                <label>Phone:</label>
                <span>{userProfile?.phone || "Not available"}</span>
              </div>
              <div className="info-group">
                <label>Account Created:</label>
                <span>
                  {userProfile?.createdAt
                    ? new Date(userProfile.createdAt).toLocaleDateString()
                    : "Not available"}
                </span>
              </div>
            </div>
          </div>
        );
    }
  };

  if (!token) {
    return (
      <div className="profile-page">
        <div className="profile-container">
          <h2>Please login to view your profile</h2>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="profile-page">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      {/* Header Section */}
      <div className="profile-header">
        <div className="header-content">
          <div className="user-info">
            <h1 className="user-name">{userProfile?.name || "User"}</h1>
            <div className="user-details">
              <span className="phone">
                {userProfile?.phone || "Phone not available"}
              </span>
              <span className="divider">•</span>
              <span className="email">
                {userProfile?.email || "Email not available"}
              </span>
            </div>
          </div>
          <button className="edit-profile-btn">EDIT PROFILE</button>
        </div>
      </div>

      {/* Main Content */}
      <div className="profile-main">
        {/* Sidebar Navigation */}
        <div className="profile-sidebar">
          <div className="sidebar-item" onClick={() => setActiveTab("profile")}>
            <div
              className={`sidebar-item-content ${
                activeTab === "profile" ? "active" : ""
              }`}
            >
              <div className="sidebar-icon">
                <User size={20} />
              </div>
              <span>Profile Details</span>
            </div>
          </div>

          <div className="sidebar-item" onClick={() => setActiveTab("orders")}>
            <div
              className={`sidebar-item-content ${
                activeTab === "orders" ? "active" : ""
              }`}
            >
              <div className="sidebar-icon">
                <ShoppingBag size={20} />
              </div>
              <span>Orders</span>
            </div>
          </div>

          <div
            className="sidebar-item"
            onClick={() => setActiveTab("addresses")}
          >
            <div
              className={`sidebar-item-content ${
                activeTab === "addresses" ? "active" : ""
              }`}
            >
              <div className="sidebar-icon">
                <MapPin size={20} />
              </div>
              <span>Addresses</span>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="profile-content-area">{renderContent()}</div>
      </div>
    </div>
  );
};

export default Profile;
