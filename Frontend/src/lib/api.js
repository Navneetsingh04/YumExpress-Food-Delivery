import { axiosInstance } from "./axios";


export const loginApi = async (credentials) => {
  const res = await axiosInstance.post("/api/user/login", credentials);
  return res.data;
};

export const registerApi = async (userData) => {
  const res = await axiosInstance.post("/api/user/register", userData);
  return res.data;
};

export const getProfile = async () => {
  try {
    const res = await axiosInstance.get("/api/user/profile");
    return res.data;
  } catch (err) {
    throw err;
  }
};

export const usersOrder = async () => {
  try {
    const res = await axiosInstance.post("/api/order/userorders");
    return res.data;
  } catch (error) {
    throw error;
  }
};


export const getAddresses = async () => {
  const res = await axiosInstance.get("/api/user/addresses");
  return res.data;
};

export const deleteAddress = async (addressId) => {
  const res = await axiosInstance.delete("/api/user/addresses/delete", {
    data: { addressId },
  });
  return res.data;
};



export const saveAddress = async (address, addressId = null) => {
  if (addressId) {
    // Update
    const res = await axiosInstance.put("/api/user/addresses/update", {
      addressId,
      ...address,
    });
    return res.data;
  } else {
    // Add new
    const res = await axiosInstance.post("/api/user/addresses/add", address);
    return res.data;
  }
};

export const verifyOrder = async ({ success, orderId }) => {
  const res = await axiosInstance.post("/api/order/verify", { success, orderId });
  return res.data;
};

export const getRazorpayKeyId = async () => {
  const res = await axiosInstance.get("/api/payment/get-razorpay-key-id");
  return res.data;
};

export const createRazorpayOrder = async (amount, orderData) => {
  const res = await axiosInstance.post("/api/payment/order", { amount, orderData });
  return res.data;
};

export const verifyRazorpayPayment = async ({ orderData, razorpay_payment_id, razorpay_order_id, razorpay_signature }) => {
  const res = await axiosInstance.post("/api/payment/verify", {
    orderData,
    razorpay_payment_id,
    razorpay_order_id,
    razorpay_signature
  });
  return res.data;
};


// Sync cart item with backend
export const syncCartApi = async ({ itemId, action }) => {
  const endpoint = action === "add" ? "/api/cart/add" : "/api/cart/remove";
  const res = await axiosInstance.post(endpoint, { itemId });
  return res.data;
};

// Load cart data from backend
export const loadCartApi = async () => {
  const res = await axiosInstance.post("/api/cart/get", {});
  return res.data;
};

// Clear cart
export const clearCartApi = async () => {
  const res = await axiosInstance.post("/api/cart/clear", {});
  return res.data;
};

export const fetchFoods = async () => {
  try {
    const res = await axiosInstance.get('/api/food/list');
    return res.data; // { success: true, data: [...] } or { success: false, message: '...' }
  } catch (err) {
    throw err;
  }
};