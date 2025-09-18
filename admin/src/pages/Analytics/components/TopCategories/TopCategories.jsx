import React from 'react';
import './TopCategories.css';
import '../shared/ChartComponents.css';
import { UtensilsCrossed } from 'lucide-react';
import { useSelector } from 'react-redux';

const TopCategories = () => {
  const topMetrics = useSelector((state) => state.analytics.topMetrics || {});
  return (
    <div className="analytics-card list-card">
      <div className="card-header">
        <h3>🏷️ Top Categories</h3>
        <span className="card-period">Most popular food types</span>
      </div>
      <div className="top-categories-list">
        {topMetrics.topCategories?.length > 0 ? (
          topMetrics.topCategories.map((category, index) => (
            <div key={index} className="category-item">
              <div className="category-info">
                <span className="category-rank">#{index + 1}</span>
                <span className="category-name">
                  <UtensilsCrossed className="inline-icon" /> {category._id}
                </span>
              </div>
              <div className="category-metrics">
                <span className="category-quantity">{category.totalQuantity} sold</span>
                <span className="category-revenue">₹{category.totalRevenue?.toLocaleString()}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="no-data">🏷️ No category data available</div>
        )}
      </div>
    </div>
  );
};

export default TopCategories;