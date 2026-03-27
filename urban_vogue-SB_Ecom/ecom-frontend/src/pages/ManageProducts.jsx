import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import bgImage from "../assets/background.png";

function ManageProducts() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  // ✅ Fetch all products
  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:8082/products");
      setProducts(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch products");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ✅ Delete product
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8082/products/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      alert("Deleted successfully");
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.overlay} />

      <div style={styles.content}>
        <h1 style={styles.title}>Manage Products</h1>

        <button
          style={styles.addButton}
          onClick={() => navigate("/add-product")}
        >
          + Add Product
        </button>

        <div style={styles.grid}>
          {products.map((p) => (
            <div
              key={p.id}
              style={styles.card}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.05)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              <img src={p.imagePath} alt={p.name} style={styles.image} />

              <h3>{p.name}</h3>
              <p>₹ {p.price}</p>
              <p>{p.availabilityStatus}</p>

              <div style={styles.actions}>
                <button
                  style={styles.editBtn}
                  onClick={() => navigate(`/edit-product/${p.id}`)}
                >
                  Edit
                </button>

                <button
                  style={styles.deleteBtn}
                  onClick={() => handleDelete(p.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",                 // 🔥 fixed height
    overflowY: "auto",               // 🔥 scroll only content
    backgroundImage: `url(${bgImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundAttachment: "fixed",   // 🔥 KEY LINE (fix image)
    position: "relative",
    fontFamily: "'Georgia', serif",
  },

  overlay: {
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.65)",
  },

  content: {
    position: "relative",
    zIndex: 1,
    padding: "40px",
    color: "#fff",
  },

  title: {
    textAlign: "center",
    marginBottom: "20px",
    letterSpacing: "2px",
    textTransform: "uppercase",
    color: "white",
  },

  addButton: {
    display: "block",
    margin: "0 auto 30px",
    padding: "12px 20px",
    border: "1px solid #fff",
    background: "#fff",
    color: "#000",
    cursor: "pointer",
    letterSpacing: "1px",
    textTransform: "uppercase",
  },

  grid: {
    display: "flex",
    flexWrap: "wrap",
    gap: "20px",
    justifyContent: "center",
  },

  card: {
    width: "220px",
    padding: "15px",
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.2)",
    backdropFilter: "blur(10px)",
    textAlign: "center",
    transition: "all 0.3s ease",
  },

  image: {
    width: "100%",
    height: "140px",
    objectFit: "cover",
    marginBottom: "10px",
  },

  actions: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "10px",
  },

  editBtn: {
    padding: "6px 10px",
    border: "1px solid #4CAF50",
    background: "transparent",
    color: "#4CAF50",
    cursor: "pointer",
  },

  deleteBtn: {
    padding: "6px 10px",
    border: "1px solid red",
    background: "transparent",
    color: "red",
    cursor: "pointer",
  },
};

export default ManageProducts;