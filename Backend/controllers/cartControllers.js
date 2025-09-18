import userModel from "../models/userModel.js";

// Add item to user cart
const addToCart = async (req, res) => {
  try {
    const { userId, itemId } = req.body;
    if (!userId || !itemId) {
      return res.json({ success: false, message: "userId and itemId required" });
    }

    let user = await userModel.findById(userId);
    if (!user) return res.json({ success: false, message: "User not found" });

    let cartData = user.cartData || {};

    if (!cartData[itemId]) {
      cartData[itemId] = 1;
    } else {
      cartData[itemId] += 1;
    }

    await userModel.findByIdAndUpdate(userId, { cartData });

    res.json({ success: true, message: "Added to Cart" });
  } catch (error) {
    res.json({ success: false, message: "Error" });
  }
};

// Remove item from user cart
const removeFromCart = async (req, res) => {
  try {
    const { userId, itemId } = req.body;
    if (!userId || !itemId) {
      return res.json({ success: false, message: "userId and itemId required" });
    }

    let user = await userModel.findById(userId);
    if (!user) return res.json({ success: false, message: "User not found" });

    let cartData = user.cartData || {};

    if (cartData[itemId] > 0) {
      cartData[itemId] -= 1;
      if (cartData[itemId] === 0) {
        delete cartData[itemId]; 
      }
    }

    await userModel.findByIdAndUpdate(userId, { cartData });

    res.json({ success: true, message: "Removed from Cart" });
  } catch (error) {
    res.json({ success: false, message: "Error" });
  }
};

// Get user cart
const getCart = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.json({ success: false, message: "userId required" });
    }

    let user = await userModel.findById(userId);
    if (!user) return res.json({ success: false, message: "User not found" });

    res.json({ success: true, cartData: user.cartData || {} });
  } catch (error) {
    res.json({ success: false, message: "Error" });
  }
};

// Clear user cart
const clearCart = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.json({ success: false, message: "userId required" });
    }

    let user = await userModel.findById(userId);
    if (!user) return res.json({ success: false, message: "User not found" });

    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    res.json({ success: true, message: "Cart cleared successfully" });
  } catch (error) {
    res.json({ success: false, message: "Error clearing cart" });
  }
};

export { addToCart, removeFromCart, getCart, clearCart };
