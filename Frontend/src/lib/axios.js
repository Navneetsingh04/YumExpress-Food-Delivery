import axios from "axios";

const BASE_URL = import.meta.env.VITE_URL;

export const axiosInstance = axios.create({
    baseURL : BASE_URL,
    headers: {
    "Content-Type": "application/json",
  },
    withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); 
  if (token) {
    config.headers.token = token;
  }
  return config;
});