import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchAnalyticsSummary,
  fetchOrdersAnalytics,
  fetchRevenueAnalytics,
  fetchCustomerAnalytics,
  fetchTopMetrics,
} from "../../lib/api"; 

const initialState = {
  summaryData: {},
  revenueData: [],
  revenueStats: {},
  orderStatusData: [],
  topSellingItems: [],
  ordersData: {},
  customerData: {},
  topMetrics: {},
  selectedPeriod: "daily",
  loading: false,
  error: null,
  chartDataLoading: {
    revenue: false,
    orderStatus: false,
    topSelling: false,
  },
};

// Fetch all analytics data
export const fetchAllAnalyticsData = createAsyncThunk(
  "analytics/fetchAllAnalyticsData",
  async ({ period = "daily" }, { rejectWithValue }) => {
    try {
      const [
        summaryRes,
        ordersRes,
        revenueRes,
        customerRes,
        topMetricsRes
      ] = await Promise.all([
        fetchAnalyticsSummary(),
        fetchOrdersAnalytics(period),
        fetchRevenueAnalytics(period),
        fetchCustomerAnalytics(),
        fetchTopMetrics()
      ]);

      return {
        summary: summaryRes.success ? summaryRes.data : {},
        orders: ordersRes.success ? ordersRes.data : {},
        revenue: revenueRes.success ? revenueRes.data : {},
        customer: customerRes.success ? customerRes.data : {},
        topMetrics: topMetricsRes.success ? topMetricsRes.data : {},
      };
    } catch (error) {
      return rejectWithValue("Failed to fetch analytics data");
    }
  }
);

const analyticsSlice = createSlice({
  name: "analytics",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setChartDataLoading: (state, action) => {
      const { chart, loading } = action.payload;
      state.chartDataLoading[chart] = loading;
    },
    setSelectedPeriod: (state, action) => {
      state.selectedPeriod = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllAnalyticsData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllAnalyticsData.fulfilled, (state, action) => {
        state.loading = false;
        const { summary, orders, revenue, customer, topMetrics } = action.payload;
        
        state.summaryData = summary;
        state.ordersData = orders;
        state.revenueData = revenue?.revenueTrend || []; // Extract the trend array for chart
        state.customerData = customer;
        state.topMetrics = topMetrics;
        
        // Extract specific data for chart components
        state.orderStatusData = orders?.ordersByStatus || [];
        state.topSellingItems = topMetrics?.topSellingItems || [];
        
        // Store the full revenue object for stats
        state.revenueStats = revenue || {};
      })
      .addCase(fetchAllAnalyticsData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearError,
  setChartDataLoading,
  setSelectedPeriod,
} = analyticsSlice.actions;

export default analyticsSlice.reducer;
