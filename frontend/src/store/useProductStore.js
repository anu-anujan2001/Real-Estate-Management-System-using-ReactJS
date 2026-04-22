import { create } from "zustand";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";

const defaultFilters = {
  search: "",
  category: "",
  brand: "",
  featured: "",
  active: "",
  minPrice: "",
  maxPrice: "",
  sort: "newest",
  page: 1,
  limit: 10,
};

const useProductStore = create((set, get) => ({
  products: [],
  featuredProducts: [],
  categoryProducts: [],
  selectedProduct: null,

  totalProducts: 0,
  totalPages: 1,
  currentPage: 1,

  filters: defaultFilters,

  isLoadingProducts: false,
  isLoadingProduct: false,
  isCreatingProduct: false,
  isUpdatingProduct: false,
  isDeletingProduct: false,
  isTogglingFeatured: false,
  isTogglingActive: false,

  setFilters: (newFilters) => {
    set((state) => ({
      filters: {
        ...state.filters,
        ...newFilters,
      },
    }));
  },

  resetFilters: () => {
    set({ filters: defaultFilters });
  },

  clearSelectedProduct: () => {
    set({ selectedProduct: null });
  },

  // FETCH PRODUCTS WITH FILTERS, PAGINATION, AND SORTING
  fetchProducts: async (customFilters = {}) => {
    set({ isLoadingProducts: true });

    try {
      const mergedFilters = { ...get().filters, ...customFilters };

      const cleanedFilters = Object.fromEntries(
        Object.entries(mergedFilters).filter(
          ([, value]) => value !== "" && value !== null && value !== undefined,
        ),
      );

      const res = await axiosInstance.get("/product", {
        params: cleanedFilters,
      });

      set({
        products: res.data.products || [],
        totalProducts: res.data.totalProducts || 0,
        totalPages: res.data.totalPages || 1,
        currentPage: res.data.currentPage || 1,
        filters: mergedFilters,
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch products");
    } finally {
      set({ isLoadingProducts: false });
    }
  },
  // FETCH SINGLE PRODUCT BY ID
  fetchProductById: async (id) => {
    set({ isLoadingProduct: true, selectedProduct: null });

    try {
      const res = await axiosInstance.get(`/product/${id}`);
      set({ selectedProduct: res.data.product || null });
    } catch (err) {
      set({ selectedProduct: null });
      toast.error(err.response?.data?.message || "Failed to fetch product");
    } finally {
      set({ isLoadingProduct: false });
    }
  },
  // CREATE NEW PRODUCT
  createProduct: async (formData) => {
    set({ isCreatingProduct: true });

    try {
      const res = await axiosInstance.post("/product", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      set((state) => ({
        products: [res.data.product, ...state.products],
      }));

      toast.success(res.data.message || "Product created successfully");
      return { success: true, product: res.data.product };
    } catch (err) {
      const message = err.response?.data?.message || "Failed to create product";
      toast.error(message);
      return { success: false, message };
    } finally {
      set({ isCreatingProduct: false });
    }
  },
  // UPDATE PRODUCT BY ID
  updateProduct: async (id, formData) => {
    set({ isUpdatingProduct: true });

    try {
      const res = await axiosInstance.put(`/product/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      set((state) => ({
        products: state.products.map((product) =>
          product._id === id ? res.data.product : product,
        ),
        featuredProducts: state.featuredProducts.map((product) =>
          product._id === id ? res.data.product : product,
        ),
        categoryProducts: state.categoryProducts.map((product) =>
          product._id === id ? res.data.product : product,
        ),
        selectedProduct:
          state.selectedProduct?._id === id
            ? res.data.product
            : state.selectedProduct,
      }));

      toast.success(res.data.message || "Product updated successfully");
      return { success: true, product: res.data.product };
    } catch (err) {
      const message = err.response?.data?.message || "Failed to update product";
      toast.error(message);
      return { success: false, message };
    } finally {
      set({ isUpdatingProduct: false });
    }
  },
  // DELETE PRODUCT BY ID
  deleteProduct: async (id) => {
    set({ isDeletingProduct: true });

    try {
      const res = await axiosInstance.delete(`/product/${id}`);

      set((state) => ({
        products: state.products.filter((product) => product._id !== id),
        featuredProducts: state.featuredProducts.filter(
          (product) => product._id !== id,
        ),
        categoryProducts: state.categoryProducts.filter(
          (product) => product._id !== id,
        ),
        selectedProduct:
          state.selectedProduct?._id === id ? null : state.selectedProduct,
      }));

      toast.success(res.data.message || "Product deleted successfully");
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || "Failed to delete product";
      toast.error(message);
      return { success: false, message };
    } finally {
      set({ isDeletingProduct: false });
    }
  },
  // TOGGLE FEATURED STATUS
  toggleFeaturedProduct: async (id) => {
    set({ isTogglingFeatured: true });

    try {
      const res = await axiosInstance.patch(`/product/${id}/toggle-featured`);

      set((state) => ({
        products: state.products.map((product) =>
          product._id === id ? res.data.product : product,
        ),
        featuredProducts: res.data.product.isFeatured
          ? [
              res.data.product,
              ...state.featuredProducts.filter((p) => p._id !== id),
            ]
          : state.featuredProducts.filter((p) => p._id !== id),
        categoryProducts: state.categoryProducts.map((product) =>
          product._id === id ? res.data.product : product,
        ),
        selectedProduct:
          state.selectedProduct?._id === id
            ? res.data.product
            : state.selectedProduct,
      }));

      toast.success(
        res.data.product.isFeatured
          ? "Product marked as featured"
          : "Product removed from featured",
      );

      return { success: true, product: res.data.product };
    } catch (err) {
      const message =
        err.response?.data?.message || "Failed to toggle featured status";
      toast.error(message);
      return { success: false, message };
    } finally {
      set({ isTogglingFeatured: false });
    }
  },
  // TOGGLE ACTIVE STATUS
  toggleActiveStatus: async (id) => {
    set({ isTogglingActive: true });

    try {
      const res = await axiosInstance.patch(`/product/${id}/toggle-active`);

      set((state) => ({
        products: state.products.map((product) =>
          product._id === id ? res.data.product : product,
        ),
        featuredProducts: state.featuredProducts.map((product) =>
          product._id === id ? res.data.product : product,
        ),
        categoryProducts: state.categoryProducts.map((product) =>
          product._id === id ? res.data.product : product,
        ),
        selectedProduct:
          state.selectedProduct?._id === id
            ? res.data.product
            : state.selectedProduct,
      }));

      toast.success(
        res.data.product.isActive
          ? "Product activated successfully"
          : "Product deactivated successfully",
      );

      return { success: true, product: res.data.product };
    } catch (err) {
      const message =
        err.response?.data?.message || "Failed to toggle product status";
      toast.error(message);
      return { success: false, message };
    } finally {
      set({ isTogglingActive: false });
    }
  },
}));

export default useProductStore;
