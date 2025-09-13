import React from "react";
import "./ManualAddressForm.css";

const ManualAddressForm = ({ addressData, onAddressChange }) => {
  const handleChange = (event) => {
    const { name, value } = event.target;
    onAddressChange({ ...addressData, [name]: value });
  };

  return (
    <div className="manual-address-form">
      <h3>Enter delivery address:</h3>
      
      <div className="form-group">
        <input
          name="street"
          onChange={handleChange}
          value={addressData.street}
          type="text"
          placeholder="Street Address"
          required
        />
      </div>
      
      <div className="form-group">
        <div className="multi-fields">
          <input
            name="city"
            onChange={handleChange}
            value={addressData.city}
            type="text"
            placeholder="City"
            required
          />
          <input
            name="state"
            onChange={handleChange}
            value={addressData.state}
            type="text"
            placeholder="State"
            required
          />
        </div>
      </div>
      
      <div className="form-group">
        <div className="multi-fields">
          <input
            name="zipcode"
            onChange={handleChange}
            value={addressData.zipcode}
            type="text"
            placeholder="Pin Code"
            required
          />
          <input
            name="country"
            onChange={handleChange}
            value={addressData.country}
            type="text"
            placeholder="Country"
            required
          />
        </div>
      </div>
    </div>
  );
};

export default ManualAddressForm;