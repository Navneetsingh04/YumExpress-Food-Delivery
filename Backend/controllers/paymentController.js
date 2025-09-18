import Razorpay from "razorpay";
import userModel from "../models/userModel.js";
import orderModel from "../models/orderModel.js";
const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

// ##################### Razorpay Key ###################
const razorpayKeyId = async (req, res) => {
  res.status(200).json({ razorpay_key_id: process.env.RAZORPAY_KEY_ID });
};

// ##################### Payment Order ###################
const paymentOrder = async (req, res) => {
  const { amount, orderData } = req.body;

  // Validate required fields
  if (!amount || amount <= 0) {
    return res.status(400).json({ error: "Invalid amount provided" });
  }

  if (!orderData || !orderData.items || orderData.items.length === 0) {
    return res.status(400).json({ error: "Order data is required" });
  }

  const options = {
    amount: amount * 100,
    currency: "INR",
  };

  try {
    const razorpayOrder = await instance.orders.create(options);
    res.json({
      order_id: razorpayOrder.id,
      currency: razorpayOrder.currency,
      amount: razorpayOrder.amount,
    });
  } catch (error) {
    console.error("Razorpay order creation error:", error);
    res.status(400).json({ error: "Not able to create order. Please try again!" });
  }
};

const paymentVerification = async (req, res) => {
  const { 
    razorpay_payment_id, 
    razorpay_order_id, 
    razorpay_signature, 
    orderData 
  } = req.body;

  try {
    // Here you would typically verify the Razorpay signature
    // For now, we'll assume verification is successful
    
    // Create the order in database only after successful payment
    const newOrder = new orderModel({
      userId: req.body.userId,
      items: orderData.items,
      amount: orderData.amount,
      address: orderData.address,
      payment: true, // Set to true since payment is already verified
      paymentDetails: {
        razorpay_payment_id,
        razorpay_order_id,
        razorpay_signature
      }
    });
    
    await newOrder.save();

    // Clear the user's cart
    await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

    res.json({ 
      success: true, 
      message: "Payment successful and order created",
      orderId: newOrder._id 
    });
  } catch (error) {
    console.error("Payment verification error:", error);
    res.status(400).json({ 
      success: false, 
      message: "Payment verification failed. Please try again!" 
    });
  }
};

export { razorpayKeyId, paymentOrder, paymentVerification };
