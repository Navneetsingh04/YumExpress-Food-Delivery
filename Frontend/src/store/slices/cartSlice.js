import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { syncCartApi, loadCartApi, clearCartApi } from "../../lib/api";

const initialState = {
  items: {},
  loading: false,
  error: null,
  totalAmount: 0,
};

// Load cart data
export const loadCartData = createAsyncThunk(
  "cart/loadCartData",
  async (_, { rejectWithValue }) => {
    try {
      const data = await loadCartApi();
      if (data.success) return data.cartData;
      return rejectWithValue(data.message);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to load cart");
    }
  }
);

// Sync cart item
export const syncCartWithBackend = createAsyncThunk(
  "cart/syncWithBackend",
  async ({ itemId, action }, { rejectWithValue }) => {
    try {
      const data = await syncCartApi({ itemId, action });
      if (data.success) return data;
      return rejectWithValue(data.message);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Cart sync failed");
    }
  }
);

// Clear cart
export const clearCartAsync = createAsyncThunk(
  "cart/clearCartAsync",
  async (_, { rejectWithValue }) => {
    try {
      const data = await clearCartApi();
      if (data.success || Object.keys(data).length === 0) return {};
      return rejectWithValue(data.message);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to clear cart");
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { itemId } = action.payload;
      state.items[itemId] = state.items[itemId] ? state.items[itemId] + 1 : 1;
    },
    removeFromCart: (state, action) => {
      const { itemId } = action.payload;
      if (state.items[itemId] > 1) state.items[itemId] -= 1;
      else delete state.items[itemId];
    },
    clearCart: (state) => {
      state.items = {};
      state.totalAmount = 0;
    },
    calculateTotalAmount: (state, action) => {
      const { foodList } = action.payload;
      state.totalAmount = Object.entries(state.items).reduce((total, [itemId, qty]) => {
        const item = foodList.find((f) => String(f._id) === String(itemId));
        return item ? total + item.price * qty : total;
      }, 0);
    },
    setCartItems: (state, action) => {
      state.items = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Load cart
      .addCase(loadCartData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadCartData.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(loadCartData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Sync cart
      .addCase(syncCartWithBackend.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Clear cart
      .addCase(clearCartAsync.fulfilled, (state) => {
        state.items = {};
        state.totalAmount = 0;
        state.error = null;
      })
      .addCase(clearCartAsync.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { addToCart, removeFromCart, clearCart, calculateTotalAmount, setCartItems, clearError } = cartSlice.actions;
export default cartSlice.reducer;
