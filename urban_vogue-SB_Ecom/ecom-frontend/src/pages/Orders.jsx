import { useNavigate } from "react-router-dom";
import bgImage from "../assets/background.png";

export default function Order() {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <div style={styles.overlay} />

      <div style={styles.content}>
        <div style={styles.card}>
          {/* ✅ Title */}
          <h1 style={styles.title}>Payment Successful ✅</h1>

          {/* ✅ Sub text */}
          <p style={styles.subText}>Your order has been placed successfully.</p>

          {/* ✅ Buttons row */}
          <div style={styles.buttonRow}>
            <button
              style={styles.primaryBtn}
              onClick={() => navigate("/order-history")}
            >
              Show Order History
            </button>

            <button
              style={styles.secondaryBtn}
              onClick={() => navigate("/products")}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

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
    background: "rgba(0,0,0,0.75)",
  },

  content: {
    position: "relative",
    zIndex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    minHeight: "100vh",
    paddingTop: "150px",
  },

  card: {
    padding: "50px 30px",
    background: "rgba(255,255,255,0.1)",
    backdropFilter: "blur(10px)",
    maxWidth: "500px",
    width: "90%",
    borderRadius: "12px",
    textAlign: "center",
    color: "#fff",
  },

  title: {
    fontSize: "28px",
    fontWeight: "bold",
    marginBottom: "15px",
  },

  subText: {
    fontSize: "18px",
    marginBottom: "30px",
    opacity: 0.9,
  },

  buttonRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: "15px",
    flexWrap: "wrap",
  },

  primaryBtn: {
    flex: 1,
    padding: "12px",
    background: "#fff",
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