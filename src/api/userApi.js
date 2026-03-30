import axios from "axios";

const BASE_URL = "http://localhost:8084/api/auth";

// ✅ REGISTER API
export const registerUser = async (userData) => {
  const response = await axios.post(`${BASE_URL}/signup`, userData);
  return response.data;
};

// ✅ LOGIN API
export const loginUser = async (userData) => {
  const response = await axios.post(`${BASE_URL}/login`, userData);
  return response.data;
};

// ✅ AXIOS INSTANCE (for JWT later)
export const api = axios.create({
  baseURL: "http://localhost:8084",
});

// ✅ INTERCEPTOR (attach token)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});