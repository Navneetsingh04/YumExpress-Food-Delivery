import React, { useState } from "react";
import "./LoginPopup.css";
import { assets } from "../../assets/assets";
import { useAppDispatch, useAuth } from "../../store/hooks";
import { loginUser, registerUser } from "../../store/slices/authSlice";
import {toast} from "react-hot-toast";

const LoginPopup = ({ setShowLogin }) => {
  const dispatch = useAppDispatch();
  const { loading } = useAuth();
  const [currentState, setState] = useState("Login");

  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  const onLogin = async (event) => {
    event.preventDefault();
    
    try {
      if (currentState === "Login") {
        await dispatch(loginUser(data)).unwrap();
      } else {
        await dispatch(registerUser(data)).unwrap();
      }
      setShowLogin(false);
      toast.success(`${currentState} successful!`);
    } catch (error) {
      toast.error(error || `${currentState} failed`);
    }
  };

  return (
    <div className="login-popup">
      <form onSubmit={onLogin} className="login-popup-container">
        <div className="login-popup-title">
          <h2>{currentState}</h2>
          <img
            onClick={() => setShowLogin(false)}
            src={assets.cross_icon}
            alt="Close"
          />
        </div>
        <div className="login-popup-inputs">
          {currentState === "Sign Up" && (
            <input
              name="name"
              onChange={onChangeHandler}
              value={data.name}
              type="text"
              placeholder="Your name"
              required
            />
          )}
          <input
            name="email"
            onChange={onChangeHandler}
            value={data.email}
            type="email"
            placeholder="Your email"
            required
          />
          <input
            name="password"
            onChange={onChangeHandler}
            value={data.password}
            type="password"
            placeholder="Password"
            required
          />
        </div>
        <button type="submit">
          {currentState === "Sign Up" ? "Create account" : "Login"}
        </button>
        <div className="login-pop-condition">
          <input type="checkbox" id="terms" />
          <label htmlFor="terms">
            By continuing, I agree to the terms of use & privacy policy.
          </label>
        </div>
        {currentState === "Login" ? (
          <p>
            Don't have an account?{" "}
            <span onClick={() => setState("Sign Up")}>Sign Up here</span>
          </p>
        ) : (
          <p>
            Already have an account?{" "}
            <span onClick={() => setState("Login")}>Login here</span>
          </p>
        )}
      </form>
    </div>
  );
};

export default LoginPopup;
