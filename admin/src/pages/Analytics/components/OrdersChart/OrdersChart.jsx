import React from 'react';
import '../shared/ChartComponents.css';
import { Bar } from 'react-chartjs-2';
import { ChartLine, BarChart3 } from 'lucide-react';
import { barChartOptions, formatDateLabel, groupDataByPeriod, fillMissingWeeks, formatWeekLabelForDisplay } from '../chartUtils';
import { useSelector } from 'react-redux';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register Chart.js components for Bar chart
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const OrdersChart = () => {
  const { ordersData, selectedPeriod } = useSelector((state) => ({
    ordersData: state.analytics.ordersData || {},
    selectedPeriod: state.analytics.selectedPeriod || 'month'
  }));

  // Safeguard against undefined or invalid data
  if (!ordersData || !ordersData.ordersTrend || !Array.isArray(ordersData.ordersTrend)) {
    return (
      <div className="analytics-card chart-card">
        <div className="card-header">
          <h3><ChartLine className="inline-icon" />Orders Overview</h3>
          <span className="card-period">{selectedPeriod} view</span>
        </div>
        <div className="chart-container">
          <div className="no-data"><BarChart3 className="inline-icon" /> No order data available</div>
        </div>
      </div>
    );
  }

  // Process the data based on selected period
  const transformedData = ordersData.ordersTrend.map(item => ({
    date: item._id,
    count: item.count
  }));
  const groupedData = groupDataByPeriod(transformedData, selectedPeriod);
  const processedData = fillMissingWeeks(groupedData, selectedPeriod);

  const ordersChartData = {
    labels: selectedPeriod === 'weekly' 
      ? processedData.map(item => formatWeekLabelForDisplay(item.date))
      : processedData.map(item => formatDateLabel(item.date, selectedPeriod)),
    datasets: [{
      label: 'Orders',
      data: processedData.map(item => Number(item.count) || 0),
      backgroundColor: 'rgba(52, 152, 219, 0.8)',
      borderColor: 'rgba(52, 152, 219, 1)',
      borderWidth: 1,
      borderRadius: 6,
      borderSkipped: false,
    }]
  };

  return (
    <div className="analytics-card chart-card">
      <div className="card-header">
        <h3><ChartLine className="inline-icon" />Orders Overview</h3>
        <span className="card-period">{selectedPeriod} view</span>
      </div>
      <div className="chart-container">
        {processedData.length > 0 ? (
          <Bar data={ordersChartData} options={barChartOptions} />
        ) : (
          <div className="no-data"><BarChart3 className="inline-icon" /> No order data available</div>
        )}
      </div>
    </div>
  );
};

export default OrdersChart;