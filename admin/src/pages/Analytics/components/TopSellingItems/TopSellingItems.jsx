import './TopSellingItems.css';
import '../shared/ChartComponents.css';
import { Trophy,Utensils, Hamburger } from 'lucide-react';
import { getImageUrl } from '../chartUtils';
import { useChartData } from '../../../../store/hooks';

const TopSellingItems = () => {
  const { topSelling } = useChartData();
  const backendUrl = import.meta.env.VITE_URL;
  
  return (
    <div className="analytics-card list-card">
      <div className="card-header">
        <h3><Trophy className="inline-icon" /> Top Selling Items</h3>
        <span className="card-period">Best performers this month</span>
      </div>
      <div className="top-items-list">
        {topSelling?.length > 0 ? (
          topSelling.slice(0, 5).map((item, index) => {
            const imageUrl = getImageUrl(item.image, backendUrl);
            const itemName = item.name || 'Unknown Item';

            return (
              <div key={item._id || index} className="top-item">
                <span className="item-rank">#{index + 1}</span>
                {imageUrl ? (
                  <img 
                    src={imageUrl} 
                    alt={itemName}
                    className="item-image"
                    onError={(e) => {
                      console.error(`Image failed for "${itemName}":`, imageUrl);
                      e.target.style.display = 'none';
                      const fallback = e.target.nextSibling;
                      if (fallback) fallback.style.display = 'flex';
                    }}
                    loading="lazy"
                  />
                ) : null}
                <div 
                  className="item-image-fallback" 
                  style={{
                    display: imageUrl ? 'none' : 'flex',
                    width: '60px',
                    height: '60px',
                    backgroundColor: '#f8f9fa',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid #dee2e6',
                    borderRadius: '8px',
                    fontSize: '24px',
                    color: '#6c757d'
                  }}
                >
                  <Hamburger />
                </div>
                <div className="item-details">
                  <p className="item-name">{itemName}</p>
                  <div className="item-metrics">
                    <span className="item-quantity">
                      {item.totalQuantity || 0} sold
                    </span>
                    <span className="item-revenue">
                      ₹{(item.totalRevenue || 0).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="no-data"><Utensils className="inline-icon" /> No sales data available</div>
        )}
      </div>
    </div>
  );
};

export default TopSellingItems;