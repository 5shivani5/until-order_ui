import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div style={styles.navbar}>
      <h2 style={styles.logo} onClick={() => navigate("/")}>UrbanVogue</h2>
      <div style={styles.rightSection}>
        {user ? (
          <>
            <span style={styles.greeting}>Hi, {user}</span>
            <button style={styles.linkBtn} onClick={() => navigate("/order-history")}>
              My Orders
            </button>
            <button style={styles.linkBtn} onClick={() => navigate("/cart")}>
              Cart
            </button>
            <button
              onClick={() => { logout(); navigate("/login"); }}
              style={styles.button}
            >
              Logout
            </button>
          </>
        ) : (
          <button onClick={() => navigate("/login")} style={styles.button}>
            Login
          </button>
        )}
      </div>
    </div>
  );
}

const styles = {
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px 30px",
    background: "black",
    color: "white",
  },
  logo: {
    margin: 0,
    cursor: "pointer",
    fontSize: 20,
    letterSpacing: 2,
  },
  rightSection: {
    display: "flex",
    alignItems: "center",
    gap: 16,
  },
  greeting: {
    fontSize: 14,
    color: "#ccc",
  },
  linkBtn: {
    background: "none",
    border: "none",
    color: "#ccc",
    fontSize: 14,
    cursor: "pointer",
    padding: "4px 0",
    fontFamily: "inherit",
    textDecoration: "underline",
    textUnderlineOffset: 3,
  },
  button: {
    padding: "6px 14px",
    cursor: "pointer",
    background: "white",
    color: "black",
    border: "none",
    fontSize: 13,
  },
};

export default Navbar;
