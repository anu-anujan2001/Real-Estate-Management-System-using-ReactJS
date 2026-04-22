import { useEffect } from "react";
import { Search } from "lucide-react";
import PageHeader from "../../components/common/PageHeader";
import ProductTable from "../../components/admin/products/ProductTable";
import useProductStore from "../../store/useProductStore";

export default function AdminProductsPage() {
  const { products, filters, setFilters, fetchProducts, isLoadingProducts } =
    useProductStore();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setFilters({ search: value, page: 1 });
    fetchProducts({ search: value, page: 1 });
  };

  const handleCategoryChange = (e) => {
    const value = e.target.value === "All Categories" ? "" : e.target.value;
    setFilters({ category: value, page: 1 });
    fetchProducts({ category: value, page: 1 });
  };

  const handleStatusChange = (e) => {
    let value = "";

    if (e.target.value === "Active") value = "true";
    if (e.target.value === "Inactive") value = "false";

    setFilters({ active: value, page: 1 });
    fetchProducts({ active: value, page: 1 });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Products"
        subtitle="Manage all products in your store"
        buttonText="Add Product"
        buttonLink="/admin/products/create"
      />

      <div className="bg-base-100 rounded-2xl border border-base-300 p-4 md:p-5">
        <div className="flex flex-col lg:flex-row gap-3">
          <label className="input input-bordered flex items-center gap-2 w-full lg:max-w-sm">
            <Search size={16} />
            <input
              type="text"
              className="grow"
              placeholder="Search products..."
              value={filters.search}
              onChange={handleSearchChange}
            />
          </label>

          <select
            className="select select-bordered w-full lg:w-48"
            value={filters.category || "All Categories"}
            onChange={handleCategoryChange}
          >
            <option>All Categories</option>
            <option>Footwear</option>
            <option>Electronics</option>
            <option>Clothing</option>
            <option>Accessories</option>
            <option>Beauty</option>
          </select>

          <select
            className="select select-bordered w-full lg:w-40"
            value={
              filters.active === "true"
                ? "Active"
                : filters.active === "false"
                  ? "Inactive"
                  : "All Status"
            }
            onChange={handleStatusChange}
          >
            <option>All Status</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </div>
      </div>

      <div className="bg-base-100 rounded-2xl border border-base-300 p-4 md:p-5">
        {isLoadingProducts ? (
          <div className="flex justify-center py-10">
            <span className="loading loading-spinner loading-md"></span>
          </div>
        ) : products.length > 0 ? (
          <ProductTable />
        ) : (
          <div className="text-center py-10 text-base-content/60">
            No products found
          </div>
        )}
      </div>
    </div>
  );
}
