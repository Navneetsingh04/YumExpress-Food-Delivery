import React from 'react';
import './LoadingState.css';
import { RefreshCcw } from 'lucide-react';

const LoadingState = ({ loading, error, onRetry }) => {
  if (loading) {
    return (
      <div className="analytics-loading">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <h3>Loading Analytics...</h3>
          <p>Fetching your business insights</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="analytics-error">
        <div className="error-container">
          <div className="error-icon"></div>
          <h3>Unable to Load Analytics</h3>
          <p>{error}</p>
          <button 
            className="retry-btn"
            onClick={onRetry}
          >
            <RefreshCcw size={16} />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default LoadingState;