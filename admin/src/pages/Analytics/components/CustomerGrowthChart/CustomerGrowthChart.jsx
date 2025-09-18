import React from 'react';
import './CustomerGrowthChart.css';
import '../shared/ChartComponents.css';
import { Bar } from 'react-chartjs-2';
import { Users, BarChart3 } from 'lucide-react';
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

const CustomerGrowthChart = () => {
  const { customerData, selectedPeriod } = useSelector((state) => ({
    customerData: state.analytics.customerData || {},
    selectedPeriod: state.analytics.selectedPeriod || 'month'
  }));

  // Transform and process the customer growth data
  const transformedData = customerData.customerGrowth?.map(item => ({
    date: item._id,
    customers: item.count
  })) || [];
  const groupedData = groupDataByPeriod(transformedData, selectedPeriod);
  const processedCustomerGrowth = fillMissingWeeks(groupedData, selectedPeriod);

  const customerGrowthData = {
    labels: selectedPeriod === 'weekly' 
      ? processedCustomerGrowth?.map(item => formatWeekLabelForDisplay(item.date)) || []
      : processedCustomerGrowth?.map(item => formatDateLabel(item.date, selectedPeriod)) || [],
    datasets: [{
      label: 'New Customers',
      data: processedCustomerGrowth?.map(item => item.customers) || [],
      backgroundColor: 'rgba(155, 89, 182, 0.8)',
      borderColor: 'rgba(155, 89, 182, 1)',
      borderWidth: 1,
      borderRadius: 6,
      borderSkipped: false,
    }]
  };

  return (
    <div className="analytics-card chart-card">
      <div className="card-header">
        <h3><Users className="inline-icon" /> Customer Growth</h3>
        <span className="card-period">New registrations</span>
      </div>
      <div className="chart-container">
        {processedCustomerGrowth?.length > 0 ? (
          <Bar data={customerGrowthData} options={barChartOptions} />
        ) : (
          <div className="no-data"><BarChart3 className="inline-icon" /> No customer data available</div>
        )}
      </div>
      <div className="customer-stats">
        <div className="stat-item">
          <span className="stat-label">Active Users:</span>
          <span className="stat-value">{customerData.activeUsers || 0}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Returning Customers:</span>
          <span className="stat-value">{customerData.returningCustomers || 0}</span>
        </div>
      </div>
    </div>
  );
};

export default CustomerGrowthChart;