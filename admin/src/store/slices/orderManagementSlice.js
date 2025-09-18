import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchOrders, updateOrderStatus } from "../../lib/api";

const initialState = {
  orders: [],
  loading: false,
  error: null,
  updatingOrderStatus: false,
  stats: {
    totalOrders: 0,
    pendingOrders: 0,
    deliveredOrders: 0,
    totalRevenue: 0,
  },
};

// Fetch orders thunk
export const fetchAllOrders = createAsyncThunk(
  "orderManagement/fetchOrders",
  async (_, { rejectWithValue }) => {
    const response = await fetchOrders();
    if (response.success) return response.data;
    return rejectWithValue(response.message || "Failed to fetch orders");
  }
);

// Update order status thunk
export const orderStatusUpdate = createAsyncThunk(
  "orderManagement/orderStatusUpdate",
  async ({ orderId, status }, { rejectWithValue }) => {
    const response = await updateOrderStatus(orderId, status);
    if (response.success) return { orderId, status };
    return rejectWithValue(response.message || "Failed to update order status");
  }
);

const orderManagementSlice = createSlice({
  name: "orderManagement",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    calculateStats: (state) => {
      const orders = state.orders;
      state.stats = {
        totalOrders: orders.length,
        pendingOrders: orders.filter(
          (order) =>
            order.status === "Food Processing" ||
            order.status === "Out for delivery"
        ).length,
        deliveredOrders: orders.filter(
          (order) => order.status === "Delivered"
        ).length,
        totalRevenue: orders
          .filter((order) => order.status === "Delivered")
          .reduce((total, order) => total + order.amount, 0),
      };
    },
    setOrders: (state, action) => {
      state.orders = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
        state.error = null;

        // recalc stats
        const orders = action.payload;
        state.stats = {
          totalOrders: orders.length,
          pendingOrders: orders.filter(
            (order) =>
              order.status === "Food Processing" ||
              order.status === "Out for delivery"
          ).length,
          deliveredOrders: orders.filter(
            (order) => order.status === "Delivered"
          ).length,
          totalRevenue: orders
            .filter((order) => order.status === "Delivered")
            .reduce((total, order) => total + order.amount, 0),
        };
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(orderStatusUpdate.pending, (state) => {
        state.updatingOrderStatus = true;
        state.error = null;
      })
      .addCase(orderStatusUpdate.fulfilled, (state, action) => {
        state.updatingOrderStatus = false;
        const { orderId, status } = action.payload;
        const orderIndex = state.orders.findIndex(
          (order) => order._id === orderId
        );
        if (orderIndex !== -1) {
          state.orders[orderIndex].status = status;
        }

        // recalc stats
        const orders = state.orders;
        state.stats = {
          totalOrders: orders.length,
          pendingOrders: orders.filter(
            (order) =>
              order.status === "Food Processing" ||
              order.status === "Out for delivery"
          ).length,
          deliveredOrders: orders.filter(
            (order) => order.status === "Delivered"
          ).length,
          totalRevenue: orders
            .filter((order) => order.status === "Delivered")
            .reduce((total, order) => total + order.amount, 0),
        };
      })
      .addCase(orderStatusUpdate.rejected, (state, action) => {
        state.updatingOrderStatus = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, calculateStats, setOrders } =
  orderManagementSlice.actions;
export default orderManagementSlice.reducer;
