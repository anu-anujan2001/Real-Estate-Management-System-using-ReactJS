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

import useAuthStore from "./store/useAuthStore";

import AdminLayout from "./components/admin/layout/AdminLayout";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminProductsPage from "./pages/admin/AdminProductsPage";
import AdminCreateProductPage from "./pages/admin/AdminCreateProductPage";
import AdminEditProductPage from "./pages/admin/AdminEditProductPage";
import AdminUsersPage from "./pages/admin/AdminUsersPage";
import AdminRoute from "./routes/AdminRoute";

function App() {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

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
        {/* PUBLIC PAGES */}
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

        {/* AUTH PAGES */}
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
          path="/product/:id"
          element={
            authUser?.role === "admin" ? (
              <Navigate to="/admin" replace />
            ) : (
              <SingleProductPage />
            )
          }
        />

        {/* ADMIN */}
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
