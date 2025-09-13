import React, { useState, useEffect } from "react";
import "./Order.css";
import {toast} from "react-hot-toast";
import axios from "axios";
import { assets } from "../../../../Frontend/src/assets/assets";

const Order = ({ url }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAllOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(`${url}/api/order/list`);

      if (response.data.success) {
        setOrders(response.data.data);
      } else {
        setError("Error fetching orders");
        toast.error("Error fetching orders");
      }
    } catch (error) {
      console.error("API Error:", error);
      console.error("Error details:", error.response?.data);
      setError("Failed to fetch orders");
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const statusHandler = async (event, orderId) => {
    try {
      const response = await axios.post(url + "/api/order/status", {
        orderId,
        status: event.target.value,
     });
      if (response.data.success) {
        await fetchAllOrders();
      }
      else{
        toast.error("Failed to update status");
      }
    } catch (error) {
      console.error("Status Update Error:", error);
      toast.error("Error updating order status");
    }
};

  useEffect(() => {
    fetchAllOrders();
  }, []);

  return (
    <div className="order-container">
      <h3>Order Page</h3>
      <div className="order-list">
        {loading && <div className="loading">Loading orders...</div>}
        
        {error && <div className="error-message">{error}</div>}
        
        {!loading && !error && orders.length === 0 && (
          <div className="no-orders">
            <p>No orders found.</p>
          </div>
        )}
        
        {!loading && !error && orders.length > 0 && orders.map((order, index) => (
          <div key={order._id || index} className="order-item">
            <img
              src={assets.parcel_icon}
              alt="Parcel Icon"
              className="order-icon"
            />
            <div className="order-details">
              <p className="order-item-food">
                {order.items && order.items.length > 0
                  ? order.items
                      .map((item) => {
                        // Handle both old and new data structures
                        const itemName = item.name || `Item ${item.foodId || item._id}`;
                        const quantity = item.quantity || 1;
                        return `${itemName} x ${quantity}`;
                      })
                      .join(", ")
                  : "No items found"
                }
              </p>
              <br />
              <div className="order-item-address">
                <p><strong>User Name: </strong>
                  {order.address?.firstName && order.address?.lastName 
                    ? `${order.address.firstName} ${order.address.lastName}` 
                    : order.userId?.name || 'Unknown'
                  }
                </p> 
                <br/>
                <p><strong>Address: </strong>
                {order.address ? (
                  <>
                    {order.address.street}, <br/>
                    {order.address.city}, {order.address.state}, 
                    {order.address.country}, {order.address.zipcode}
                  </>
                ) : 'Address not available'}
                </p>
                <p><strong>Email: </strong>{order.address?.email || 'Not provided'}</p>
              </div>
              <p><strong>Order Time: </strong> {new Date(order.date).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}</p>
              <p className="order-item-phone">Ph: {order.address?.phone || 'Not provided'}</p>
            </div>
            <p>Items: {order.items ? order.items.length : 0}</p>
            <p className="order-amount">₹{order.amount}</p>
            <select
              onChange={(event) => statusHandler(event, order._id)}
              value={order.status}
            >
              <option value="Food Processing">Food Processing</option>
              <option value="Out for delivery">Out for delivery</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Order;
