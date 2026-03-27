import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import bgImage from "../assets/background.png";

function EditCategory() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [category, setCategory] = useState({
    name: "",
  });

  // ✅ Fetch category by ID
  useEffect(() => {
    axios.get(`http://localhost:8082/categories/${id}`)
      .then(res => setCategory(res.data))
      .catch(err => {
        console.error(err);
        alert("Failed to load category");
      });
  }, [id]);

  const handleChange = (e) => {
    setCategory({ ...category, name: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(
        `http://localhost:8082/categories/${id}`,
        category,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      alert("Category updated ✅");
      navigate("/manage-categories");

    } catch (err) {
      console.error(err);
      alert("Update failed ❌");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.overlay} />

      <form onSubmit={handleSubmit} style={styles.form}>
        <h1 style={styles.title}>Edit Category</h1>

        <input
          name="name"
          value={category.name}
          onChange={handleChange}
          style={styles.input}
          required
        />

        <button type="submit" style={styles.button}>
          Update
        </button>

        <button
          type="button"
          style={styles.backButton}
          onClick={() => navigate("/manage-categories")}
        >
          Back
        </button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundImage: `url(${bgImage})`,
    backgroundSize: "cover",
    position: "relative",
  },

  overlay: {
    position: "absolute",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.65)",
  },

  form: {
    position: "relative",
    zIndex: 1,
    padding: "40px",
    width: "350px",
    background: "rgba(255,255,255,0.08)",
    backdropFilter: "blur(10px)",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },

  title: {
    color: "#fff",
    textAlign: "center",
  },

  input: {
    padding: "10px",
    background: "rgba(255,255,255,0.1)",
    border: "1px solid rgba(255,255,255,0.3)",
    color: "#fff",
  },

  button: {
    padding: "10px",
    background: "#fff",
    border: "none",
    cursor: "pointer",
  },

  backButton: {
    padding: "10px",
    background: "transparent",
    border: "1px solid #aaa",
    color: "#aaa",
    cursor: "pointer",
  },
};

export default EditCategory;