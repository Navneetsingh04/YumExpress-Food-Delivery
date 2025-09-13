import React from "react";
import "./ContactForm.css";

const ContactForm = ({ contactData, onContactChange, selectedAddress }) => {
  const handleChange = (event) => {
    const { name, value } = event.target;
    onContactChange({ ...contactData, [name]: value });
  };

  return (
    <div className="contact-form">
      <h3>Contact Information</h3>
      <div className="form-group">
        <div className="multi-fields">
          <input
            name="firstName"
            onChange={handleChange}
            value={contactData.firstName}
            type="text"
            placeholder="First Name"
            required
          />
          <input
            name="lastName"
            onChange={handleChange}
            value={contactData.lastName}
            type="text"
            placeholder="Last Name"
            required
          />
        </div>
      </div>
      
      <div className="form-group">
        <input
          name="email"
          onChange={handleChange}
          value={contactData.email}
          type="email"
          placeholder="Email address"
          required
        />
      </div>
      
      <div className="form-group">
        <input
          name="phone"
          onChange={handleChange}
          value={contactData.phone}
          type="text"
          placeholder="Phone number"
          required
        />
      </div>
    </div>
  );
};

export default ContactForm;