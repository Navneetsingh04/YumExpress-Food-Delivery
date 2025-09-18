import React from 'react';
import './AnalyticsHeader.css';
import { BarChart3, RefreshCcw } from 'lucide-react';

const AnalyticsHeader = ({ selectedPeriod, onPeriodChange, onRefresh }) => {
  return (
    <div className="analytics-header">
      <div className="header-content">
        <div className="header-text">
          <h1><BarChart3 className="inline-icon-header"/> Analytics Dashboard</h1>
          <p>Monitor your business performance and key metrics</p>
        </div>
        <div className="header-controls">
          <div className="period-selector">
            <label>Time Period:</label>
            <select 
              value={selectedPeriod} 
              onChange={(e) => onPeriodChange(e.target.value)}
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
          <button 
            className="refresh-btn"
            onClick={onRefresh}
            title="Refresh Data"
          >
            <RefreshCcw size={22} />
            <span>Refresh</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsHeader;