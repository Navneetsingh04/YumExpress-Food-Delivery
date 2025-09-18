import React from 'react';
import "./RevenueChart.css";
import { Line } from 'react-chartjs-2';
import { IndianRupee, BarChart3 } from 'lucide-react';
import { lineChartOptions, formatDateLabel, groupDataByPeriod, fillMissingWeeks, formatWeekLabelForDisplay } from '../chartUtils';
import { useChartData } from '../../../../store/hooks';
import { useSelector } from 'react-redux';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const RevenueChart = () => {
  const { revenue } = useChartData();
  const selectedPeriod = useSelector((state) => state.analytics.selectedPeriod);
  const revenueStats = useSelector((state) => state.analytics.revenueStats);

  if (!revenue || !Array.isArray(revenue)) {
    return (
      <div className="analytics-card chart-card wide-card">
        <div className="card-header">
          <h3><IndianRupee className="inline-icon" /> Revenue Trend</h3>
          <span className="card-period">Performance over time</span>
        </div>
        <div className="chart-container">
          <div className="no-data"><BarChart3 className="inline-icon" /> No revenue data available</div>
        </div>
        <RevenueStats revenueData={revenueStats} />
      </div>
    );
  }

  // Transform and process the data based on selected period
  const transformedData = revenue.map(item => ({
    date: item._id,
    revenue: item.revenue,
    total: item.total
  }));
  const groupedData = groupDataByPeriod(transformedData, selectedPeriod);
  const processedRevenue = fillMissingWeeks(groupedData, selectedPeriod);

  if (processedRevenue.length === 0) {
    return (
      <div className="analytics-card chart-card wide-card">
        <div className="card-header">
          <h3><IndianRupee className="inline-icon" /> Revenue Trend</h3>
          <span className="card-period">Performance over time</span>
        </div>
        <div className="chart-container">
          <div className="no-data"><BarChart3 className="inline-icon" /> No revenue data for selected period</div>
        </div>
        <RevenueStats revenueData={revenueStats} />
      </div>
    );
  }

  const chartLabels = selectedPeriod === 'weekly' 
    ? processedRevenue.map(item => formatWeekLabelForDisplay(item.date))
    : processedRevenue.map(item => formatDateLabel(item.date, selectedPeriod));

  const chartData = processedRevenue.map(item =>
    Number(item.revenue) || Number(item.total) || 0
  );

  const hasValidData = chartData.some(value => value > 0);

  const revenueChartData = {
    labels: chartLabels,
    datasets: [{
      label: 'Revenue (₹)',
      data: chartData,
      borderColor: 'rgba(46, 204, 113, 1)',
      backgroundColor: 'rgba(46, 204, 113, 0.1)',
      tension: 0.4,
      fill: true,
      pointBackgroundColor: 'rgba(46, 204, 113, 1)',
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
      pointRadius: 5,
      pointHoverRadius: 7,
    }]
  };

  const enhancedChartOptions = {
    ...lineChartOptions,
    plugins: {
      ...lineChartOptions.plugins,
      tooltip: {
        callbacks: {
          label: context => `Revenue: ₹${context.parsed.y.toLocaleString()}`
        }
      }
    },
    scales: {
      ...lineChartOptions.scales,
      y: {
        ticks: {
          callback: value => '₹' + value.toLocaleString()
        }
      }
    }
  };

  return (
    <div className="analytics-card chart-card wide-card">
      <div className="card-header">
        <h3><IndianRupee className="inline-icon" /> Revenue Trend</h3>
        <span className="card-period">Performance over time ({selectedPeriod})</span>
      </div>
      <div className="chart-container">
        {chartLabels.length > 0 && hasValidData ? (
          <Line data={revenueChartData} options={enhancedChartOptions} />
        ) : (
          <div className="no-data">
            <BarChart3 className="inline-icon" /> No revenue recorded for selected period
          </div>
        )}
      </div>
      <RevenueStats revenueData={revenueStats} />
    </div>
  );
};

const RevenueStats = ({ revenueData }) => (
  <div className="revenue-stats">
    <div className="revenue-card">
      <div className="revenue-card-label">TOTAL ORDERS:</div>
      <div className="revenue-card-value">{revenueData?.totalOrders || 0}</div>
    </div>
    <div className="revenue-card">
      <div className="revenue-card-label">TOTAL REVENUE:</div>
      <div className="revenue-card-value">₹{(revenueData?.totalRevenue || 0).toLocaleString()}</div>
    </div>
    <div className="revenue-card">
      <div className="revenue-card-label">AVERAGE ORDER VALUE:</div>
      <div className="revenue-card-value">₹{Math.round(revenueData?.averageOrderValue || 0).toLocaleString()}</div>
    </div>
  </div>
);

export default RevenueChart;
