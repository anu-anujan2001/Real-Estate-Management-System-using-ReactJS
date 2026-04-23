import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import useProductStore from "../store/useProductStore";
import useCartStore from "../store/useCartStore";
import ShopLayout from "../components/shop/ShopLayout";

export default function ShopPage() {
  const [searchParams] = useSearchParams();

  const categoryFromUrl = searchParams.get("category") || "";
  const brandFromUrl = searchParams.get("brand") || "";
  const searchFromUrl = searchParams.get("search") || "";

  const {
    products,
    totalProducts,
    totalPages,
    currentPage,
    filters,
    fetchProducts,
    fetchBrandSummary,
    setFilters,
    resetFilters,
    isLoadingProducts,
  } = useProductStore();

  const { addToCart } = useCartStore();

  useEffect(() => {
    fetchBrandSummary();
  }, [fetchBrandSummary]);

  useEffect(() => {
    const initialFilters = {
      ...filters,
      category: categoryFromUrl,
      brand: brandFromUrl,
      search: searchFromUrl,
      page: 1,
    };

    setFilters(initialFilters);
    fetchProducts(initialFilters);
  }, [categoryFromUrl, brandFromUrl, searchFromUrl]);

  const updateAndFetch = (newValues) => {
    const updatedFilters = { ...filters, ...newValues };
    setFilters(updatedFilters);
    fetchProducts(updatedFilters);
  };

  const handleAddToCart = (product) => {
    addToCart({
      productId: product._id,
      quantity: 1,
    });
  };

  const handlers = {
    onSearchChange: (value) => updateAndFetch({ search: value, page: 1 }),
    onCategoryChange: (value) => updateAndFetch({ category: value, page: 1 }),
    onBrandChange: (value) => updateAndFetch({ brand: value, page: 1 }),
    onMinPriceChange: (value) => updateAndFetch({ minPrice: value, page: 1 }),
    onMaxPriceChange: (value) => updateAndFetch({ maxPrice: value, page: 1 }),
    onSortChange: (value) => updateAndFetch({ sort: value, page: 1 }),
    onPageChange: (page) => updateAndFetch({ page }),
    onReset: () => {
      const resetValues = {
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

      resetFilters();
      fetchProducts(resetValues);
    },
  };

  return (
    <ShopLayout
      products={products}
      totalProducts={totalProducts}
      totalPages={totalPages}
      currentPage={currentPage}
      filters={filters}
      isLoadingProducts={isLoadingProducts}
      onAddToCart={handleAddToCart}
      {...handlers}
    />
  );
}
