import { create } from "zustand";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";

const useCartStore = create((set, get) => ({
  cart: null,
  isLoadingCart: false,
  isUpdatingCart: false,

  fetchCart: async () => {
    set({ isLoadingCart: true });

    try {
      const res = await axiosInstance.get("/cart");
      set({ cart: res.data.cart || null });
    } catch (err) {
      if (err.response?.status === 401) {
        set({ cart: null });
      } else {
        toast.error(err.response?.data?.message || "Failed to fetch cart");
      }
    } finally {
      set({ isLoadingCart: false });
    }
  },

  addToCart: async ({ productId, quantity = 1, variant = null }) => {
    set({ isUpdatingCart: true });

    try {
      const res = await axiosInstance.post("/cart", {
        productId,
        quantity,
        variant,
      });

      set({ cart: res.data.cart || null });
      toast.success(res.data.message || "Added to cart");
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || "Failed to add to cart";
      toast.error(message);
      return { success: false, message };
    } finally {
      set({ isUpdatingCart: false });
    }
  },

  updateQuantity: async (itemId, quantity) => {
    set({ isUpdatingCart: true });

    try {
      const res = await axiosInstance.put(`/cart/${itemId}`, { quantity });
      set({ cart: res.data.cart || null });
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || "Failed to update cart";
      toast.error(message);
      return { success: false, message };
    } finally {
      set({ isUpdatingCart: false });
    }
  },

  removeFromCart: async (itemId) => {
    set({ isUpdatingCart: true });

    try {
      const res = await axiosInstance.delete(`/cart/${itemId}`);
      set({ cart: res.data.cart || null });
      toast.success(res.data.message || "Item removed from cart");
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || "Failed to remove item";
      toast.error(message);
      return { success: false, message };
    } finally {
      set({ isUpdatingCart: false });
    }
  },

  clearCart: async () => {
    set({ isUpdatingCart: true });

    try {
      const res = await axiosInstance.delete("/cart");
      set({ cart: res.data.cart || null });
      toast.success(res.data.message || "Cart cleared");
      return { success: true };
    } catch (err) {
      const status = err.response?.status;
      const message = err.response?.data?.message || "Failed to clear cart";

      if (status === 401) {
        set({ cart: null });
        return { success: false, message: "Unauthorized" };
      }

      toast.error(message);
      return { success: false, message };
    } finally {
      set({ isUpdatingCart: false });
    }
  },

  getCartTotals: () => {
    const cart = get().cart;

    if (!cart?.items?.length) {
      return {
        itemsCount: 0,
        subtotal: 0,
      };
    }

    const itemsCount = cart.items.reduce(
      (sum, item) => sum + Number(item.quantity || 0),
      0,
    );

    const subtotal = cart.items.reduce(
      (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0),
      0,
    );

    return {
      itemsCount,
      subtotal,
    };
  },

  resetCart: () => {
    set({ cart: null });
  },
}));

export default useCartStore;
