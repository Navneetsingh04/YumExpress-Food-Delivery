import React, { useEffect, useContext } from "react";
import axios from "axios";
import {toast} from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";

const RazorpayPayment = ({ 
  isOpen, 
  orderData, 
  onPaymentSuccess, 
  onPaymentError, 
  onClose 
}) => {
  const { url, token } = useContext(StoreContext);
  const navigate = useNavigate();

  // Load Razorpay script
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Initialize and display Razorpay checkout
  const initializeRazorpay = async () => {
    try {
      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        toast.error("Razorpay failed to load. Please try again later.");
        onPaymentError("Script loading failed");
        return;
      }

      // Get Razorpay key
      const keyResponse = await axios.get(url + "/api/payment/get-razorpay-key-id", {
        headers: { token },
      });
      
      if (!keyResponse.data.razorpay_key_id) {
        toast.error("Payment configuration error. Please try again.");
        onPaymentError("Key fetch failed");
        return;
      }

      // Create Razorpay order
      const orderResponse = await axios.post(
        url + "/api/payment/order",
        {
          amount: orderData.amount,
          orderId: orderData.orderId,
        },
        {
          headers: { token },
        }
      );

      if (!orderResponse.data.order_id) {
        toast.error("Failed to create payment order. Please try again.");
        onPaymentError("Order creation failed");
        return;
      }

      // Configure Razorpay options
      const options = {
        key: keyResponse.data.razorpay_key_id,
        amount: orderResponse.data.amount,
        currency: orderResponse.data.currency,
        name: "YumExpress",
        description: "Food Order Payment",
        order_id: orderResponse.data.order_id,
        handler: async function (response) {
          try {
    
            // Verify payment on backend
            const verifyResponse = await axios.post(
              url + "/api/payment/verify",
              {
                orderId: orderData.orderId,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
              },
              {
                headers: { token },
              }
            );

            if (verifyResponse.data.success) {
              toast.success("Payment successful! Order placed.");
              onPaymentSuccess(verifyResponse.data);
              navigate("/profile?tab=orders");
            } else {
              toast.error("Payment verification failed. Please contact support.");
              onPaymentError("Payment verification failed");
            }
          } catch (error) {
            console.error("Payment verification error:", error);
            toast.error("Payment verification failed. Please contact support.");
            onPaymentError("Payment verification error");
          }
        },
        prefill: {
          name: orderData.address?.firstName + " " + orderData.address?.lastName || "",
          email: orderData.address?.email || "",
          contact: orderData.address?.phone || "",
        },
        notes: {
          address: `${orderData.address?.street}, ${orderData.address?.city}`,
          order_id: orderData.orderId,
        },
        theme: {
          color: "#ff6347",
        },
        modal: {
          ondismiss: function() {
            onClose();
          }
        }
      };

      // Open Razorpay checkout
      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

    } catch (error) {
      console.error("Razorpay initialization error:", error);
      toast.error("Payment initialization failed. Please try again.");
      onPaymentError("Initialization failed");
    }
  };

  // Auto-initialize when component opens
  useEffect(() => {
    if (isOpen && orderData) {
      initializeRazorpay();
    }
  }, [isOpen, orderData]);

  return null;
};

export default RazorpayPayment;