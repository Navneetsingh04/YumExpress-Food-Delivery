import React, { useContext, useEffect, useState } from "react";
import "./MyOrders.css";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { assets } from "../../assets/assets";
import {toast} from "react-hot-toast";

const MyOrders = () => {
  const { url, token } = useContext(StoreContext);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!token) {
        setError("Please login to view your orders");
        setLoading(false);
        return;
      }

      const response = await axios.post(
        url + "/api/order/userorders",
        {},
        { headers: { token } }
      );

      if (response.data.success) {
        const formattedOrders = response.data.data.map((order) => ({
          ...order,
          formattedDate: new Date(order.date).toLocaleDateString("en-GB"),
        }));

        setData(formattedOrders);
      } else {
        console.error("Order fetch failed:", response.data);
        setError(response.data.message || "Failed to fetch orders");
        toast.error(response.data.message || "Failed to fetch orders");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      console.error("Error details:", error.response?.data);
      setError("Network error while fetching orders");
      toast.error("Failed to fetch orders. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token]);

  return (
    <div className="my-orders">
      <h2>My Orders</h2>
      <div className="container">
        {loading && <div className="loading">Loading your orders...</div>}
        
        {error && <div className="error-message">{error}</div>}
        
        {!loading && !error && data.length === 0 && (
          <div className="no-orders">
            <p>You haven't placed any orders yet.</p>
          </div>
        )}
        
        {!loading && !error && data.length > 0 && data.map((order, index) => (
          <div key={order._id || index} className="my-orders-order">
            <img src={assets.parcel_icon} alt="Parcel Icon" />
            <p>
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
            <p>₹{order.amount}.00</p>
            <p>Items: {order.items ? order.items.length : 0}</p>
            <p className="order-date">📅 {order.formattedDate}</p>
            <p>
              <span>&#x25cf;&nbsp;</span>
              <b>{order.status}</b>
            </p>
            <button onClick={fetchOrders}>Track Order</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyOrders;
