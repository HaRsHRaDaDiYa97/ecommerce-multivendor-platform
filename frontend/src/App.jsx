import React, { useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";

import Header from "./components/Header";
import AppRoutes from "./routes/AppRoutes";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import AuthInitializer from "./components/AuthInitializer";

import { useDispatch, useSelector } from "react-redux";
import { fetchWishlist } from "./features/wishlist/wishlistSlice";
import { fetchCart } from "./features/cart/cartSlice"; // ✅ import fetchCart
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    // Only fetch wishlist & cart if user is logged in
    if (isAuthenticated) {
      dispatch(fetchWishlist());
      dispatch(fetchCart()); // ✅ fetch cart from backend
    }
  }, [dispatch, isAuthenticated]);

  return (
    <>
      <ToastContainer 
        position="top-right"
        autoClose={2000}   // 2 seconds
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <AuthInitializer />

      <Router>
        <ScrollToTop />
        <div className="font-sans">
          <Header />
          <main className="min-h-screen container mx-auto">
            <AppRoutes />
          </main>
          <Footer />
        </div>
      </Router>
    </>
  );
}

export default App;
