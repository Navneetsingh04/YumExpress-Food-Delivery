import { useDispatch, useSelector } from 'react-redux';
import { createSelector } from '@reduxjs/toolkit';

// Custom hooks for better reusability
export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;

// Specific selector hooks for admin use cases
export const useAdminAuth = () => useAppSelector(state => state.adminAuth);
export const useFoodManagement = () => useAppSelector(state => state.foodManagement);
export const useOrderManagement = () => useAppSelector(state => state.orderManagement);
export const useAnalytics = () => useAppSelector(state => state.analytics);

// Combined selectors for complex data
export const useOrderStats = () => useAppSelector(state => state.orderManagement.stats);
export const useAnalyticsSummary = () => useAppSelector(state => state.analytics.summaryData);

// Memoized selectors to prevent unnecessary rerenders
const selectChartData = createSelector(
  [state => state.analytics.revenueData, state => state.analytics.orderStatusData, state => state.analytics.topSellingItems],
  (revenue, orderStatus, topSelling) => ({
    revenue,
    orderStatus,
    topSelling,
  })
);

const selectLoadingStates = createSelector(
  [
    state => state.adminAuth.loading,
    state => state.foodManagement.loading,
    state => state.orderManagement.loading,
    state => state.analytics.loading,
    state => state.analytics.chartDataLoading,
  ],
  (auth, food, orders, analytics, chartLoading) => ({
    auth,
    food,
    orders,
    analytics,
    chartLoading,
  })
);

export const useChartData = () => useAppSelector(selectChartData);
export const useLoadingStates = () => useAppSelector(selectLoadingStates);