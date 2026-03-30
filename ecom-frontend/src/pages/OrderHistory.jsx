import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import orderApi from "../api/orderApi";
import bgImage from "../assets/background.png";

const fmt = (n) =>
  Number(n).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const STATUS_META = {
  PLACED:    { color: "#aaa",    bg: "rgba(170,170,170,0.12)",  label: "Placed",    step: 0 },
  CONFIRMED: { color: "#7ec8e3", bg: "rgba(126,200,227,0.12)",  label: "Confirmed", step: 1 },
  DELIVERED: { color: "#9fcea7", bg: "rgba(159,206,167,0.12)",  label: "Delivered", step: 3 },
  CANCELLED: { color: "#ff8080", bg: "rgba(255,128,128,0.12)",  label: "Cancelled", step: -1 },
};

const STEPS = ["Placed", "Confirmed", "Delivered"];

function StatusTracker({ status }) {
  const meta = STATUS_META[status] || STATUS_META.PLACED;
  if (status === "CANCELLED") {
    return (
      <div style={tracker.wrap}>
        <span style={{ color: "#ff8080", fontSize: 13, letterSpacing: 1 }}>✖ Order Cancelled</span>
      </div>
    );
  }
  return (
    <div style={tracker.wrap}>
      {STEPS.map((label, i) => {
        const done   = i <= meta.step;
        const active = i === meta.step;
        return (
          <div key={label} style={tracker.stepGroup}>
            <div style={{
              ...tracker.dot,
              background: done ? meta.color : "rgba(255,255,255,0.15)",
              border: `2px solid ${done ? meta.color : "rgba(255,255,255,0.2)"}`,
              boxShadow: active ? `0 0 8px ${meta.color}` : "none",
            }} />
            <span style={{ ...tracker.label, color: done ? meta.color : "#555", fontWeight: active ? "bold" : "normal" }}>
              {label}
            </span>
            {i < STEPS.length - 1 && (
              <div style={{
                ...tracker.line,
                background: i < meta.step ? meta.color : "rgba(255,255,255,0.1)",
              }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

const tracker = {
  wrap: { display: "flex", alignItems: "flex-start", gap: 0, margin: "14px 0 4px" },
  stepGroup: { display: "flex", flexDirection: "column", alignItems: "center", position: "relative", flex: 1 },
  dot: { width: 14, height: 14, borderRadius: "50%", flexShrink: 0, transition: "all 0.3s" },
  label: { fontSize: 10, marginTop: 5, letterSpacing: 0.5, textTransform: "uppercase", textAlign: "center" },
  line: {
    position: "absolute", top: 7, left: "calc(50% + 8px)",
    width: "calc(100% - 16px)", height: 2, transition: "background 0.3s",
  },
};

export default function OrderHistory() {
  const navigate = useNavigate();
  const [orders, setOrders]     = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");
  const [expanded, setExpanded] = useState({});
  const [filter, setFilter]     = useState("ALL");

  useEffect(() => {
    orderApi.getUserOrders()
      .then(setOrders)
      .catch(() => setError("Could not load orders. Is the order-service running on port 8085?"))
      .finally(() => setLoading(false));
  }, []);

  const toggleExpand = (id) =>
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

  const allStatuses = ["ALL", ...Object.keys(STATUS_META)];
  const filtered = filter === "ALL" ? orders : orders.filter((o) => o.status === filter);

  return (
    <div style={s.container}>
      <div style={s.overlay} />

      {/* Navbar */}
      <nav style={s.navbar}>
        <span style={s.brand} onClick={() => navigate("/")}>Urban Vogue</span>
        <div style={{ display: "flex", gap: 12 }}>
          <button style={s.navBtn} onClick={() => navigate("/products")}>Shop</button>
          <button style={s.navBtn} onClick={() => navigate("/cart")}>Cart</button>
        </div>
      </nav>

      <div style={s.content}>
        <h1 style={s.title}>My Orders</h1>
        <p style={s.subtitle}>Track and manage all your purchases</p>

        {/* Filter tabs */}
        <div style={s.filterRow}>
          {allStatuses.map((st) => {
            const meta = STATUS_META[st];
            const active = filter === st;
            return (
              <button
                key={st}
                style={{
                  ...s.filterBtn,
                  background: active ? (meta ? meta.color : "#fff") : "rgba(255,255,255,0.06)",
                  color: active ? "#000" : (meta ? meta.color : "#aaa"),
                  border: `1px solid ${meta ? meta.color : "rgba(255,255,255,0.15)"}`,
                  fontWeight: active ? "bold" : "normal",
                }}
                onClick={() => setFilter(st)}
              >
                {meta ? meta.label : "All"}
                {st !== "ALL" && (
                  <span style={s.filterCount}>
                    {orders.filter((o) => o.status === st).length}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* States */}
        {loading && (
          <div style={s.emptyBox}>
            <div style={s.spinner} />
            <p style={{ color: "#aaa", marginTop: 16 }}>Loading your orders…</p>
          </div>
        )}

        {!loading && error && (
          <div style={s.emptyBox}>
            <p style={{ fontSize: 36 }}>⚠️</p>
            <p style={{ color: "#ff8080", marginTop: 8 }}>{error}</p>
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div style={s.emptyBox}>
            <p style={{ fontSize: 48 }}>🛍️</p>
            <p style={{ color: "#aaa", marginTop: 8 }}>
              {filter === "ALL" ? "You haven't placed any orders yet." : `No ${filter.toLowerCase()} orders.`}
            </p>
            <button style={s.shopBtn} onClick={() => navigate("/products")}>
              Start Shopping
            </button>
          </div>
        )}

        {/* Order Cards */}
        {!loading && !error && filtered.map((order) => {
          const meta = STATUS_META[order.status] || STATUS_META.PLACED;
          const open = expanded[order.id];
          const itemCount = order.items?.length ?? 0;

          return (
            <div key={order.id} style={{ ...s.card, borderColor: `${meta.color}44` }}>

              {/* Card Header */}
              <div style={s.cardHeader}>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={s.orderId}>Order #{order.id}</span>
                    <span style={{
                      ...s.badge,
                      color: meta.color,
                      borderColor: meta.color,
                      background: meta.bg,
                    }}>
                      {meta.label}
                    </span>
                  </div>
                  <span style={s.orderMeta}>
                    {new Date(order.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric", month: "long", year: "numeric",
                    })}
                    &nbsp;·&nbsp;
                    {itemCount} item{itemCount !== 1 ? "s" : ""}
                    &nbsp;·&nbsp;
                    ₹{fmt(order.totalAmount)}
                  </span>
                </div>
                <button style={s.expandBtn} onClick={() => toggleExpand(order.id)}>
                  {open ? "▲ Hide" : "▼ Details"}
                </button>
              </div>

              {/* Status Tracker — always visible */}
              <StatusTracker status={order.status} />

              {/* Expandable details */}
              {open && (
                <div style={s.details}>
                  <hr style={s.divider} />

                  {/* Items */}
                  <p style={s.sectionLabel}>Items</p>
                  {order.items?.map((item, i) => (
                    <div key={i} style={s.itemRow}>
                      {item.imageUrl
                        ? <img src={item.imageUrl} alt={item.productName} style={s.img} />
                        : <div style={s.imgPlaceholder}> </div>
                      }
                      <div style={{ flex: 1 }}>
                        <p style={s.itemName}>{item.productName}</p>
                        <p style={s.itemMeta}>{item.brand} &nbsp;·&nbsp; Qty: {item.quantity}</p>
                      </div>
                      <p style={s.itemPrice}>₹{fmt(item.subtotal)}</p>
                    </div>
                  ))}

                  <hr style={s.divider} />

                  {/* Bill summary */}
                  <p style={s.sectionLabel}>Price Details</p>
                  <div style={s.billRow}>
                    <span>Subtotal</span>
                    <span>₹{fmt(order.totalAmount)}</span>
                  </div>
                  <div style={{ ...s.billRow, fontWeight: "bold", color: "#fff", marginTop: 6 }}>
                    <span>Total Paid</span>
                    <span>₹{fmt(order.totalAmount)}</span>
                  </div>

                  <hr style={s.divider} />

                  {/* Address */}
                  <p style={s.sectionLabel}>Delivery Address</p>
                  <p style={s.addressText}>
                     {order.addressLine}, {order.city}, {order.state} — {order.pincode}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Styles ─── */
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
  overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.80)", zIndex: 0 },
  navbar: {
    position: "fixed", top: 0, left: 0, right: 0, zIndex: 2,
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "16px 36px",
    backdropFilter: "blur(10px)", background: "rgba(0,0,0,0.35)",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
  },
  brand: { color: "#fff", fontSize: 20, fontWeight: "bold", cursor: "pointer", letterSpacing: 3 },
  navBtn: {
    background: "transparent", border: "1px solid rgba(255,255,255,0.3)",
    color: "#fff", padding: "7px 18px", fontSize: 13, cursor: "pointer",
    fontFamily: "Georgia", borderRadius: 3,
  },
  content: {
    position: "relative", zIndex: 1,
    padding: "110px 32px 80px", maxWidth: 860, margin: "0 auto", color: "#fff",
  },
  title:    { fontSize: 38, fontWeight: "bold", letterSpacing: 3, margin: 0 },
  subtitle: { color: "#666", fontSize: 14, marginTop: 6, marginBottom: 24, letterSpacing: 1 },

  filterRow: { display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 28 },
  filterBtn: {
    padding: "6px 14px", borderRadius: 3, cursor: "pointer",
    fontSize: 12, fontFamily: "Georgia", letterSpacing: 1,
    transition: "all 0.2s", display: "flex", alignItems: "center", gap: 6,
  },
  filterCount: {
    background: "rgba(0,0,0,0.25)", borderRadius: "50%",
    padding: "1px 6px", fontSize: 10,
  },

  emptyBox: {
    textAlign: "center", padding: "60px 20px",
    background: "rgba(255,255,255,0.04)", borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.08)",
  },
  shopBtn: {
    marginTop: 20, padding: "10px 28px",
    background: "#fff", color: "#000", border: "none",
    cursor: "pointer", fontFamily: "Georgia", fontSize: 14, borderRadius: 4,
  },
  spinner: {
    width: 36, height: 36, borderRadius: "50%", margin: "0 auto",
    border: "3px solid rgba(255,255,255,0.1)",
    borderTop: "3px solid #fff",
    animation: "spin 0.9s linear infinite",
  },

  card: {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid",
    backdropFilter: "blur(12px)",
    borderRadius: 10, padding: "20px 24px", marginBottom: 18,
    transition: "border-color 0.3s",
  },
  cardHeader: {
    display: "flex", justifyContent: "space-between", alignItems: "flex-start",
  },
  orderId:   { color: "#fff", fontSize: 16, fontWeight: "bold" },
  orderMeta: { color: "#666", fontSize: 12, letterSpacing: 0.5 },
  badge: {
    fontSize: 10, fontWeight: "bold", letterSpacing: 2,
    border: "1px solid", padding: "2px 9px", borderRadius: 2, textTransform: "uppercase",
  },
  expandBtn: {
    background: "transparent", border: "1px solid rgba(255,255,255,0.15)",
    color: "#aaa", padding: "5px 12px", fontSize: 11, cursor: "pointer",
    fontFamily: "Georgia", borderRadius: 3, flexShrink: 0,
  },

  details: { marginTop: 10 },
  divider: { border: "none", borderTop: "1px solid rgba(255,255,255,0.07)", margin: "14px 0" },
  sectionLabel: { color: "#666", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", margin: "0 0 10px" },

  itemRow: {
    display: "flex", alignItems: "center", gap: 14,
    padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.05)",
  },
  img:            { width: 56, height: 56, objectFit: "cover", borderRadius: 6, background: "rgba(255,255,255,0.06)" },
  imgPlaceholder: { width: 56, height: 56, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, background: "rgba(255,255,255,0.06)", borderRadius: 6, flexShrink: 0 },
  itemName:  { color: "#fff", fontSize: 14, margin: "0 0 3px" },
  itemMeta:  { color: "#666", fontSize: 12, margin: 0 },
  itemPrice: { color: "#ccc", fontSize: 14, fontWeight: "bold", margin: 0, flexShrink: 0 },

  billRow: { display: "flex", justifyContent: "space-between", color: "#999", fontSize: 13, padding: "3px 0" },
  addressText: { color: "#888", fontSize: 13, margin: 0, lineHeight: 1.6 },
};
