import React, { useState, useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store/store";
import ReduxInitializer from "./components/ReduxInitializer/ReduxInitializer";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import Home from "./Pages/Home/Home";
import AboutUs from "./Pages/AboutUs/AboutUs";
import Delivery from "./Pages/Delivery/Delivery";
import PrivacyPolicy from "./Pages/PrivacyPolicy/PrivacyPolicy";
import Cart from "./Pages/Cart/Cart";
import PlaceOrder from "./Pages/PlaceOrder/PlaceOrder";
import LoginPopup from "./components/LoginPopup/LoginPopup";
import Verify from "./Pages/Verify/Verify";
import Profile from "./Pages/Profile/Profile";
import { Toaster } from "react-hot-toast";

const App = () => {
  const [showLogin, setShowLogin] = useState(false);
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <Provider store={store}>
      <ReduxInitializer>
        {showLogin && <LoginPopup setShowLogin={setShowLogin} />}

        <Navbar setShowLogin={setShowLogin} />
        <div className="app">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/delivery" element={<Delivery />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/order" element={<PlaceOrder />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
      <Footer />
        <Toaster
        toastOptions={{
          duration: 4000,
          style: {
            border: "1px solid #1a73e8", 
            background: "#e8f0fe",
            color: "#1a73e8", 
            padding: "12px 16px",
            borderRadius: "8px",
            fontSize: "14px",
          },
        }}
      />
      </ReduxInitializer>
    </Provider>
  );
};

export default App;