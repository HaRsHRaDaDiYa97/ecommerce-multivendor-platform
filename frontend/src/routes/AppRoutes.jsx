// src/routes/AppRoutes.jsx
import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import Loader from "../components/Loader";

// Protected Route Components
import ProtectedAdminRoute from "../components/ProtectedAdminRoute";
import ProtectedSellerRoute from "../components/ProtectedSellerRoute"; // Create this like the admin one

// --- 1. USER/CUSTOMER PAGES ---
const Home = lazy(() => import("../pages/Home"));
const Login = lazy(() => import("../components/Login"));
const Signup = lazy(() => import("../components/Register"));
const ProductPage = lazy(() => import("../pages/ProductPage"));
const BecomeSeller = lazy(() => import("../components/BecomeSeller"));
const ProductDetail = lazy(() => import("../pages/ProductDetail")); // ✅ ADD THIS
const AboutUsPage = lazy(() => import("../pages/AboutUsPage"));
const CartPage = lazy(() => import("../pages/CartPage"));
const ContactPage = lazy(() => import("../pages/ContactPage"));
const WishlistPage = lazy(() => import("../pages/WishlistPage"));
const Checkout = lazy(() => import("../pages/Checkout"));

const UserProfile = lazy(() => import("../pages/UserProfile"));
const SellerProfile = lazy(() => import("../pages/SellerProfile"));
const AdminProfile = lazy(() => import("../pages/AdminProfile"));

const MyOrders = lazy(() => import("../pages/MyOrders"));

const PublicStore = lazy(() => import("../pages/PublicStore"));
const FollowingStores = lazy(() => import("../pages/store/FollowingStores"));

const OrderDetails = lazy(() => import("../pages/OrderDetails"));

const PrivacyPolicy = lazy(() => import("../components/policy/PrivacyPolicy"));
const RefundPolicy = lazy(() => import("../components/policy/RefundPolicy"));
const ShippingPolicy = lazy(() => import("../components/policy/ShippingPolicy"));
const TermsOfService = lazy(() => import("../components/policy/TermsOfService"));


// --- 2. SELLER ADMIN PANEL (The "Seller Central") ---
const SellerLayout = lazy(() => import("../components/layout/SellerLayout"));
const SellerDashboard = lazy(() => import("../seller/SellerDashboard"));
const SellerMyProducts = lazy(() => import("../seller/SellerMyProducts"));
const SellerOrders = lazy(() => import("../seller/SellerOrders"));
const AddProduct = lazy(() => import("../seller/AddProduct"));
const EditProduct = lazy(() => import("../seller/EditProduct"));
const SellerOrdersByStatus = lazy(() => import("../seller/SellerOrdersByStatus"));
const SellerEarnings = lazy(() => import("../seller/SellerEarnings"));
const SellerStoreSettings = lazy(() => import("../seller/SellerStoreSettings"));

const SellerReturnRequests = lazy(() => import("../seller/SellerReturnRequests"));

// --- 3. MAIN ADMIN PANEL (The "Control Center") ---
const AdminLayout = lazy(() => import("../components/layout/AdminLayout"));
const AdminDashboard = lazy(() => import("../admin/AdminDashboard"));
const AdminUsers = lazy(() => import("../admin/AdminUsers")); // For approving sellers
const AdminCategories = lazy(() => import("../admin/AdminCategories"));
const AdminProducts = lazy(() => import("../admin/AdminProducts"));
const RequestSeller = lazy(() => import("../admin/RequestSeller"));
const AddCategory = lazy(() => import("../admin/AddCategory"));
const EditCategory = lazy(() => import("../admin/EditCategory"));
const AdminSellers = lazy(() => import("../admin/AdminSellers"));
const AdminContactPage = lazy(() => import("../admin/AdminContactPage"));
const AdminWithdraws = lazy(() => import("../admin/AdminWithdraws"));
const AdminTags = lazy(() => import("../admin/AdminTags"));



function AppRoutes() {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>

        {/* ==========================================
            PUBLIC & USER ROUTES (Main Website)
        ========================================== */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Signup />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/about" element={<AboutUsPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/products" element={<ProductPage />} />

        <Route path="/profile" element={<UserProfile />} />

        <Route path="/checkout" element={<Checkout />} />

        <Route path="/my-orders" element={<MyOrders />} />
        <Route path="/orders/:id" element={<OrderDetails />} />

        <Route path="/store/:slug" element={<PublicStore />} />
        <Route path="/following-stores" element={<FollowingStores />} />


        {/* ✅ PRODUCT DETAIL PAGE */}
        <Route path="/products/:id" element={<ProductDetail />} />
        {/* User wants to register as a seller */}
        <Route path="/become-seller" element={<BecomeSeller />} />

        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/shipping" element={<ShippingPolicy />} />
        <Route path="/refund" element={<RefundPolicy />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />

        {/* ==========================================
            SELLER ADMIN PANEL (Specific to Vendors)
        ========================================== */}
        <Route element={<ProtectedSellerRoute />}>
          <Route path="/seller-panel" element={<SellerLayout />}>
            <Route index element={<SellerDashboard />} />
            <Route path="my-products" element={<SellerMyProducts />} />
            <Route path="add-product" element={<AddProduct />} />
            <Route path="my-orders" element={<SellerOrders />} />
            <Route path="profile" element={<SellerProfile />} />

            <Route path="orders/:status" element={<SellerOrdersByStatus />} />
            <Route path="earnings" element={<SellerEarnings />} />
            <Route path="returns" element={<SellerReturnRequests />} />
            <Route path="store" element={<SellerStoreSettings />} />

            <Route path="products/edit/:id" element={<EditProduct />} />
          </Route>
        </Route>


        {/* ==========================================
            MAIN ADMIN PANEL (The Master Admin)
        ========================================== */}
        <Route element={<ProtectedAdminRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="user" element={<AdminUsers />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="add-category" element={<AddCategory />} />
            <Route path="categories/edit/:id" element={<EditCategory />} />
            <Route path="sellers" element={<AdminSellers />} />
            <Route path="contact" element={<AdminContactPage />} />
            <Route path="profile" element={<AdminProfile />} />
            <Route path="withdraws" element={<AdminWithdraws />} />
            <Route path="tags" element={<AdminTags />} />
            <Route path="seller-request" element={<RequestSeller />} />

            {/* Admin can see seller requests here */}
          </Route>
        </Route>

      </Routes>
    </Suspense>
  );
}

export default AppRoutes;