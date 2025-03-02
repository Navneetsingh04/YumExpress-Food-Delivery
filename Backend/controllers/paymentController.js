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
  const { amount, orderId } = req.body;

  const options = {
    amount: amount * 100,
    currency: "INR",
  };

  try {
    const response = await instance.orders.create(options);
    res.json({
      order_id: response.id,
      currency: response.currency,
      amount: response.amount,
    });
  } catch (error) {
    res.status(400).send("Not able to create order. Please try again!");
  }
};

const paymentVerification = async (req, res) => {
  const { orderId } = req.body;
  try {
    // Verify the payment
    await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });
    await orderModel.findByIdAndUpdate(orderId, { payment: true });

    res.json({ success: true, message: "Payment successful" });
  } catch (error) {
    res.status(400).send("Payment verification failed. Please try again!");
  }
};

export { razorpayKeyId, paymentOrder, paymentVerification };
