import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import orderApi from "../api/orderApi";
import bgImage from "../assets/background.png";

const fmt = (n) =>
  Number(n).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const STATUS_META = {
  PLACED:    { color: "#facc15", bg: "rgba(250,204,21,0.12)",   label: "Placed",    step: 0 },
  CONFIRMED: { color: "#38bdf8", bg: "rgba(56,189,248,0.12)",   label: "Confirmed", step: 1 },
  DELIVERED: { color: "#22c55e", bg: "rgba(34,197,94,0.12)",    label: "Delivered", step: 2 },
  CANCELLED: { color: "#ef4444", bg: "rgba(239,68,68,0.12)",    label: "Cancelled", step: -1 },
};

const STEPS = ["Placed", "Confirmed", "Delivered"];

function StatusTracker({ status }) {
  const meta = STATUS_META[status] || STATUS_META.PLACED;
  if (status === "CANCELLED") {
    return <p style={{ color: "#ef4444", fontSize: 13, margin: "8px 0 0" }}>✖ Order Cancelled</p>;
  }
  return (
    <div style={{ display: "flex", alignItems: "flex-start", margin: "12px 0 0" }}>
      {STEPS.map((label, i) => {
        const done   = i <= meta.step;
        const active = i === meta.step;
        return (
          <div key={label} style={{ display: "flex", flexDirection: "column", alignItems: "center", position: "relative", flex: 1 }}>
            <div style={{
              width: 13, height: 13, borderRadius: "50%", flexShrink: 0,
              background:  done ? meta.color : "rgba(255,255,255,0.15)",
              border:      `2px solid ${done ? meta.color : "rgba(255,255,255,0.2)"}`,
              boxShadow:   active ? `0 0 7px ${meta.color}` : "none",
            }} />
            <span style={{ fontSize: 10, marginTop: 4, color: done ? meta.color : "#555",
              fontWeight: active ? "bold" : "normal", letterSpacing: 0.5, textTransform: "uppercase" }}>
              {label}
            </span>
            {i < STEPS.length - 1 && (
              <div style={{
                position: "absolute", top: 6, left: "calc(50% + 8px)",
                width: "calc(100% - 16px)", height: 2,
                background: i < meta.step ? meta.color : "rgba(255,255,255,0.1)",
              }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function Orders() {
  const navigate = useNavigate();
  const [orders, setOrders]     = useState([]);
  const [loading, setLoading]   = useState(true);
  const [expanded, setExpanded] = useState({});
  const [cancelling, setCancelling] = useState(null);
  const [toast, setToast]       = useState("");

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const loadOrders = () => {
    setLoading(true);
    orderApi.getUserOrders()
      .then(setOrders)
      .catch(() => showToast("Could not load orders."))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadOrders(); }, []);

  const toggleExpand = (id) => setExpanded((p) => ({ ...p, [id]: !p[id] }));

  const handleCancel = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    setCancelling(orderId);
    try {
      const res = await orderApi.cancelOrder(orderId);
      showToast(res?.message || "Order cancelled. Amount refunded to wallet.");
      loadOrders();
    } catch (e) {
      showToast(e?.response?.data?.message || "Could not cancel order.");
    } finally {
      setCancelling(null);
    }
  };

  return (
    <div style={s.container}>
      <div style={s.overlay} />

      {/* ── NAVBAR ── */}
      <nav style={s.navbar}>
        <span style={s.navBrand} onClick={() => navigate("/")}>Urban Vogue</span>
        <div style={s.navLinks}>
          <button style={s.navBtn} onClick={() => navigate("/products")}>Shop</button>
          <button style={s.navBtn} onClick={() => navigate("/cart")}>Cart</button>
          <button style={s.navBtn} onClick={() => navigate("/order-history")}>Order History</button>
        </div>
      </nav>

      <div style={s.content}>

        {/* ── SUCCESS BANNER ── */}
        <div style={s.successCard}>
          <div style={s.checkCircle}>✓</div>
          <h2 style={s.successTitle}>Payment Successful — Order Placed!</h2>
          <p style={s.successSub}>
            Thank you for shopping with Urban Vogue. Your order has been confirmed.
          </p>
          <div style={s.bannerBtns}>
            <button style={s.primaryBtn} onClick={() => navigate("/products")}>
              Continue Shopping
            </button>
            <button style={s.secondaryBtn} onClick={() => navigate("/order-history")}>
              Full Order History
            </button>
          </div>
        </div>

        {/* ── ORDER LIST ── */}
        <h2 style={s.sectionTitle}>Your Orders</h2>
        <p style={s.sectionSub}>Track and manage all your purchases</p>

        {loading && <p style={s.info}>Loading orders…</p>}

        {!loading && orders.length === 0 && (
          <div style={s.emptyBox}>
            <p style={{ fontSize: 40 }}>🛍️</p>
            <p style={{ color: "#aaa", marginTop: 8 }}>No orders yet.</p>
          </div>
        )}

        {!loading && orders.map((order) => {
          const meta  = STATUS_META[order.status] || STATUS_META.PLACED;
          const open  = expanded[order.id];
          const count = order.items?.length ?? 0;
          const canCancel = order.status === "PLACED" || order.status === "CONFIRMED";

          return (
            <div key={order.id} style={{ ...s.card, borderColor: `${meta.color}44` }}>

              {/* Card header */}
              <div style={s.cardHeader}>
                <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={s.orderId}>Order #{order.id}</span>
                    <span style={{ ...s.badge, color: meta.color, borderColor: meta.color, background: meta.bg }}>
                      {meta.label}
                    </span>
                  </div>
                  <span style={s.orderMeta}>
                    {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                    &nbsp;·&nbsp;{count} item{count !== 1 ? "s" : ""}
                    &nbsp;·&nbsp;₹{fmt(order.totalAmount)}
                  </span>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  {canCancel && (
                    <button
                      style={s.cancelBtn}
                      onClick={() => handleCancel(order.id)}
                      disabled={cancelling === order.id}
                    >
                      {cancelling === order.id ? "…" : "Cancel"}
                    </button>
                  )}
                  <button style={s.expandBtn} onClick={() => toggleExpand(order.id)}>
                    {open ? "▲ Hide" : "▼ Details"}
                  </button>
                </div>
              </div>

              <StatusTracker status={order.status} />

              {/* Expandable details */}
              {open && (
                <div style={s.details}>
                  <div style={s.divider} />
                  <p style={s.detailLabel}>Items</p>
                  {order.items?.map((item, i) => (
                    <div key={i} style={s.itemRow}>
                      {item.imageUrl
                        ? <img src={item.imageUrl} alt={item.productName} style={s.img} />
                        : <div style={s.imgPlaceholder}>👗</div>
                      }
                      <div style={{ flex: 1 }}>
                        <p style={s.itemName}>{item.productName}</p>
                        <p style={s.itemMeta}>{item.brand} · Qty: {item.quantity}</p>
                      </div>
                      <p style={s.itemPrice}>₹{fmt(item.subtotal)}</p>
                    </div>
                  ))}
                  <div style={s.divider} />
                  <div style={s.footerRow}>
                    <span style={s.addrText}>📍 {order.addressLine}, {order.city}, {order.state} — {order.pincode}</span>
                    <span style={{ color: "#fff", fontSize: 14, fontWeight: "bold" }}>Total: ₹{fmt(order.totalAmount)}</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {toast && <div style={s.toast}>{toast}</div>}
    </div>
  );
}

const s = {
  container: {
    minHeight: "100vh", backgroundImage: `url(${bgImage})`,
    backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: "fixed",
    position: "relative", fontFamily: "Georgia",
  },
  overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.82)", zIndex: 0 },
  content: {
    position: "relative", zIndex: 1,
    padding: "80px 32px 80px", maxWidth: 860, margin: "0 auto", color: "#fff",
  },

  // Success banner
  successCard: {
    background: "linear-gradient(135deg, rgba(34,197,94,0.15), rgba(56,189,248,0.10))",
    border: "1px solid rgba(34,197,94,0.35)",
    borderRadius: 12, padding: "36px 32px", marginBottom: 48,
    textAlign: "center", backdropFilter: "blur(10px)",
  },
  checkCircle: {
    width: 56, height: 56, borderRadius: "50%",
    background: "rgba(34,197,94,0.2)", border: "2px solid #22c55e",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 26, color: "#22c55e", margin: "0 auto 16px",
  },
  successTitle: { fontSize: 24, fontWeight: "bold", color: "#22c55e", margin: "0 0 10px", letterSpacing: 1 },
  successSub:   { color: "#aaa", fontSize: 14, margin: "0 0 24px", lineHeight: 1.6 },
  bannerBtns:   { display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" },
  primaryBtn: {
    padding: "10px 28px", background: "#fff", color: "#000",
    border: "none", cursor: "pointer", fontFamily: "Georgia", fontSize: 14, borderRadius: 4,
  },
  secondaryBtn: {
    padding: "10px 28px", background: "transparent", color: "#fff",
    border: "1px solid rgba(255,255,255,0.3)", cursor: "pointer", fontFamily: "Georgia", fontSize: 14, borderRadius: 4,
  },

  sectionTitle: { fontSize: 28, fontWeight: "bold", letterSpacing: 2, margin: "0 0 4px" },
  sectionSub:   { color: "#666", fontSize: 13, margin: "0 0 24px", letterSpacing: 1 },
  info:         { color: "#aaa" },
  emptyBox:     { textAlign: "center", padding: "40px", background: "rgba(255,255,255,0.04)", borderRadius: 10 },

  card: {
    background: "rgba(255,255,255,0.05)", border: "1px solid",
    backdropFilter: "blur(10px)", borderRadius: 10, padding: "18px 22px", marginBottom: 16,
  },
  cardHeader:  { display: "flex", justifyContent: "space-between", alignItems: "flex-start" },
  orderId:     { color: "#fff", fontSize: 15, fontWeight: "bold" },
  orderMeta:   { color: "#666", fontSize: 12 },
  badge: {
    fontSize: 10, fontWeight: "bold", letterSpacing: 2,
    border: "1px solid", padding: "2px 8px", borderRadius: 2, textTransform: "uppercase",
  },
  cancelBtn: {
    background: "transparent", border: "1px solid rgba(239,68,68,0.5)",
    color: "#ef4444", padding: "4px 12px", fontSize: 11, cursor: "pointer",
    fontFamily: "Georgia", borderRadius: 3,
  },
  expandBtn: {
    background: "transparent", border: "1px solid rgba(255,255,255,0.15)",
    color: "#aaa", padding: "4px 12px", fontSize: 11, cursor: "pointer",
    fontFamily: "Georgia", borderRadius: 3,
  },

  details:    { marginTop: 8 },
  divider:    { height: 1, background: "rgba(255,255,255,0.07)", margin: "12px 0" },
  detailLabel: { color: "#666", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", margin: "0 0 8px" },
  itemRow:    { display: "flex", alignItems: "center", gap: 12, padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" },
  img:        { width: 50, height: 50, objectFit: "cover", borderRadius: 5, background: "rgba(255,255,255,0.06)" },
  imgPlaceholder: { width: 50, height: 50, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, background: "rgba(255,255,255,0.06)", borderRadius: 5, flexShrink: 0 },
  itemName:   { color: "#fff", fontSize: 13, margin: "0 0 2px" },
  itemMeta:   { color: "#666", fontSize: 11, margin: 0 },
  itemPrice:  { color: "#ccc", fontSize: 13, fontWeight: "bold", margin: 0, flexShrink: 0 },
  footerRow:  { display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 },
  addrText:   { color: "#777", fontSize: 12 },

  toast: {
    position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)",
    background: "#111", color: "#fff", padding: "10px 24px", borderRadius: 6, zIndex: 10,
    border: "1px solid rgba(255,255,255,0.15)", fontSize: 14,
  },

  // Navbar
  navbar: {
    position: "fixed", top: 0, left: 0, right: 0, zIndex: 2,
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "16px 36px", backdropFilter: "blur(10px)",
    background: "rgba(0,0,0,0.35)", borderBottom: "1px solid rgba(255,255,255,0.08)",
  },
  navBrand: {
    color: "#fff", fontSize: 18, fontWeight: "bold",
    letterSpacing: 2, textTransform: "uppercase", cursor: "pointer",
  },
  navLinks: { display: "flex", gap: 10, alignItems: "center" },
  navBtn: {
    background: "transparent", border: "1px solid rgba(255,255,255,0.3)",
    color: "#fff", padding: "7px 18px", fontSize: 13,
    cursor: "pointer", fontFamily: "Georgia", borderRadius: 3,
  },
};
