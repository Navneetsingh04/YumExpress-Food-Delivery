import React, { useContext, useEffect, useState } from "react";
import axios from "axios"; 
import "./PlaceOrder.css";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";
import {toast} from "react-hot-toast";
import AddressSelector from "../../components/AddressSelector/AddressSelector";
import ContactForm from "../../components/ContactForm/ContactForm";
import ManualAddressForm from "../../components/ManualAddressForm/ManualAddressForm";
import RazorpayPayment from "../../components/RazorpayPayment/RazorpayPayment";

const PlaceOrder = () => {
  const { getTotalCartAmount, token, food_list, cartItem, url } =
    useContext(StoreContext);

  const [openRazorpay, setOpenRazorpay] = useState(false);
  const [orderCreatedData, setOrderCreatedData] = useState(null);
  
  // Simplified state management
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [contactData, setContactData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  const [addressData, setAddressData] = useState({
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "India",
  });

  const navigate = useNavigate();

  // Payment handlers
  const handlePaymentSuccess = (paymentData) => {
    setOpenRazorpay(false);
    setOrderCreatedData(null);
  };

  const handlePaymentError = (error) => {
    console.error("Payment failed:", error);
    setOpenRazorpay(false);
  };

  const handlePaymentClose = () => {
    setOpenRazorpay(false);
  };

  // Handle address selection from AddressSelector
  const handleAddressSelect = (address) => {
    setSelectedAddress(address);
    
    if (address) {
      // Note: We store the address object and parse the userName in buildOrderData()
      // This ensures we always use the address-specific name, not user profile name
      const nameParts = address.userName ? address.userName.split(' ') : ['', ''];
      setContactData(prev => ({
        ...prev,
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
        phone: address.phone
      }));
      
      // Clear manual address data since we're using saved address
      setAddressData({
        street: "",
        city: "",
        state: "",
        zipcode: "",
        country: "India",
      });
    } else {
      // Manual entry - clear saved address data (contact form will be shown)
      setContactData(prev => ({
        ...prev,
        firstName: '',
        lastName: '',
        phone: ''
      }));
    }
  };

  // Auto-populate user email on mount
  const fetchUserProfile = async () => {
    try {
      const response = await axios.get(url + "/api/user/profile", {
        headers: { token },
      });
      if (response.data.success && response.data.user.email) {
        setContactData(prev => ({
          ...prev,
          email: response.data.user.email
        }));
      }
    } catch (error) {
      // Could not fetch user profile
    }
  };

  // Build final order data
  const buildOrderData = () => {
    let finalAddress;
    
    if (selectedAddress) {
      // Use saved address - get name directly from saved address, not contactData
      const nameParts = selectedAddress.userName ? selectedAddress.userName.split(' ') : ['', ''];
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      
  
      finalAddress = {
        firstName: firstName,
        lastName: lastName,
        email: contactData.email, // Email from user profile
        phone: selectedAddress.phone, // Phone from saved address
        street: selectedAddress.street,
        city: selectedAddress.city,
        state: selectedAddress.state,
        zipcode: selectedAddress.pincode,
        country: "India"
      };
    } else {
    
      finalAddress = {
        ...contactData,
        ...addressData
      };
    }
    
    return finalAddress;
  };

  const placeOrder = async (event) => {
    event.preventDefault();

    if (!token) {
      toast.error("You must be logged in to place an order.");
      return;
    }

    const finalAddress = buildOrderData();

    // Validate form data
    if (!finalAddress.firstName || !finalAddress.lastName || !finalAddress.email || !finalAddress.phone) {
      toast.error("Please fill in all contact information.");
      return;
    }

    if (!finalAddress.street || !finalAddress.city || !finalAddress.state || !finalAddress.zipcode) {
      toast.error("Please fill in all address information.");
      return;
    }

    let orderItems = [];
    food_list.forEach((item) => {
      if (cartItem[item._id] && cartItem[item._id] > 0) {
        orderItems.push({ 
          foodId: item._id,
          name: item.name,
          price: item.price,
          image: item.image,
          quantity: cartItem[item._id] 
        });
      }
    });

    if (orderItems.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }

    const subtotal = getTotalCartAmount();
    const deliveryFee = subtotal > 0 ? (subtotal > 199 ? 0 : 40) : 0;

    const orderData = {
      items: orderItems,
      amount: subtotal + deliveryFee,
      address: finalAddress,
      payment: false,
    };

    try {
      
      let response = await axios.post(url + "/api/order/place", orderData, {
        headers: { token },
      });

      if (response.data.success) {
        const { amount, orderId } = response.data;
        setOrderCreatedData({ 
          amount, 
          orderId, 
          address: finalAddress,
          items: orderItems 
        });
        setOpenRazorpay(true);
      } else {
        console.error("Order failed:", response.data.message);
        toast.error(response.data.message || "Order failed. Please try again.");
      }
    } catch (error) {
      console.error("Order placement error:", error);
      toast.error(error.response?.data?.message || "An error occurred while placing the order. Please try again.");
    }
  };

  const subtotal = getTotalCartAmount();
  const deliveryFee = subtotal > 0 ? (subtotal > 199 ? 0 : 40) : 0;
  const total = subtotal + deliveryFee;

  useEffect(() => {
    if (!token) {
      navigate("/cart");
    } else if (getTotalCartAmount() === 0) {
      navigate("/cart");
    } else {
      // Auto-populate user email if available
      fetchUserProfile();
    }
  }, [token]);

  return (
    <form onSubmit={placeOrder} className="place-order">
      <div className="place-order-left">
        <p className="title">Delivery Information</p>
        
        {/* Address Selection Component */}
        <AddressSelector
          onAddressSelect={handleAddressSelect}
          selectedAddressId={selectedAddress?._id || null}
          allowManualEntry={true}
        />

        {/* Contact Information - Show only when using manual entry */}
        {!selectedAddress && (
          <ContactForm
            contactData={contactData}
            onContactChange={setContactData}
            selectedAddress={selectedAddress}
          />
        )}

        {/* Manual Address Form - Show only when no address is selected */}
        {!selectedAddress && (
          <ManualAddressForm
            addressData={addressData}
            onAddressChange={setAddressData}
          />
        )}
      </div>

      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Total</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>₹{subtotal}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>₹{deliveryFee}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>₹{total}</b>
            </div>
          </div>
          <button type="submit" disabled={subtotal === 0}>
            Proceed to Payment
          </button>
        </div>
      </div>
      
      {/* Razorpay Payment Component */}
      <RazorpayPayment
        isOpen={openRazorpay}
        orderData={orderCreatedData}
        onPaymentSuccess={handlePaymentSuccess}
        onPaymentError={handlePaymentError}
        onClose={handlePaymentClose}
      />
    </form>
  );
};

export default PlaceOrder;
