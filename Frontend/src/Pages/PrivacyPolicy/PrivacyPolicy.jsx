import React from "react";
import "./PrivacyPolicy.css";

const PrivacyPolicy = () => {
  return (
    <div className="privacy-container">
      <h1>Privacy Policy</h1>
      <p>
        At <strong>YumExpress</strong>, your privacy is important to us. This
        Privacy Policy explains how we collect, use, and protect your personal
        information.
      </p>

      <h2>What Information Do We Collect?</h2>
      <p>When you sign up or place an order, we collect:</p>
      <ul>
        <li>📌 Your name and contact details</li>
        <li>📌 Address for delivery</li>
        <li>📌 Payment details (securely processed)</li>
      </ul>

      <h2>How We Use Your Information</h2>
      <p>We use your data to:</p>
      <ul>
        <li>✔️ Process and deliver your orders</li>
        <li>✔️ Provide customer support</li>
        <li>✔️ Improve our services</li>
      </ul>

      <h2>Data Protection</h2>
      <p>
        We take appropriate security measures to protect your data. Your
        personal information is never shared with third parties without your
        consent.
      </p>

      <h2>Contact Us</h2>
      <p>
        For any concerns, email us at <strong>privacy@yumexpress.com</strong>.
      </p>
    </div>
  );
};

export default PrivacyPolicy;
