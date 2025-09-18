import { configureStore } from '@reduxjs/toolkit';
import adminAuthReducer from './slices/adminAuthSlice';
import foodManagementReducer from './slices/foodManagementSlice';
import orderManagementReducer from './slices/orderManagementSlice';
import analyticsReducer from './slices/analyticsSlice';

export const store = configureStore({
  reducer: {
    adminAuth: adminAuthReducer,
    foodManagement: foodManagementReducer,
    orderManagement: orderManagementReducer,
    analytics: analyticsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
  devTools: import.meta.env.MODE !== 'production',
});