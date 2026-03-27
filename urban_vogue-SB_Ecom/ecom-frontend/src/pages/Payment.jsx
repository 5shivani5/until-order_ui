import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import bgImage from "../assets/background.png";

const BASE_URL = "http://localhost:8083/payment";

export default function Payment() {
  const navigate = useNavigate();
  const location = useLocation();

  const [wallet, setWallet] = useState(0);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState("");
  const [processing, setProcessing] = useState(false);

  const totalAmount = location.state?.amount || 0;

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  // ✅ Extract userId from JWT
  const getUserId = () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const decoded = jwtDecode(token);
      return decoded.userId;
    } catch (err) {
      console.error("Token error:", err);
      showToast("Session expired. Please login again.");
      navigate("/login");
      return null;
    }
  };

  // ✅ Load wallet balance
  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const userId = getUserId();
        if (!userId) return;

        const res = await axios.get(`${BASE_URL}/balance/${userId}`);
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

  // ✅ Handle payment
  const handlePayment = async () => {
    try {
      setProcessing(true);

      const userId = getUserId();
      if (!userId) return;

      await axios.post(`${BASE_URL}/pay`, null, {
        params: {
          userId,
          amount: totalAmount,
          orderId: 1, // replace later dynamically
        },
      });

      showToast("Payment Successful");

      setTimeout(() => {
        navigate("/orders");
      }, 1500);
    } catch (err) {
      console.error("Payment error:", err);
      showToast("Payment Failed");
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

/* ─── Helpers ─── */
const fmt = (n) =>
  Number(n).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

/* ─── Styles ─── */
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
    padding: "20px",
    background: "rgba(255,255,255,0.1)",
    maxWidth: "400px",
    borderRadius: "8px",
  },
  payBtn: {
    marginTop: "20px",
    padding: "10px 20px",
    background: "#fff",
    border: "none",
    cursor: "pointer",
  },
  toast: {
    position: "fixed",
    bottom: "20px",
    left: "50%",
    transform: "translateX(-50%)",
    background: "#000",
    color: "#fff",
    padding: "10px 20px",
  },
};