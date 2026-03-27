import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import bgImage from "../assets/background.png";

function ManageCategories() {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  // ✅ Fetch all categories
  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:8082/categories");
      setCategories(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch categories");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // ✅ Delete category
const handleDelete = async (id) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this category?"
  );

  if (!confirmDelete) return;

  try {
    const res = await axios.delete(
      `http://localhost:8082/categories/${id}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    alert(res.data || "Category deleted ✅");
    fetchCategories(); // refresh
  } catch (err) {
    console.error(err);

    const message =
      err.response?.data || "Delete failed ❌";

    alert(message); // 🔥 THIS SHOWS YOUR CUSTOM MESSAGE
  }
};

  return (
    <div style={styles.container}>
      <div style={styles.overlay} />

      <div style={styles.content}>
        <h1 style={styles.title}>Manage Categories</h1>

        <button
          style={styles.addButton}
          onClick={() => navigate("/add-category")}
        >
          + Add Category
        </button>

        <div style={styles.grid}>
          {categories.map((c) => (
            <div
              key={c.id}
              style={styles.card}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.05)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              <h3>{c.name}</h3>

              <div style={styles.actions}>
                <button
                  style={styles.editBtn}
                  onClick={() => navigate(`/edit-category/${c.id}`)}
                >
                  Edit
                </button>

                <button
                  style={styles.deleteBtn}
                  onClick={() => handleDelete(c.id)}
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
    height: "100vh",
    overflowY: "auto",
    backgroundImage: `url(${bgImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundAttachment: "fixed",
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
    width: "200px",
    padding: "20px",
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.2)",
    backdropFilter: "blur(10px)",
    textAlign: "center",
    transition: "all 0.3s ease",
  },

  actions: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "15px",
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

export default ManageCategories;