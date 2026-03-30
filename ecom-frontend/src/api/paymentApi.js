import axios from "axios";
import { jwtDecode } from "jwt-decode";

const BASE_URL = "http://localhost:8083/payment";

// ✅ helper to extract userId
const getUserId = () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token");

  const decoded = jwtDecode(token);
  return decoded.userId;
};

const paymentApi = {
  getWalletBalance: async () => {
    const userId = getUserId();

    const res = await axios.get(`${BASE_URL}/balance/${userId}`);
    return res.data;
  },

  makePayment: async (amount, orderId) => {
    const userId = getUserId();

    const res = await axios.post(`${BASE_URL}/pay`, null, {
      params: {
        userId,
        amount,
        orderId,
      },
    });

    return res.data;
  },
};

export default paymentApi;