import axios from "axios";

const BASE_URL = import.meta.env.VITE_URL;

export const axiosInstance = axios.create({
    baseURL : BASE_URL,
    headers: {
    "Content-Type": "application/json",
  },
    withCredentials: true,
});

// Add request interceptor to include admin token
axiosInstance.interceptors.request.use((config) => {
  const adminToken = localStorage.getItem("adminToken"); 
  if (adminToken) {
    config.headers.token = adminToken;
  }
  return config;
});