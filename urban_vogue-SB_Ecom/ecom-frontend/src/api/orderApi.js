import axios from "axios";
import { jwtDecode } from "jwt-decode";

const BASE_URL = "http://localhost:8082/orders"; // adjust if different

const getUserId = () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token");

  const decoded = jwtDecode(token);
  return decoded.userId;
};

const orderApi = {
  // ✅ Get all orders of user
  getUserOrders: async () => {
    const userId = getUserId();

    const res = await axios.get(`${BASE_URL}/user/${userId}`);
    return res.data;
  },
};

export default orderApi;