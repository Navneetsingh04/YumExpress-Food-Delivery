import React, { useEffect, useState } from "react";
import "./AddressSelector.css";
import { getAddresses } from "../../lib/api";

const AddressSelector = ({ onAddressSelect, selectedAddressId, allowManualEntry = true }) => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const res = await getAddresses();

      if (res?.success) {
        setAddresses(res.addresses || []);

        // Auto-select default address if none selected
        if (!selectedAddressId) {
          const defaultAddress = res.addresses.find(addr => addr.isDefault);
          if (defaultAddress) {
            onAddressSelect(defaultAddress);
          } else if (res.addresses.length > 0) {
            onAddressSelect(res.addresses[0]);
          } else if (allowManualEntry) {
            onAddressSelect(null);
          }
        }
      } else {
        if (allowManualEntry) onAddressSelect(null);
      }
    } catch (error) {
      if (allowManualEntry) onAddressSelect(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

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