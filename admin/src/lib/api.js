import { axiosInstance } from "./axios";

// ==========================
// AUTHENTICATION APIs
// ==========================
export const loginAdminApi = async (credentials) => {
  try {
    const res = await axiosInstance.post("/api/user/admin-login", credentials);
    if (res.data.success && res.data.user?.role === "admin") {
      return { success: true, data: res.data, message: res.data.message };
    }
    return {
      success: false,
      message: "Access denied. Admin privileges required.",
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Login failed",
    };
  }
};

export const verifyAdminApi = async () => {
  try {
    const res = await axiosInstance.get("/api/user/profile");
    if (res.data.success && res.data.user?.role === "admin") {
      return { success: true, data: res.data, message: res.data.message };
    }
    return { success: false, message: "Invalid admin session" };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Verification failed",
    };
  }
};

// ==========================
// FOOD MANAGEMENT APIs
// ==========================
export const addFood = async (formData) => {
  try {
    const res = await axiosInstance.post("/api/food/add", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    if (res.data.success)
      return { success: true, data: res.data.food, message: res.data.message };
    return {
      success: false,
      message: res.data.message || "Failed to add food item",
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Failed to add food item",
    };
  }
};

export const updateFood = async (id, formData) => {
  try {
    const res = await axiosInstance.put(`/api/food/update/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    if (res.data.success)
      return { success: true, data: res.data.food, message: res.data.message };
    return {
      success: false,
      message: res.data.message || "Failed to update food item",
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Failed to update food item",
    };
  }
};

export const removeFood = async (id) => {
  try {
    const res = await axiosInstance.post("/api/food/remove", { id });
    if (res.data.success) return { success: true, message: res.data.message };
    return {
      success: false,
      message: res.data.message || "Failed to remove food item",
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Failed to remove food item",
    };
  }
};

export const fetchFoods = async () => {
  try {
    const res = await axiosInstance.get("/api/food/list");
    if (res.data.success) return { success: true, data: res.data.data };
    return {
      success: false,
      message: res.data.message || "Failed to fetch foods",
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Failed to fetch foods",
    };
  }
};

// ==========================
// ORDER MANAGEMENT APIs
// ==========================
export const fetchOrders = async () => {
  try {
    const res = await axiosInstance.get("/api/order/list");
    if (res.data.success) return { success: true, data: res.data.data };
    return {
      success: false,
      message: res.data.message || "Failed to fetch orders",
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Failed to fetch orders",
    };
  }
};

export const updateOrderStatus = async (orderId, status) => {
  try {
    const res = await axiosInstance.post("/api/order/status", {
      orderId,
      status,
    });
    if (res.data.success) return { success: true, message: res.data.message };
    return {
      success: false,
      message: res.data.message || "Failed to update order status",
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Failed to update order status",
    };
  }
};

// ==========================
// ANALYTICS APIs
// ==========================
export const fetchAnalyticsSummary = async () => {
  try {
    const res = await axiosInstance.get("/api/analytics/summary");
    if (res.data.success) return { success: true, data: res.data.data };
    return {
      success: false,
      message: res.data.message || "Failed to fetch summary",
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Failed to fetch summary",
    };
  }
};

export const fetchOrdersAnalytics = async (period = "daily") => {
  try {
    const res = await axiosInstance.get(
      `/api/analytics/orders?period=${period}`
    );
    if (res.data.success) return { success: true, data: res.data.data };
    return {
      success: false,
      message: res.data.message || "Failed to fetch orders analytics",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.message || "Failed to fetch orders analytics",
    };
  }
};

export const fetchRevenueAnalytics = async (period = "daily") => {
  try {
    const res = await axiosInstance.get(
      `/api/analytics/revenue?period=${period}`
    );
    if (res.data.success) return { success: true, data: res.data.data };
    return {
      success: false,
      message: res.data.message || "Failed to fetch revenue analytics",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.message || "Failed to fetch revenue analytics",
    };
  }
};

export const fetchCustomerAnalytics = async () => {
  try {
    const res = await axiosInstance.get("/api/analytics/customers");
    if (res.data.success) return { success: true, data: res.data.data };
    return {
      success: false,
      message: res.data.message || "Failed to fetch customer analytics",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.message || "Failed to fetch customer analytics",
    };
  }
};

export const fetchTopMetrics = async () => {
  try {
    const res = await axiosInstance.get("/api/analytics/top-metrics");
    if (res.data.success) return { success: true, data: res.data.data };
    return {
      success: false,
      message: res.data.message || "Failed to fetch top metrics",
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Failed to fetch top metrics",
    };
  }
};

export const fetchUserCount = async () => {
  try {
    const res = await axiosInstance.get("/api/user/count");
    if (res.data.success) return { success: true, data: res.data.count };
    return {
      success: false,
      message: res.data.message || "Failed to fetch user count",
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Failed to fetch user count",
    };
  }
};

export const fetchRevenue = async (period = "7days") => {
  try {
    const res = await axiosInstance.get(
      
      `/api/analytics/revenue?period=${period}`
    );
    if (res.data.success) return { success: true, data: res.data.data };
    return {
      success: false,
      message: res.data.message || "Failed to fetch revenue data",
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Failed to fetch revenue data",
    };
  }
};
