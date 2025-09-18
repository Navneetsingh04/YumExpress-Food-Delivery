import React from "react";
import "../shared/ChartComponents.css";
import { Doughnut } from "react-chartjs-2";
import { FileText, BarChart3 } from "lucide-react";
import { doughnutOptions } from "../chartUtils";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useChartData } from "../../../../store/hooks";

// Register Chart.js components for Doughnut chart
ChartJS.register(ArcElement, Tooltip, Legend);

const OrderStatusChart = () => {
  const { orderStatus } = useChartData();
  
  if (!orderStatus || orderStatus.length === 0) {
    console.warn("OrderStatusChart - orderStatus data is not available");
    return (
      <div className="analytics-card chart-card">
        <div className="card-header">
          <h3>
            <FileText className="inline-icon" /> Order Status Distribution
          </h3>
          <span className="card-period">Current status breakdown</span>
        </div>
        <div className="chart-container">
          <div className="no-data">
            <BarChart3 className="inline-icon" /> No order data available
          </div>
        </div>
      </div>
    );
  }

  // Check if orderStatus exists and is an array
  if (!orderStatus || !Array.isArray(orderStatus)) {
    console.warn(
      "OrderStatusChart - orderStatus is not an array or is missing:",
      orderStatus
    );
    return (
      <div className="analytics-card chart-card">
        <div className="card-header">
          <h3>
            <FileText className="inline-icon" /> Order Status Distribution
          </h3>
          <span className="card-period">Current status breakdown</span>
        </div>
        <div className="chart-container">
          <div className="no-data">
            <BarChart3 className="inline-icon" /> No status data available
          </div>
        </div>
      </div>
    );
  }

  // Filter out invalid entries and validate data structure
  const validStatusData = orderStatus.filter((item) => {
    const isValid =
      item &&
      typeof item._id === "string" &&
      item._id.trim() !== "" &&
      typeof item.count === "number" &&
      item.count > 0;

    if (!isValid) {
      console.warn("OrderStatusChart - Invalid status item:", item);
    }
    return isValid;
  });

  // If no valid data after filtering
  if (validStatusData.length === 0) {
    console.warn("OrderStatusChart - No valid status data after filtering");
    return (
      <div className="analytics-card chart-card">
        <div className="card-header">
          <h3>
            <FileText className="inline-icon" /> Order Status Distribution
          </h3>
          <span className="card-period">Current status breakdown</span>
        </div>
        <div className="chart-container">
          <div className="no-data">
            <BarChart3 className="inline-icon" /> No valid order status data
          </div>
        </div>
      </div>
    );
  }

  const formatStatusName = (status) => {
    if (!status || typeof status !== "string") return "Unknown";

    const cleanStatus = status.trim();

    // Convert common status variations
    const statusMap = {
      "Food Processing": "Processing",
      "Out for Delivery": "Out for Delivery",
      delivered: "Delivered",
      cancelled: "Cancelled",
      pending: "Pending",
      confirmed: "Confirmed",
    };
    return (
      statusMap[cleanStatus] ||
      cleanStatus.charAt(0).toUpperCase() + cleanStatus.slice(1).toLowerCase()
    );
  };

  // Generate labels with proper formatting
  const chartLabels = validStatusData.map((item) => {
    const formattedLabel = formatStatusName(item._id);
    return formattedLabel;
  });

  // Extract data values
  const chartData = validStatusData.map((item) => item.count);

  const getStatusColor = (status, opacity = 0.8) => {
    const colors = {
      Delivered: `rgba(46, 204, 113, ${opacity})`, // Green
      Processing: `rgba(241, 196, 15, ${opacity})`, // Yellow
      Confirmed: `rgba(52, 152, 219, ${opacity})`, // Blue
      Cancelled: `rgba(231, 76, 60, ${opacity})`, // Red
      Pending: `rgba(155, 89, 182, ${opacity})`, // Purple
      "Out for Delivery": `rgba(230, 126, 34, ${opacity})`, // Orange
      Preparing: `rgba(26, 188, 156, ${opacity})`, // Teal
      Ready: `rgba(39, 174, 96, ${opacity})`, // Dark Green
    };

    return colors[status] || `rgba(149, 165, 166, ${opacity})`; // Default gray
  };

  // Generate dynamic colors based on actual status names
  const backgroundColors = chartLabels.map((label) =>
    getStatusColor(label, 0.8)
  );
  const borderColors = chartLabels.map((label) => getStatusColor(label, 1));

  const orderStatusData = {
    labels: chartLabels,
    datasets: [
      {
        data: chartData,
        backgroundColor: backgroundColors,
        borderColor: borderColors,
        borderWidth: 2,
      },
    ],
  };

  // Enhanced doughnut options with better formatting
  const enhancedDoughnutOptions = {
    ...doughnutOptions,
    plugins: {
      ...doughnutOptions?.plugins,
      legend: {
        ...doughnutOptions?.plugins?.legend,
        position: "bottom",
        labels: {
          padding: 15,
          usePointStyle: true,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        ...doughnutOptions?.plugins?.tooltip,
        callbacks: {
          label: function (context) {
            const label = context.label || "";
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage =
              total > 0 ? ((value / total) * 100).toFixed(1) : 0;
            return `${label}: ${value} orders (${percentage}%)`;
          },
        },
      },
    },
    maintainAspectRatio: false,
    responsive: true,
  };

  return (
    <div className="analytics-card chart-card">
      <div className="card-header">
        <h3>
          <FileText className="inline-icon" /> Order Status Distribution
        </h3>
        <span className="card-period">Current status breakdown</span>
      </div>
      <div className="chart-container">
        <Doughnut data={orderStatusData} options={enhancedDoughnutOptions} />
      </div>
    </div>
  );
};

export default OrderStatusChart;
