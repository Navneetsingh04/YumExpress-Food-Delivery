import React, { useContext, useEffect, useState } from "react";
import "./MyOrders.css";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { assets } from "../../assets/assets";

const MyOrders = () => {
  const { url, token } = useContext(StoreContext);
  const [data, setData] = useState([]);

  const fetchOrders = async () => {
    try {
      const response = await axios.post(
        url + "/api/order/userorders",
        {},
        { headers: { token } }
      );
      const formattedOrders = response.data.data.map((order) => ({
        ...order,
        formattedDate: new Date(order.date).toLocaleDateString("en-GB"),
      }));

      setData(formattedOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
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
        {data.map((order, index) => (
          <div key={index} className="my-orders-order">
            <img src={assets.parcel_icon} alt="Parcel Icon" />
            <p>
              {order.items
                .map((item) => `${item.name} x ${item.quantity}`)
                .join(", ")}
            </p>
            <p>₹{order.amount}.00</p>
            <p>Items: {order.items.length}</p>
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
