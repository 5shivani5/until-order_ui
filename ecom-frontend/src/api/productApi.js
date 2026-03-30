import axios from "axios";

const BASE_URL = "http://localhost:8082/products";

// ✅ Map category name → category ID
const categoryMap = {
  men: 1,
  women: 2,
  kids: 3,
};

// ✅ Get products by category
export const getProductsByCategory = async (category) => {
  try {
    const categoryId = categoryMap[category];

    const response = await axios.get(
      `${BASE_URL}/category/${categoryId}`
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};

// ✅ (Optional) Get all products
export const getAllProducts = async () => {
  try {
    const response = await axios.get(BASE_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching all products:", error);
    return [];
  }
};