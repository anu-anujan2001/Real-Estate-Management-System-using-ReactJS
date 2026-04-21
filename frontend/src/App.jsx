import React, { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";

import Nabar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import EmailVerificationPage from "./pages/EmailVerificationPage";
import useAuthStore from "./store/useAuthStore";

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
      <Nabar />

      <Routes>
        <Route
          path="/"
          element={
            authUser && authUser.isVerified ? (
              <HomePage />
            ) : authUser && !authUser.isVerified ? (
              <Navigate to="/verify-email" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="/login"
          element={
            !authUser ? (
              <LoginPage />
            ) : authUser.isVerified ? (
              <Navigate to="/" replace />
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
            ) :  authUser.isVerified ? (
              <Navigate to="/" replace />
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
            ) : (authUser && authUser.isVerified ? (
              <Navigate to="/" replace />
            ) : (
              <Navigate to="/login" replace />
            ))
          }
        />
      </Routes>

      <Toaster />
    </div>
  );
}

export default App;
