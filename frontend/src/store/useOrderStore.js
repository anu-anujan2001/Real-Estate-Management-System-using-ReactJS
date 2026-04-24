import { create } from "zustand";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";

const useOrderStore = create((set) => ({
  orders: [],
  selectedOrder: null,
  isCreatingOrder: false,
  isLoadingOrders: false,

  createCashOrder: async (shippingAddress) => {
    set({ isCreatingOrder: true });

    try {
      const res = await axiosInstance.post("/orders/cash", {
        shippingAddress,
      });

      toast.success(res.data.message || "Order placed successfully");
      return { success: true, order: res.data.order };
    } catch (err) {
      const message = err.response?.data?.message || "Failed to place order";
      toast.error(message);
      return { success: false, message };
    } finally {
      set({ isCreatingOrder: false });
    }
  },

  createStripeCheckoutSession: async (cartItems, shippingAddress) => {
    set({ isCreatingOrder: true });

    try {
      localStorage.setItem("shippingAddress", JSON.stringify(shippingAddress));

      const res = await axiosInstance.post("/payment/create-checkout-session", {
        cartItems,
      });

      if (res.data.url) {
        window.location.href = res.data.url;
      }

      return { success: true };
    } catch (err) {
      const message =
        err.response?.data?.message || "Failed to start Stripe checkout";
      toast.error(message);
      return { success: false, message };
    } finally {
      set({ isCreatingOrder: false });
    }
  },

  createPaidOrderAfterStripeSuccess: async (stripeSessionId) => {
    set({ isCreatingOrder: true });

    try {
      const shippingAddress = JSON.parse(
        localStorage.getItem("shippingAddress") || "{}",
      );

      const res = await axiosInstance.post("/orders/stripe-success", {
        shippingAddress,
        stripeSessionId,
      });

      localStorage.removeItem("shippingAddress");

      toast.success(res.data.message || "Order created successfully");
      return { success: true, order: res.data.order };
    } catch (err) {
      const message = err.response?.data?.message || "Failed to create order";
      toast.error(message);
      return { success: false, message };
    } finally {
      set({ isCreatingOrder: false });
    }
  },

  fetchMyOrders: async () => {
    set({ isLoadingOrders: true });

    try {
      const res = await axiosInstance.get("/orders/my-orders");
      set({ orders: res.data.orders || [] });
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || "Failed to fetch orders";
      toast.error(message);
      return { success: false, message };
    } finally {
      set({ isLoadingOrders: false });
    }
  },

  fetchOrderById: async (id) => {
    set({ isLoadingOrders: true });

    try {
      const res = await axiosInstance.get(`/orders/${id}`);
      set({ selectedOrder: res.data.order || null });
      return { success: true, order: res.data.order };
    } catch (err) {
      const message = err.response?.data?.message || "Failed to fetch order";
      toast.error(message);
      return { success: false, message };
    } finally {
      set({ isLoadingOrders: false });
    }
  },

  clearSelectedOrder: () => {
    set({ selectedOrder: null });
  },
}));

export default useOrderStore;
