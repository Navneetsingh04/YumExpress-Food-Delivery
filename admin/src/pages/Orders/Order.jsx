import React, { useState, useEffect } from "react";
import "./Order.css";
import { toast } from "react-toastify";
import axios from "axios";
import { assets } from "../../../../Frontend/src/assets/assets";

const Order = ({ url }) => {
  const [orders, setOrders] = useState([]);

  const fetchAllOrders = async () => {
    try {
      const response = await axios.get(`${url}/api/order/list`);
      if (response.data.success) {
        setOrders(response.data.data);
      } else {
        toast.error("Error fetching orders");
      }
    } catch (error) {
      console.error("API Error:", error);
      toast.error("Failed to fetch orders");
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
        {orders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          orders.map((order, index) => (
            <div key={order._id || index} className="order-item">
              <img
                src={assets.parcel_icon}
                alt="Parcel Icon"
                className="order-icon"
              />
              <div className="order-details">
                <p className="order-item-food">
                  {order.items
                    .map((item) => `${item.name} x ${item.quantity}`)
                    .join(", ")}
                </p>
                <br />
                <div className="order-item-address">
                  <p><strong>Name:{" "}</strong>{order.userId.name}</p> 
                  <br/>
                  <p><strong>Adress:{" "}</strong>
                  {order.address.street},{" "} <br/>
                    {order.address.city},{" "},{order.address.state},{" "}
                    {order.address.country},{" "} {order.address.zipcode}
                  </p>
                </div>
                <p><strong>Order Time: </strong> {new Date(order.date).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}</p>
                <p className="order-item-phone">Ph: {order.address.phone}</p>
              </div>
              <p>Items: {order.items.length}</p>
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
          ))
        )}
      </div>
    </div>
  );
};

export default Order;
