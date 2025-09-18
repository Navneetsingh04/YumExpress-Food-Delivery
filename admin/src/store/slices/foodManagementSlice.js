import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchFoods,
  addFood,
  updateFood,
  removeFood,
} from "../../lib/api";

const initialState = {
  foodItems: [],
  loading: false,
  error: null,
  addingFood: false,
  updatingFood: false,
  deletingFood: false,
};

// Fetch all food items
export const fetchFoodItems = createAsyncThunk(
  "foodManagement/fetchFoodItems",
  async (_, { rejectWithValue }) => {
    const response = await fetchFoods();
    if (response.success) return response.data;
    return rejectWithValue(response.message || "Failed to fetch food items");
  }
);

// Add food item
export const addFoodItem = createAsyncThunk(
  "foodManagement/addFoodItem",
  async (formData, { rejectWithValue }) => {
    const response = await addFood(formData);
    if (response.success) return response.data;
    return rejectWithValue(response.message || "Failed to add food item");
  }
);

// Update food item
export const updateFoodItem = createAsyncThunk(
  "foodManagement/updateFoodItem",
  async ({ id, formData }, { rejectWithValue }) => {
    const response = await updateFood(id, formData);
    if (response.success) return response.data;
    return rejectWithValue(response.message || "Failed to update food item");
  }
);

// Delete food item
export const deleteFoodItem = createAsyncThunk(
  "foodManagement/deleteFoodItem",
  async (id, { rejectWithValue }) => {
    const response = await removeFood(id);
    if (response.success) return id;
    return rejectWithValue(response.message || "Failed to delete food item");
  }
);

const foodManagementSlice = createSlice({
  name: "foodManagement",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetFoodState: (state) => {
      state.addingFood = false;
      state.updatingFood = false;
      state.deletingFood = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch food
      .addCase(fetchFoodItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFoodItems.fulfilled, (state, action) => {
        state.loading = false;
        state.foodItems = action.payload;
      })
      .addCase(fetchFoodItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add food
      .addCase(addFoodItem.pending, (state) => {
        state.addingFood = true;
        state.error = null;
      })
      .addCase(addFoodItem.fulfilled, (state, action) => {
        state.addingFood = false;
        state.foodItems.push(action.payload);
      })
      .addCase(addFoodItem.rejected, (state, action) => {
        state.addingFood = false;
        state.error = action.payload;
      })

      // Update food
      .addCase(updateFoodItem.pending, (state) => {
        state.updatingFood = true;
        state.error = null;
      })
      .addCase(updateFoodItem.fulfilled, (state, action) => {
        state.updatingFood = false;
        const index = state.foodItems.findIndex(
          (item) => item._id === action.payload._id
        );
        if (index !== -1) state.foodItems[index] = action.payload;
      })
      .addCase(updateFoodItem.rejected, (state, action) => {
        state.updatingFood = false;
        state.error = action.payload;
      })

      // Delete food
      .addCase(deleteFoodItem.pending, (state) => {
        state.deletingFood = true;
        state.error = null;
      })
      .addCase(deleteFoodItem.fulfilled, (state, action) => {
        state.deletingFood = false;
        state.foodItems = state.foodItems.filter(
          (item) => item._id !== action.payload
        );
      })
      .addCase(deleteFoodItem.rejected, (state, action) => {
        state.deletingFood = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, resetFoodState } = foodManagementSlice.actions;
export default foodManagementSlice.reducer;
