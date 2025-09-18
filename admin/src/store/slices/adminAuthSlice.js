import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginAdminApi, verifyAdminApi } from "../../lib/api";

const getStoredAdminUser = () => {
  try {
    const storedUser = localStorage.getItem("adminUser");
    return storedUser && storedUser !== "undefined" ? JSON.parse(storedUser) : null;
  } catch (error) {
    console.error("Error parsing stored admin user:", error);
    return null;
  }
};

const initialState = {
  isAuthenticated: localStorage.getItem("adminToken") ? true : false,
  adminUser: getStoredAdminUser(),
  token: localStorage.getItem("adminToken") || null,
  loading: false,
  error: null,
};

export const loginAdmin = createAsyncThunk(
  "adminAuth/loginAdmin",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await loginAdminApi(credentials);

      if (response.success) {
        const { token, user } = response.data;
        localStorage.setItem("adminToken", token);
        localStorage.setItem("adminUser", JSON.stringify(user));
        return { token, user };
      }
      return rejectWithValue(response.message || "Access denied. Admin privileges required.");
    } catch (error) {
      return rejectWithValue(error.message || "Login failed");
    }
  }
);

export const verifyAdminToken = createAsyncThunk(
  "adminAuth/verifyToken",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { adminAuth } = getState();
      if (!adminAuth.token) return rejectWithValue("No token found");

      const response = await verifyAdminApi();
      if (response.success && response.data.user) {
        return { token: adminAuth.token, user: response.data.user };
      }

      return rejectWithValue(response.message || "Invalid admin session");
    } catch (error) {
      return rejectWithValue("Token verification failed");
    }
  }
);

const adminAuthSlice = createSlice({
  name: 'adminAuth',
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null;
      state.adminUser = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
    },
    clearError: (state) => {
      state.error = null;
    },
    setLoadingState: (state, action) => {
      state.loading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(loginAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.adminUser = action.payload.user;
        state.isAuthenticated = true;
        state.error = null;
        
        // Safely store in localStorage
        if (action.payload.token) {
          localStorage.setItem('adminToken', action.payload.token);
        }
        if (action.payload.user) {
          localStorage.setItem('adminUser', JSON.stringify(action.payload.user));
        }
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })
      // Verify token cases
      .addCase(verifyAdminToken.pending, (state) => {
        state.loading = true;
      })
      .addCase(verifyAdminToken.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.adminUser = action.payload.user;
        state.isAuthenticated = true;
        
        // Safely store in localStorage
        if (action.payload.token) {
          localStorage.setItem('adminToken', action.payload.token);
        }
        if (action.payload.user) {
          localStorage.setItem('adminUser', JSON.stringify(action.payload.user));
        }
      })
      .addCase(verifyAdminToken.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.token = null;
        state.adminUser = null;
        // Clear localStorage on verification failure
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        // Only set error if it's not a "No token found" error
        if (action.payload !== "No token found") {
          state.error = action.payload;
        }
      });
  },
});

export const { logout, clearError, setLoadingState } = adminAuthSlice.actions;
export default adminAuthSlice.reducer;