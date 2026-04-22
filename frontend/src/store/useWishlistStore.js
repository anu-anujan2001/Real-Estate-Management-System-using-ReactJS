import { create } from "zustand";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";

const getWishlistProductId = (item) => {
  if (!item?.product) return null;
  return typeof item.product === "string" ? item.product : item.product._id;
};

const useWishlistStore = create((set, get) => ({
  wishlist: [],
  isLoadingWishlist: false,
  isUpdatingWishlist: false,

  fetchWishlist: async () => {
    set({ isLoadingWishlist: true });

    try {
      const res = await axiosInstance.get("/wishlist");
      const products = res.data.wishlist?.products || [];
      set({ wishlist: products });
    } catch (err) {
      const status = err.response?.status;
      const message = err.response?.data?.message || "Failed to fetch wishlist";

      if (status === 401) {
        set({ wishlist: [] });
      } else {
        toast.error(message);
      }
    } finally {
      set({ isLoadingWishlist: false });
    }
  },

  addToWishlist: async (productId) => {
    set({ isUpdatingWishlist: true });

    try {
      const res = await axiosInstance.post("/wishlist", { productId });
      const products = res.data.wishlist?.products || [];
      set({ wishlist: products });
      toast.success("Added to wishlist");
    } catch (err) {
      const status = err.response?.status;
      const message = err.response?.data?.message || "Failed to add wishlist";

      if (status === 401) {
        set({ wishlist: [] });
      } else {
        toast.error(message);
      }
    } finally {
      set({ isUpdatingWishlist: false });
    }
  },

  removeFromWishlist: async (productId) => {
    set({ isUpdatingWishlist: true });

    try {
      const res = await axiosInstance.delete(`/wishlist/${productId}`);
      const products = res.data.wishlist?.products || [];
      set({ wishlist: products });
      toast.success("Removed from wishlist");
    } catch (err) {
      const status = err.response?.status;
      const message =
        err.response?.data?.message || "Failed to remove wishlist";

      if (status === 401) {
        set({ wishlist: [] });
      } else {
        toast.error(message);
      }
    } finally {
      set({ isUpdatingWishlist: false });
    }
  },

  toggleWishlist: async (productId) => {
    const { wishlist, addToWishlist, removeFromWishlist } = get();

    const exists = wishlist.some(
      (item) => getWishlistProductId(item) === productId,
    );

    if (exists) {
      await removeFromWishlist(productId);
    } else {
      await addToWishlist(productId);
    }
  },

  isInWishlist: (productId) => {
    const { wishlist } = get();
    return wishlist.some((item) => getWishlistProductId(item) === productId);
  },

  clearWishlist: () => set({ wishlist: [] }),
}));

export default useWishlistStore;
