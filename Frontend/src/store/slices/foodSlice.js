import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchFoods } from '../../lib/api'; // centralized API

const initialState = {
  foodList: [],
  filteredFoodList: [],
  searchTerm: '',
  loading: false,
  error: null,
};

// Fetch food list via centralized API
export const fetchFoodList = createAsyncThunk(
  'food/fetchFoodList',
  async (_, { rejectWithValue }) => {
    try {
      const data = await fetchFoods();
      if (data.success) {
        const shuffled = [...data.data].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, 32);
      }
      return rejectWithValue(data.message);
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch food list');
    }
  }
);

const foodSlice = createSlice({
  name: 'food',
  initialState,
  reducers: {
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    filterFoodList: (state) => {
      if (!state.searchTerm.trim()) {
        state.filteredFoodList = state.foodList;
      } else {
        state.filteredFoodList = state.foodList.filter(food =>
          [food.name, food.category, food.description]
            .some(field => field?.toLowerCase().includes(state.searchTerm.toLowerCase()))
        );
      }
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFoodList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFoodList.fulfilled, (state, action) => {
        state.loading = false;
        state.foodList = action.payload;
        state.filteredFoodList = action.payload;
      })
      .addCase(fetchFoodList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setSearchTerm, filterFoodList, clearError } = foodSlice.actions;
export default foodSlice.reducer;
