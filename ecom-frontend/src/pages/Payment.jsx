import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import orderApi from "../api/orderApi";
import cartApi from "../api/cartApi";
import bgImage from "../assets/background.png";

const PAYMENT_BASE_URL = "http://localhost:8087/payment";

export default function Payment() {
  const navigate = useNavigate();
  const location = useLocation();

  const [wallet, setWallet] = useState(0);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState("");
  const [processing, setProcessing] = useState(false);

  // Address fields
  const [addressLine, setAddressLine] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");

  const totalAmount = location.state?.amount || 0;
  const items = location.state?.items || [];

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  const getUserId = () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");
      return jwtDecode(token).userId;
    } catch (err) {
      console.error("Token error:", err);
      showToast("Session expired. Please login again.");
      navigate("/login");
      return null;
    }
  };

  // Load wallet balance
  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const userId = getUserId();
        if (!userId) return;
        const res = await axios.get(`${PAYMENT_BASE_URL}/balance/${userId}`);
        setWallet(res.data);
      } catch (err) {
        console.error("Wallet error:", err);
        showToast("Error loading wallet");
      } finally {
        setLoading(false);
      }
    };
    fetchWallet();
  }, []);

  const handlePayment = async () => {
    // Validate address
    if (!addressLine.trim() || !city.trim() || !state.trim() || !pincode.trim()) {
      showToast("Please fill in all address fields");
      return;
    }

    try {
      setProcessing(true);

      const userId = getUserId();
      if (!userId) return;

      // 1. Place the order first
      const order = await orderApi.placeOrder({
        totalAmount,
        addressLine,
        city,
        state,
        pincode,
        items,
      });

      // 2. Make the payment with the real orderId from the saved order
      await axios.post(`${PAYMENT_BASE_URL}/pay`, null, {
        params: {
          userId,
          amount: totalAmount,
          orderId: order.id,
        },
      });

      // 3. Clear the cart
      try {
        await cartApi.clearCart();
      } catch (_) {
        // non-critical — order and payment already succeeded
      }

      showToast("Payment Successful! Redirecting to your orders...");
      setTimeout(() => navigate("/orders"), 1800);
    } catch (err) {
      console.error("Payment error:", err);
      showToast("Payment Failed. Please try again.");
      setProcessing(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.overlay} />

      <div style={styles.content}>
        <h1>Payment</h1>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div style={styles.card}>
            <p>Wallet Balance: ₹{fmt(wallet)}</p>
            <p>Total Amount: ₹{fmt(totalAmount)}</p>

            {/* Delivery Address */}
            <h3 style={styles.sectionTitle}>Delivery Address</h3>
            <input
              style={styles.input}
              placeholder="Address Line"
              value={addressLine}
              onChange={(e) => setAddressLine(e.target.value)}
            />
            <input
              style={styles.input}
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            <input
              style={styles.input}
              placeholder="State"
              value={state}
              onChange={(e) => setState(e.target.value)}
            />
            <input
              style={styles.input}
              placeholder="Pincode"
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
            />

            {wallet >= totalAmount ? (
              <button
                style={styles.payBtn}
                onClick={handlePayment}
                disabled={processing}
              >
                {processing ? "Processing..." : "Pay Now"}
              </button>
            ) : (
              <p style={{ color: "red", marginTop: "20px" }}>
                Insufficient Balance
              </p>
            )}
          </div>
        )}
      </div>

      {toast && <div style={styles.toast}>{toast}</div>}
    </div>
  );
}

const fmt = (n) =>
  Number(n).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const styles = {
  container: {
    minHeight: "100vh",
    backgroundImage: `url(${bgImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    position: "relative",
    fontFamily: "Georgia",
  },
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.7)",
  },
  content: {
    position: "relative",
    zIndex: 1,
    color: "#fff",
    padding: "120px 30px",
    textAlign: "center",
  },
  card: {
    margin: "0 auto",
    padding: "24px",
    background: "rgba(255,255,255,0.1)",
    maxWidth: "420px",
    borderRadius: "8px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  sectionTitle: {
    marginTop: "10px",
    marginBottom: "4px",
    textAlign: "left",
    fontSize: "14px",
    letterSpacing: "1px",
    color: "#ccc",
  },
  input: {
    padding: "10px",
    borderRadius: "4px",
    border: "1px solid rgba(255,255,255,0.3)",
    background: "rgba(255,255,255,0.1)",
    color: "#fff",
    fontSize: "14px",
    fontFamily: "Georgia",
    width: "100%",
    boxSizing: "border-box",
  },
  payBtn: {
    marginTop: "14px",
    padding: "12px 20px",
    background: "#fff",
    color: "#000",
    border: "none",
    cursor: "pointer",
    fontFamily: "Georgia",
    fontSize: "15px",
    borderRadius: "4px",
  },
  toast: {
    position: "fixed",
    bottom: "20px",
    left: "50%",
    transform: "translateX(-50%)",
    background: "#000",
    color: "#fff",
    padding: "10px 20px",
    borderRadius: "4px",
    zIndex: 10,
  },
};
