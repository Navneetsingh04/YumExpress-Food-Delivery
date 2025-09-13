import React, { useContext, useState, useEffect } from "react";
import "./AddressForm.css";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import {toast} from "react-hot-toast";

const AddressForm = ({ address, onClose, onAddressUpdate }) => {
  const { url, token } = useContext(StoreContext);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    userName: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
    phone: "",
    isDefault: false
  });

  useEffect(() => {
    if (address) {
      setFormData({
        name: address.name || "",
        userName: address.userName || "",
        street: address.street || "",
        city: address.city || "",
        state: address.state || "",
        pincode: address.pincode || "",
        phone: address.phone || "",
        isDefault: address.isDefault || false
      });
    }
  }, [address]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validation
    if (!formData.name.trim()) {
      toast.error("Address name is required");
      setLoading(false);
      return;
    }

    if (!formData.userName.trim()) {
      toast.error("User name is required");
      setLoading(false);
      return;
    }

    if (!formData.street.trim()) {
      toast.error("Street address is required");
      setLoading(false);
      return;
    }

    if (!formData.city.trim()) {
      toast.error("City is required");
      setLoading(false);
      return;
    }

    if (!formData.state.trim()) {
      toast.error("State is required");
      setLoading(false);
      return;
    }

    if (!formData.pincode.trim()) {
      toast.error("Pincode is required");
      setLoading(false);
      return;
    }

    if (!/^\d{6}$/.test(formData.pincode)) {
      toast.error("Please enter a valid 6-digit pincode");
      setLoading(false);
      return;
    }

    if (!formData.phone.trim()) {
      toast.error("Phone number is required");
      setLoading(false);
      return;
    }

    if (!/^\d{10}$/.test(formData.phone)) {
      toast.error("Please enter a valid 10-digit phone number");
      setLoading(false);
      return;
    }

    try {
      
      let response;
      
      if (address) {
        // Update existing address
        response = await axios.put(url + "/api/user/addresses/update", {
          addressId: address._id,
          ...formData
        }, {
          headers: { token }
        });
      } else {
        // Add new address
        response = await axios.post(url + "/api/user/addresses/add", formData, {
          headers: { token }
        });
      }

      if (response.data.success) {
        toast.success(response.data.message);
        onAddressUpdate(response.data.addresses);
        onClose();
      } else {
        console.error("Address operation failed:", response.data);
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error saving address:", error);
      console.error("Error response:", error.response?.data);
      toast.error(error.response?.data?.message || "Failed to save address");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="address-form-overlay">
      <div className="address-form-container">
        <div className="address-form-header">
          <h3>{address ? "Edit Address" : "Add New Address"}</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="address-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="userName">Full Name *</label>
              <input
                type="text"
                id="userName"
                name="userName"
                value={formData.userName}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="name">Address Label *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., Home, Office"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="street">Street Address *</label>
              <textarea
                id="street"
                name="street"
                value={formData.street}
                onChange={handleInputChange}
                placeholder="Enter your complete street address"
                rows="3"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="city">City *</label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                placeholder="Enter city"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="state">State *</label>
              <input
                type="text"
                id="state"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                placeholder="Enter state"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="pincode">Pincode *</label>
              <input
                type="text"
                id="pincode"
                name="pincode"
                value={formData.pincode}
                onChange={handleInputChange}
                placeholder="6-digit pincode"
                maxLength="6"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Phone Number *</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="10-digit phone number"
                maxLength="10"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="isDefault"
                  checked={formData.isDefault}
                  onChange={handleInputChange}
                />
                <span className="checkmark"></span>
                Set as default address
              </label>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Saving..." : (address ? "Update Address" : "Add Address")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddressForm;