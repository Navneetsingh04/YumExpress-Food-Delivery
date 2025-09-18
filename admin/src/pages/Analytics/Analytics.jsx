import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import "./Analytics.css";

import LoadingState from './components/LoadingState/LoadingState';
import AnalyticsHeader from './components/AnalyticsHeader/AnalyticsHeader';
import SummaryCards from './components/SummaryCards/SummaryCards';
import OrdersChart from './components/OrdersChart/OrdersChart';
import OrderStatusChart from './components/OrderStatusChart/OrderStatusChart';
import RevenueChart from './components/RevenueChart/RevenueChart';
import CustomerGrowthChart from './components/CustomerGrowthChart/CustomerGrowthChart';
import TopSellingItems from './components/TopSellingItems/TopSellingItems';
import TopCategories from './components/TopCategories/TopCategories';
import { useAppDispatch, useAnalytics, useLoadingStates } from "../../store/hooks";
import { fetchAllAnalyticsData, setSelectedPeriod } from "../../store/slices/analyticsSlice";

const Analytics = () => {
  const dispatch = useAppDispatch();
  const analytics = useAnalytics();
  const { analytics: loading } = useLoadingStates();
  const [error, setError] = useState(null);
  
  const selectedPeriod = analytics.selectedPeriod;

  const fetchData = async () => {
    try {
      setError(null);
      await dispatch(fetchAllAnalyticsData({ period: selectedPeriod })).unwrap();
    } catch (err) {
      console.error("Analytics fetch error:", err);
      setError("Failed to load analytics data");
      toast.error("Failed to load analytics data");
    }
  };

  const handlePeriodChange = (newPeriod) => {
    dispatch(setSelectedPeriod(newPeriod));
  };

  useEffect(() => {
    fetchData();
  }, [selectedPeriod]);

  if (loading || error) {
    return <LoadingState loading={loading} error={error} onRetry={fetchData} />;
  }

  return (
    <div className="analytics">
      <AnalyticsHeader 
        selectedPeriod={selectedPeriod}
        onPeriodChange={handlePeriodChange}
        onRefresh={fetchData}
      />
      <SummaryCards />
      <div className="analytics-grid">
        <OrdersChart />
        <OrderStatusChart />
        <RevenueChart />
        <CustomerGrowthChart />
        <TopSellingItems />
        <TopCategories />
      </div>
    </div>
  );
};

export default Analytics;