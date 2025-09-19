import { useEffect, useState } from "react";
import "./PlaceOrder.css";
import { useAppDispatch, useAuth, useCart, useFood, useCartTotal } from "../../store/hooks";
import { clearCartAsync } from "../../store/slices/cartSlice";
import { useNavigate } from "react-router-dom";
import {toast} from "react-hot-toast";
import AddressSelector from "../../components/AddressSelector/AddressSelector";
import ContactForm from "../../components/ContactForm/ContactForm";
import ManualAddressForm from "../../components/ManualAddressForm/ManualAddressForm";
import RazorpayPayment from "../../components/RazorpayPayment/RazorpayPayment";
import { getProfile } from "../../lib/api";

const PlaceOrder = () => {
  const dispatch = useAppDispatch();
  const { token } = useAuth();
  const { items: cartItem } = useCart();
  const { foodList } = useFood();
  const totalCartAmount = useCartTotal();

  const [openRazorpay, setOpenRazorpay] = useState(false);
  const [orderData, setOrderData] = useState(null);
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

  const handlePaymentSuccess = async (paymentData) => {
    try {
      await dispatch(clearCartAsync());
      toast.success("Payment successful! Order placed.");
      navigate("/profile?tab=orders");
    } catch (error) {
      console.error("Error clearing cart:", error);
      navigate("/profile?tab=orders");
    }
    setOpenRazorpay(false);
    setOrderData(null);
  };

  const handlePaymentError = async (error) => {
    console.error("Payment failed:", error);
    setOpenRazorpay(false);
    setOrderData(null);
    toast.error("Payment failed. Please try again.");
  };

  const handlePaymentClose = async () => {
    setOpenRazorpay(false);
    setOrderData(null);
    toast.info("Payment cancelled.");
  };
  const handleAddressSelect = (address) => {
    setSelectedAddress(address);
    
    if (address) {
      const nameParts = address.userName ? address.userName.split(' ') : ['', ''];
      setContactData(prev => ({
        ...prev,
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
        phone: address.phone
      }));
      
      setAddressData({
        street: "",
        city: "",
        state: "",
        zipcode: "",
        country: "India",
      });
    } else {
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
      const res = await getProfile();
      if (res.success && res.user.email) {
        setContactData(prev => ({
          ...prev,
          email: res.user.email
        }));
      }
    } catch (error) {
      toast.error("Failed to fetch profile");
    }
  };

  const buildOrderData = () => {
    let finalAddress;
    
    if (selectedAddress) {
      const nameParts = selectedAddress.userName ? selectedAddress.userName.split(' ') : ['', ''];
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      
  
      finalAddress = {
        firstName: firstName,
        lastName: lastName,
        email: contactData.email, 
        phone: selectedAddress.phone, 
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
    foodList.forEach((item) => {
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

    const subtotal = totalCartAmount;
    const deliveryFee = subtotal > 0 ? (subtotal > 199 ? 0 : 40) : 0;

    const orderData = {
      items: orderItems,
      amount: subtotal + deliveryFee,
      address: finalAddress,
    };

    setOrderData(orderData);
    setOpenRazorpay(true);
  };

  const subtotal = totalCartAmount;
  const deliveryFee = subtotal > 0 ? (subtotal > 199 ? 0 : 40) : 0;
  const total = subtotal + deliveryFee;

  useEffect(() => {
    if (!token || totalCartAmount === 0) {
      navigate("/cart");
    } else {
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
        orderData={orderData}
        onPaymentSuccess={handlePaymentSuccess}
        onPaymentError={handlePaymentError}
        onClose={handlePaymentClose}
      />
    </form>
  );
};

export default PlaceOrder;
