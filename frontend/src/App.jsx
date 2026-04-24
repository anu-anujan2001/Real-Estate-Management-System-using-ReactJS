import React, { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";

import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import EmailVerificationPage from "./pages/EmailVerificationPage";
import ShopPage from "./pages/ShopPage";
import CategoriesPage from "./pages/CategoriesPage";
import SingleProductPage from "./pages/SingleProductPage";
import WishlistPage from "./pages/WishlistPage";
import ContactPage from "./pages/ContactPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderSuccessPage from "./pages/OrderSuccessPage";
import OrdersPage from "./pages/OrdersPage";
import OrderDetailsPage from "./pages/OrderDetailsPage";


import useAuthStore from "./store/useAuthStore";
import useCartStore from "./store/useCartStore";

import AdminLayout from "./components/admin/layout/AdminLayout";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminProductsPage from "./pages/admin/AdminProductsPage";
import AdminCreateProductPage from "./pages/admin/AdminCreateProductPage";
import AdminEditProductPage from "./pages/admin/AdminEditProductPage";
import AdminUsersPage from "./pages/admin/AdminUsersPage";

import AdminRoute from "./routes/AdminRoute";

function App() {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  const { fetchCart, resetCart } = useCartStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (authUser) {
      fetchCart();
    } else {
      resetCart();
    }
  }, [authUser, fetchCart, resetCart]);

  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="animate-spin" size={48} />
      </div>
    );
  }

  return (
    <div>
      {(!authUser || authUser.role !== "admin") && <Navbar />}

      <Routes>
        <Route
          path="/"
          element={
            authUser?.role === "admin" ? (
              <Navigate to="/admin" replace />
            ) : (
              <HomePage />
            )
          }
        />

        <Route
          path="/shop"
          element={
            authUser?.role === "admin" ? (
              <Navigate to="/admin" replace />
            ) : (
              <ShopPage />
            )
          }
        />

        <Route
          path="/categories"
          element={
            authUser?.role === "admin" ? (
              <Navigate to="/admin" replace />
            ) : (
              <CategoriesPage />
            )
          }
        />

        <Route
          path="/product/:id"
          element={
            authUser?.role === "admin" ? (
              <Navigate to="/admin" replace />
            ) : (
              <SingleProductPage />
            )
          }
        />

        <Route
          path="/wishlist"
          element={
            authUser?.role === "admin" ? (
              <Navigate to="/admin" replace />
            ) : (
              <WishlistPage />
            )
          }
        />

        <Route
          path="/contact"
          element={
            authUser?.role === "admin" ? (
              <Navigate to="/admin" replace />
            ) : (
              <ContactPage />
            )
          }
        />

        <Route
          path="/cart"
          element={
            authUser?.role === "admin" ? (
              <Navigate to="/admin" replace />
            ) : (
              <CartPage />
            )
          }
        />

        <Route
          path="/checkout"
          element={
            authUser?.role === "admin" ? (
              <Navigate to="/admin" replace />
            ) : (
              <CheckoutPage />
            )
          }
        />

        <Route
          path="/order-success"
          element={
            authUser?.role === "admin" ? (
              <Navigate to="/admin" replace />
            ) : (
              <OrderSuccessPage />
            )
          }
        />

        <Route
          path="/orders"
          element={
            authUser?.role === "admin" ? (
              <Navigate to="/admin" replace />
            ) : (
              <OrdersPage />
            )
          }
        />

        <Route
          path="/orders/:id"
          element={
            authUser?.role === "admin" ? (
              <Navigate to="/admin" replace />
            ) : (
              <OrderDetailsPage />
            )
          }
        />

        <Route
          path="/login"
          element={
            !authUser ? (
              <LoginPage />
            ) : authUser.isVerified ? (
              authUser.role === "admin" ? (
                <Navigate to="/admin" replace />
              ) : (
                <Navigate to="/" replace />
              )
            ) : (
              <Navigate to="/verify-email" replace />
            )
          }
        />

        <Route
          path="/signup"
          element={
            !authUser ? (
              <SignupPage />
            ) : authUser.isVerified ? (
              authUser.role === "admin" ? (
                <Navigate to="/admin" replace />
              ) : (
                <Navigate to="/" replace />
              )
            ) : (
              <Navigate to="/verify-email" replace />
            )
          }
        />

        <Route
          path="/verify-email"
          element={
            authUser && !authUser.isVerified ? (
              <EmailVerificationPage />
            ) : authUser ? (
              authUser.role === "admin" ? (
                <Navigate to="/admin" replace />
              ) : (
                <Navigate to="/" replace />
              )
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/forgot-password"
          element={
            !authUser ? <ForgotPasswordPage /> : <Navigate to="/" replace />
          }
        />

        <Route
          path="/reset-password/:token"
          element={
            !authUser ? <ResetPasswordPage /> : <Navigate to="/" replace />
          }
        />

        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index element={<AdminDashboardPage />} />
          <Route path="products" element={<AdminProductsPage />} />
          <Route path="products/create" element={<AdminCreateProductPage />} />
          <Route path="products/edit/:id" element={<AdminEditProductPage />} />
          <Route path="users" element={<AdminUsersPage />} />
          
        </Route>
      </Routes>
   
      <Toaster />
    </div>
  );
}

export default App;
