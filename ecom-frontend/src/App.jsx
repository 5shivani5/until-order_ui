import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Navbar from "./components/Navbar";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import Order from "./pages/Orders";
import Payment from "./pages/Payment";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AddProduct from "./pages/AddProduct";
import ManageProducts from "./pages/ManageProducts";
import EditProduct from "./pages/EditProduct";
import AddCategory from "./pages/AddCategory";
import ManageCategories from "./pages/ManageCategories";
import EditCategory from "./pages/EditCategory";


function App() {
  const location = useLocation();

  const hideNavbar =
    location.pathname === "/login" ||
    location.pathname === "/register";

  return (
    <>
      {!hideNavbar && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
         {/* Main products page */}
          <Route path="/products" element={<Products />} />

          {/* Category-based products */}
          <Route path="/products/:category" element={<Products />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/orders" element={<Order />} />
           <Route path="/payment" element={<Payment />} />

<Route path="/admin-login" element={<AdminLogin />} />
<Route path="/admin" element={<AdminDashboard />} />
<Route path="/add-product" element={<AddProduct />} />
<Route path="/manage-products" element={<ManageProducts />} />
<Route path="/edit-product/:id" element={<EditProduct />} />
<Route path="/add-category" element={<AddCategory />} />
<Route path="/manage-categories" element={<ManageCategories />} />
<Route path="/edit-category/:id" element={<EditCategory />} />

      </Routes>
    </>
  );
}

export default App;