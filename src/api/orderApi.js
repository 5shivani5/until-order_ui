import axios from "axios";
import { jwtDecode } from "jwt-decode";

const BASE_URL = "http://localhost:8085/orders";

const getUserId = () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token");
  return jwtDecode(token).userId;
};

const orderApi = {
  getUserOrders: async () => {
    const userId = getUserId();
    const res = await axios.get(`${BASE_URL}/user/${userId}`);
    return res.data;
  },

  placeOrder: async (orderData) => {
    const token    = localStorage.getItem("token");
    const decoded  = jwtDecode(token);
    const userId   = decoded.userId;
    const username = decoded.sub || decoded.username || "";

    const payload = {
      userId,
      username,
      totalAmount: orderData.totalAmount,
      addressLine: orderData.addressLine,
      city:        orderData.city,
      state:       orderData.state,
      pincode:     orderData.pincode,
      items: orderData.items.map((item) => ({
        productId:   String(item.productId),
        productName: item.productName,
        brand:       item.brand    || "",
        imageUrl:    item.imageUrl || "",
        price:       item.price,
        quantity:    item.quantity,
        subtotal:    item.price * item.quantity,
      })),
    };

    const res = await axios.post(`${BASE_URL}/place`, payload);
    return res.data;
  },

  cancelOrder: async (orderId) => {
    const res = await axios.put(`${BASE_URL}/${orderId}/cancel`);
    return res.data;
  },
};

export default orderApi;
