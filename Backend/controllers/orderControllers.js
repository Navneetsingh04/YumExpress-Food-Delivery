import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";

const placeOrder = async (req, res) => {
  try {

    // Validate required fields
    if (!req.body.items || req.body.items.length === 0) {
      return res.json({ success: false, message: "No items in the order" });
    }
    
    if (!req.body.amount || req.body.amount <= 0) {
      return res.json({ success: false, message: "Invalid order amount" });
    }
    
    if (!req.body.address) {
      return res.json({ success: false, message: "Address is required" });
    }

    const newOrder = new orderModel({
      userId: req.body.userId,
      items: req.body.items,
      amount: req.body.amount,
      address: req.body.address,
    });
    
    await newOrder.save();

    res.json({ success: true, amount: newOrder.amount, orderId: newOrder._id });
  } catch (error) {
    res.json({ success: false, message: "Error Placing Order: " + error.message });
  }
};

const verifyOrder = async (req, res) => {
  const { orderId, success } = req.body;
  try {
    if (success === "true") {
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      res.json({ success: true, message: "Payment successful" });
    } else {
      await orderModel.findByIdAndDelete(orderId);
      res.json({ success: false, message: "Payment failed, order removed" });
    }
  } catch (error) {
    res.json({ success: false, message: "Error verifying order" });
  }
};

// User Orders for frontend
const userOrder = async (req, res) => {
  try {  
    const orders = await orderModel.find({
      userId: req.body.userId,
      payment: true,
    })
    .populate("userId", "name email")
    .populate("items.foodId", "name price image category description")
    .sort({date: -1});
    
    const transformedOrders = orders.map(order => {
      const orderObj = order.toObject();
      const transformedItems = orderObj.items.map(item => {
        if (item.name && item.price !== undefined && item.image) {
          return {
            _id: item.foodId,
            name: item.name,
            price: item.price,
            image: item.image,
            quantity: item.quantity
          };
        }
        else if (item.foodId && typeof item.foodId === 'object' && item.foodId.name) {
          return {
            _id: item.foodId._id,
            name: item.foodId.name,
            price: item.foodId.price,
            image: item.foodId.image,
            quantity: item.quantity
          };
        }
        // Fallback for cases where food item might be deleted
        else {
          return {
            _id: item.foodId || 'unknown',
            name: 'Food Item (unavailable)',
            price: 0,
            image: '',
            quantity: item.quantity
          };
        }
      });
      
      return {
        ...orderObj,
        items: transformedItems
      };
    });
    
    res.json({ success: true, data: transformedOrders });
  } catch (error) {
    res.json({ success: false, message: "Error fetching user orders" });
  }
};

// Listing order for admin panel
const listOrders = async (req, res) => {
  try {
    const orders = await orderModel
      .find({ payment: true }) 
      .populate("userId", "name email")
      .populate("items.foodId", "name price image category description")
      .select("userId items amount address status payment date")
      .sort({ date: -1 });

    const transformedOrders = orders.map(order => {
      const orderObj = order.toObject();

      const transformedItems = orderObj.items.map(item => {

        if (item.name && item.price !== undefined && item.image) {
          return {
            _id: item.foodId,
            name: item.name,
            price: item.price,
            image: item.image,
            quantity: item.quantity
          };
        }
        else if (item.foodId && typeof item.foodId === 'object' && item.foodId.name) {
          return {
            _id: item.foodId._id,
            name: item.foodId.name,
            price: item.foodId.price,
            image: item.foodId.image,
            quantity: item.quantity
          };
        }
        else {
          return {
            _id: item.foodId || 'unknown',
            name: 'Food Item (unavailable)',
            price: 0,
            image: '',
            quantity: item.quantity
          };
        }
      });
      
      return {
        ...orderObj,
        items: transformedItems
      };
    });
    
    res.json({ success: true, data: transformedOrders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ success: false, message: "Error fetching orders" });
  }
};

// api for updating ordeer status

const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    if (!orderId || !status) {
      return res.status(400).json({ success: false, message: "OrderId and status are required" });
    }

    const updatedOrder = await orderModel.findByIdAndUpdate(
      orderId,
      { status }
    );

    if (!updatedOrder) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    res.json({ success: true, message: "Order status updated", data: updatedOrder });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ success: false, message: "Error updating status" });
  }
};

export { placeOrder, verifyOrder, userOrder, listOrders, updateStatus };
