import React, { useContext, useEffect, useState } from "react";
import axios from "axios"; 
import "./PlaceOrder.css";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const PlaceOrder = () => {
  const { getTotalCartAmount, token, food_list, cartItem, url } =
    useContext(StoreContext);

  const [openRazorpay, setOpenRazorpay] = useState(false);
  const [orderCreatedData, setOrderCreatedData] = useState(null);

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  const placeOrder = async (event) => {
    event.preventDefault();

    if (!token) {
      toast.error("You must be logged in to place an order.");
      return;
    }

    if (!food_list || !cartItem) {
      toast.error("Your cart is empty.");
      return;
    }

    let orderItems = [];
    food_list.forEach((item) => {
      if (cartItem[item._id] && cartItem[item._id] > 0) {
        orderItems.push({ ...item, quantity: cartItem[item._id] });
      }
    });

    const orderData = {
      userId: token,
      items: orderItems,
      amount: getTotalCartAmount() + 40,
      address: data,
      payment: false,
    };

    try {
      let response = await axios.post(url + "/api/order/place", orderData, {
        headers: { token },
      });

      if (response.data.success) {
        const { amount, orderId } = response.data;
        setOrderCreatedData({ amount, orderId });
        setOpenRazorpay(true);
      } else {
        toast.error(`Order failed. Please try again.`);
      }
    } catch (error) {
      toast.error("An error occurred while placing the order. Please try again.");
    }
  };

  const subtotal = getTotalCartAmount();
  const deliveryFee = subtotal > 0 ? (subtotal > 199 ? 0 : 40) : 0;
  const total = subtotal + deliveryFee;

  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/cart");
    } else if (getTotalCartAmount() === 0) {
      navigate("/cart");
    }
  }, [token]);

  // --------------------- Razorpat Start -----------------------------------------
  function loadScript(src) {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  }

  async function displayRazorpay() {
    const res = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );

    if (!res) {
      toast.error("Razorpay failed to load. Please try again later.");
      return;
    }

    const {
      data: { razorpay_key_id },
    } = await axios.get(url + "/api/payment/get-razorpay-key-id", {
      headers: { token },
    });
    // --------------------------------------

    const {
      data: { order_id, currency, amount },
    } = await axios.post(
      url + "/api/payment/order",
      {
        amount: orderCreatedData?.amount,
        orderId: orderCreatedData?.orderId,
      },
      {
        headers: { token },
      }
    );

    // --------------------------------------

    const options = {
      key: razorpay_key_id, // Enter the Key ID generated from the Dashboard
      amount: amount,
      currency: currency,
      name: "Yumm Express",
      description: "Transaction",
      order_id: order_id,
      handler: async function (response) {
        console.log(response, "response");
        toast.success("Payment successful");

        const verifyPayment = await axios.post(
          url + "/api/payment/verify",
          {
            orderId: orderCreatedData?.orderId,
          },
          {
            headers: { token },
          }
        );
        if (verifyPayment.data.success) {
          alert("Payment successful");
          toast.success("Order placed successfully!");
          navigate("/myorders");
        }
      },
      prefill: {
        name: "Navneet Singh",
        email: "navneetsingh1825@gmail.com",
        contact: "86760769369",
      },
      notes: {
        address: "Razorpay Corporate Office",
      },
      theme: {
        color: "#038C3E",
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  }

  useEffect(() => {
    if (openRazorpay && orderCreatedData) {
      displayRazorpay();
    }
  }, [openRazorpay]);

  // --------------------- Razorpat End -----------------------------------------

  return (
    <form onSubmit={placeOrder} className="place-order">
      <div className="place-order-left">
        <p className="title">Delivery Information</p>
        <div className="multi-fields">
          <input
            name="firstName"
            onChange={onChangeHandler}
            value={data.firstName}
            type="text"
            placeholder="First Name"
            required
          />
          <input
            name="lastName"
            onChange={onChangeHandler}
            value={data.lastName}
            type="text"
            placeholder="Last Name"
            required
          />
        </div>
        <input
          name="email"
          onChange={onChangeHandler}
          value={data.email}
          type="email"
          placeholder="Email address"
          required
        />
        <input
          name="street"
          onChange={onChangeHandler}
          value={data.street}
          type="text"
          placeholder="Street"
          required
        />
        <div className="multi-fields">
          <input
            name="city"
            onChange={onChangeHandler}
            value={data.city}
            type="text"
            placeholder="City"
            required
          />
          <input
            name="state"
            onChange={onChangeHandler}
            value={data.state}
            type="text"
            placeholder="State"
            required
          />
        </div>
        <div className="multi-fields">
          <input
            name="zipcode"
            onChange={onChangeHandler}
            value={data.zipcode}
            type="text"
            placeholder="Pin Code"
            required
          />
          <input
            name="country"
            onChange={onChangeHandler}
            value={data.country}
            type="text"
            placeholder="Country"
            required
          />
        </div>
        <input
          name="phone"
          onChange={onChangeHandler}
          value={data.phone}
          type="text"
          placeholder="Phone"
          required
        />
      </div>

      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Total</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>₹{subtotal}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>₹{deliveryFee}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>₹{total}</b>
            </div>
          </div>
          <button type="submit" disabled={subtotal === 0}>
            Proceed to Payment
          </button>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
