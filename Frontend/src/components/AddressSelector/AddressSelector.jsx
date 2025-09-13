import React, { useContext, useEffect, useState } from "react";
import "./AddressSelector.css";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";

const AddressSelector = ({ onAddressSelect, selectedAddressId, allowManualEntry = true }) => {
  const { url, token } = useContext(StoreContext);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAddresses = async () => {
    try {
      const response = await axios.get(url + "/api/user/addresses", {
        headers: { token }
      });
      
      if (response.data.success) {
        setAddresses(response.data.addresses);
        
        // Auto-select default address if none selected
        if (!selectedAddressId) {
          const defaultAddress = response.data.addresses.find(addr => addr.isDefault);
          if (defaultAddress) {
            onAddressSelect(defaultAddress);
          } else if (response.data.addresses.length > 0) {
            onAddressSelect(response.data.addresses[0]);
          } else if (allowManualEntry) {
            onAddressSelect(null); // Trigger manual entry
          }
        }
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
      if (allowManualEntry) {
        onAddressSelect(null); // Fallback to manual entry
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchAddresses();
    }
  }, [token]);

  const handleAddressClick = (address) => {
    onAddressSelect(address);
  };

  const handleManualEntry = () => {
    onAddressSelect(null);
  };

  if (loading) {
    return <div className="address-selector-loading">Loading addresses...</div>;
  }

  return (
    <div className="address-selector">
      {addresses.length > 0 && (
        <div className="saved-addresses">
          <h3>Choose from saved addresses:</h3>
          <div className="address-options">
            {addresses.map((address) => (
              <div
                key={address._id}
                className={`address-option ${
                  selectedAddressId === address._id ? "selected" : ""
                }`}
                onClick={() => handleAddressClick(address)}
              >
                <div className="address-radio">
                  <input
                    type="radio"
                    name="selectedAddress"
                    value={address._id}
                    checked={selectedAddressId === address._id}
                    onChange={() => handleAddressClick(address)}
                  />
                </div>
                <div className="address-details">
                  {address.userName && <p className="user-name">👤 {address.userName}</p>}
                  <p>
                    {address.name}, {address.street}, {address.city} <br />
                    {address.state} - {address.pincode}
                  </p>
                  <p>Phone: {address.phone}</p>
                  {address.isDefault && <span className="default-badge">Default</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {allowManualEntry && (
        <div className="manual-entry-option">
          <div
            className={`address-option ${selectedAddressId === null ? "selected" : ""}`}
            onClick={handleManualEntry}
          >
            <div className="address-radio">
              <input
                type="radio"
                name="selectedAddress"
                value="manual"
                checked={selectedAddressId === null}
                onChange={handleManualEntry}
              />
            </div>
            <div className="address-details">
              <h4>Enter new address</h4>
              <p>Use a different address for this order</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressSelector;