import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import orderApi from "../api/orderApi";
import bgImage from "../assets/background.png";

/* ---------- STATUS ---------- */
const STATUS_META = {
  PLACED: { color: "#facc15", label: "Placed", step: 0 },
  CONFIRMED: { color: "#38bdf8", label: "Confirmed", step: 1 },
  DELIVERED: { color: "#22c55e", label: "Delivered", step: 2 },
  CANCELLED: { color: "#ef4444", label: "Cancelled", step: -1 },
};

const STEPS = ["Placed", "Confirmed", "Delivered"];

/* ---------- STATUS TRACKER ---------- */
function StatusTracker({ status }) {
  const meta = STATUS_META[status] || STATUS_META.PLACED;

  if (status === "CANCELLED") {
    return <p style={{ color: "#ff8080" }}>✖ Order Cancelled</p>;
  }

  return (
    <div style={{ display: "flex", gap: 20, marginTop: 10 }}>
      {STEPS.map((step, i) => (
        <span
          key={i}
          style={{
            color: i <= meta.step ? meta.color : "#555",
            fontWeight: i === meta.step ? "bold" : "normal",
          }}
        >
          {step}
        </span>
      ))}
    </div>
  );
}

/* ---------- MAIN ---------- */
export default function Orders() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    orderApi
      .getUserOrders()
      .then(setOrders)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={s.container}>
      <div style={s.overlay} />

      <div style={s.content}>
        {/* ✅ TOP SUCCESS */}
        <div style={orderStyles.card}>
          <h1 style={orderStyles.title}>Payment Successful ✅</h1>

          <p style={orderStyles.subText}>
            Your order has been placed successfully.
          </p>

          <div style={orderStyles.buttonRow}>
            <button
              style={orderStyles.primaryBtn}
              onClick={() => setShowHistory(true)}
            >
              Show Order History
            </button>

            <button
              style={orderStyles.secondaryBtn}
              onClick={() => navigate("/products")}
            >
              Continue Shopping
            </button>
          </div>
        </div>

        {/* ✅ HISTORY */}
        {showHistory && (
          <>
            <h1 style={s.title}>My Orders</h1>
            <p style={s.subtitle}>
              Track and manage all your purchases
            </p>

            {loading && <p style={{ color: "#aaa" }}>Loading...</p>}

            {!loading &&
              orders.map((order) => {
                const meta = STATUS_META[order.status] || STATUS_META.PLACED;

                return (
                  <div key={order.id} style={s.card}>
                    <div>
                      <span style={s.orderId}>Order #{order.id}</span>
                      <span style={{ marginLeft: 10, color: meta.color }}>
                        {meta.label}
                      </span>
                    </div>

                    <p style={s.orderMeta}>
                      ₹{order.totalAmount}
                    </p>

                    <StatusTracker status={order.status} />
                  </div>
                );
              })}
          </>
        )}
      </div>
    </div>
  );
}

/* ---------- MAIN STYLES ---------- */
const s = {
  container: {
    minHeight: "100vh",
    backgroundImage: `url(${bgImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundAttachment: "fixed",
    position: "relative",
    fontFamily: "Georgia",
  },

  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.80)",
    zIndex: 0,
  },

  content: {
    position: "relative",
    zIndex: 1,
    padding: "120px 20px",
    maxWidth: "800px",
    margin: "0 auto",
    color: "#fff",
  },

  title: {
    fontSize: "32px",
    marginBottom: "10px",
  },

  subtitle: {
    color: "#aaa",
    marginBottom: "20px",
  },

  card: {
    background: "rgba(255,255,255,0.08)",
    padding: "20px",
    marginBottom: "15px",
    borderRadius: "8px",
  },

  orderId: {
    fontWeight: "bold",
  },

  orderMeta: {
    color: "#ccc",
    marginTop: "5px",
  },
};

/* ---------- SUCCESS CARD STYLES ---------- */
const orderStyles = {
  card: {
    padding: "50px 30px",
    background: "rgba(255,255,255,0.15)",
    backdropFilter: "blur(10px)",
    maxWidth: "500px",
    width: "100%",
    borderRadius: "12px",
    textAlign: "center",
    color: "#fff",
    marginBottom: "40px",
    border: "1px solid rgba(255,255,255,0.2)",
    boxShadow: "0 0 25px rgba(255,255,255,0.15)",
  },


  title: {
    fontSize: "28px",
    fontWeight: "bold",
    marginBottom: "15px",
    color: "#00ffcc",
    textShadow: "0 0 10px rgba(0,255,204,0.7)",
  },

  subText: {
    fontSize: "18px",
    marginBottom: "30px",
    opacity: 0.9,
  },

  buttonRow: {
    display: "flex",
    gap: "15px",
    flexWrap: "wrap",
  },

  primaryBtn: {
    flex: 1,
    padding: "12px",
    background: "#fff",
    color: "#000",
    border: "none",
    cursor: "pointer",
    fontWeight: "bold",
    borderRadius: "6px",
  },

  secondaryBtn: {
    flex: 1,
    padding: "12px",
    background: "transparent",
    border: "1px solid #fff",
    color: "#fff",
    cursor: "pointer",
    borderRadius: "6px",
  },
};