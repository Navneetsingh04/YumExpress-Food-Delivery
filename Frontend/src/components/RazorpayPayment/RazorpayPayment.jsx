import React, { useEffect } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { getRazorpayKeyId, createRazorpayOrder, verifyRazorpayPayment } from "../../lib/api";

const RazorpayPayment = ({ 
  isOpen, 
  orderData, 
  onPaymentSuccess, 
  onPaymentError, 
  onClose, 
  clearCart 
}) => {
  const navigate = useNavigate();

  const loadRazorpayScript = () =>
    new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const initializeRazorpay = async () => {
    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        toast.error("Razorpay failed to load.");
        return onPaymentError("Script loading failed");
      }

      const keyData = await getRazorpayKeyId();
      if (!keyData.razorpay_key_id) {
        toast.error("Payment configuration error.");
        return onPaymentError("Key fetch failed");
      }

      const orderRes = await createRazorpayOrder(orderData.amount, orderData);
      if (!orderRes.order_id) {
        toast.error("Failed to create payment order.");
        return onPaymentError("Order creation failed");
      }

      const options = {
        key: keyData.razorpay_key_id,
        amount: orderRes.amount,
        currency: orderRes.currency,
        name: "YumExpress",
        description: "Food Order Payment",
        order_id: orderRes.order_id,
        handler: async function (res) {
          try {
            const verifyRes = await verifyRazorpayPayment({
              orderData: orderData,
              razorpay_payment_id: res.razorpay_payment_id,
              razorpay_order_id: res.razorpay_order_id,
              razorpay_signature: res.razorpay_signature,
            });

            if (verifyRes.success) {
              onPaymentSuccess(verifyRes);
            } else {
              toast.error("Payment verification failed.");
              onPaymentError("Payment verification failed");
            }
          } catch (err) {
            toast.error("Payment verification error.");
            onPaymentError("Payment verification error");
          }
        },
        error: function (error) {
          console.error("Razorpay payment error:", error);
          toast.error("Payment failed. Please try again.");
          onPaymentError("Payment failed");
        },
        prefill: {
          name: orderData.address?.firstName + " " + orderData.address?.lastName || "",
          email: orderData.address?.email || "",
          contact: orderData.address?.phone || "",
        },
        notes: {
          address: `${orderData.address?.street}, ${orderData.address?.city}`,
          items_count: orderData.items?.length || 0,
        },
        theme: { color: "#ff6347" },
        modal: {
          ondismiss: function() {
            onPaymentError("Payment cancelled by user");
            onClose();
          },
        },
      };

      new window.Razorpay(options).open();
    } catch (error) {
      toast.error("Payment initialization failed.");
      onPaymentError("Initialization failed");
    }
  };

  useEffect(() => {
    if (isOpen && orderData) initializeRazorpay();
  }, [isOpen, orderData]);

  return null;
};

export default RazorpayPayment;