import './SummaryCards.css';
import { 
  ChartLine, 
  ReceiptIndianRupee, 
  Users, 
  UtensilsCrossed 
} from 'lucide-react';
import { useAnalyticsSummary } from '../../../../store/hooks';

const SummaryCards = () => {
  const summary = useAnalyticsSummary();
  const cards = [
    {
      key: 'orders',
      title: "Today's Orders",
      value: summary.todayOrders || 0,
      subtitle: "Orders placed today",
      icon: <ChartLine size={24} />,
      className: "summary-orders-card"
    },
    {
      key: 'revenue',
      title: "Today's Revenue",
      value: `₹${(summary.todayRevenue || 0).toLocaleString()}`,
      subtitle: "Revenue generated today",
      icon: <ReceiptIndianRupee size={24} />,
      className: "summary-revenue-card"
    },
    {
      key: 'customers',
      title: "Total Customers",
      value: (summary.totalCustomers || 0).toLocaleString(),
      subtitle: "Registered users",
      icon: <Users size={24} />,
      className: "summary-customers-card"
    },
    {
      key: 'items',
      title: "Food Items",
      value: summary.totalFoodItems || 0,
      subtitle: "Available menu items",
      icon: <UtensilsCrossed size={24} />,
      className: "summary-items-card"
    }
  ];

  return (
    <div className="analytics-summary">
      {cards.map((card) => (
        <div key={card.key} className={`summary-card ${card.className}`}>
          <div className="card-icon">{card.icon}</div>
          <div className="card-content">
            <h3>{card.title}</h3>
            <p className="summary-number">{card.value}</p>
            <span className="card-subtitle">{card.subtitle}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SummaryCards;
