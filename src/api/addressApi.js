import axios from "axios";
import { jwtDecode } from "jwt-decode";

const BASE_URL = "http://localhost:8084/api/address";

const getUserId = () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token");
  return jwtDecode(token).userId;
};

const addressApi = {
  // Get all saved addresses
  getAddresses: async () => {
    const userId = getUserId();
    const res = await axios.get(`${BASE_URL}/${userId}`);
    return res.data;
  },

  // Add a new address
  addAddress: async (addressData) => {
    const userId = getUserId();
    const res = await axios.post(`${BASE_URL}/${userId}`, addressData);
    return res.data;
  },

  // Set an address as default
  setDefault: async (addressId) => {
    const userId = getUserId();
    const res = await axios.put(`${BASE_URL}/${userId}/${addressId}/default`);
    return res.data;
  },

  // Delete an address
  deleteAddress: async (addressId) => {
    const userId = getUserId();
    await axios.delete(`${BASE_URL}/${userId}/${addressId}`);
  },
};

export default addressApi;
