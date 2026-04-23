import { create } from "zustand";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";

const useAuthStore = create((set) => ({
  authUser: null,
  verificationExpiresAt: null,
  users: [],

  isLoggingIn: false,
  isSigningUp: false,
  isVerifyingEmail: false,
  isResendingCode: false,
  isCheckingAuth: true,
  isGettingUsers: false,
  isForgottingPassword: false,
  isResettingPassword: false,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check-auth");
      set({ authUser: res.data });
    } catch (err) {
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  login: async (userData) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", userData);
      set({ authUser: res.data.user });
      toast.success("Login successful");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      set({ isLoggingIn: false });
    }
  },

  signup: async (userData) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/register", userData);

      set({
        authUser: res.data.user,
        verificationExpiresAt: res.data.expiresAt,
      });

      toast.success(
        "Email verification sent. Please verify within 60 seconds.",
      );
    } catch (err) {
      toast.error(err.response?.data?.message || "Signup failed");
    } finally {
      set({ isSigningUp: false });
    }
  },

  verifyEmail: async (verificationData) => {
    set({ isVerifyingEmail: true });
    try {
      await axiosInstance.post("/auth/verify-email", verificationData);

      set((state) => ({
        authUser: state.authUser
          ? { ...state.authUser, isVerified: true }
          : null,
        verificationExpiresAt: null,
      }));

      toast.success("Email verified successfully");
    } catch (err) {
      if (err.response?.data?.message?.includes("expired")) {
        set({ authUser: null, verificationExpiresAt: null });
      }
      toast.error(err.response?.data?.message || "Email verification failed");
    } finally {
      set({ isVerifyingEmail: false });
    }
  },

  resendVerificationCode: async (email) => {
    set({ isResendingCode: true });
    try {
      const res = await axiosInstance.post("/auth/resend-verification-code", {
        email,
      });

      set({ verificationExpiresAt: res.data.expiresAt });
      toast.success(res.data.message || "Verification code resent");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to resend code");
    } finally {
      set({ isResendingCode: false });
    }
  },

  forgotPassword: async (email) => {
    set({ isForgottingPassword: true });
    try {
      const res = await axiosInstance.post("/auth/forgot-password", { email });
      toast.success(res.data.message || "Password reset email sent");
      return { success: true };
    } catch (err) {
      const message =
        err.response?.data?.message || "Failed to send reset email";
      toast.error(message);
      return { success: false, message };
    } finally {
      set({ isForgottingPassword: false });
    }
  },

  resetPassword: async (token, newPassword) => {
    set({ isResettingPassword: true });
    try {
      const res = await axiosInstance.post(`/auth/reset-password/${token}`, {
        newPassword,
      });
      toast.success(res.data.message || "Password reset successful");
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || "Failed to reset password";
      toast.error(message);
      return { success: false, message };
    } finally {
      set({ isResettingPassword: false });
    }
  },

  clearExpiredUser: () => {
    set({
      authUser: null,
      verificationExpiresAt: null,
    });
  },

  getAllUsers: async () => {
    set({ isGettingUsers: true });
    try {
      const res = await axiosInstance.get("/user");
      set({ users: res.data.users || [] });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch users");
    } finally {
      set({ isGettingUsers: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null, verificationExpiresAt: null, users: [] });
      toast.success("Logged out successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Logout failed");
    }
  },
}));

export default useAuthStore;
