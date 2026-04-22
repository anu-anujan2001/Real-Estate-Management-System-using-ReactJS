import { Search } from "lucide-react";
import PageHeader from "../../components/common/PageHeader";
import ProductTable from "../../components/admin/products/ProductTable";
import { adminProducts } from "../../data/adminProductsData";

export default function AdminProductsPage() {
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
            />
          </label>

          <select className="select select-bordered w-full lg:w-48">
            <option>All Categories</option>
            <option>Shoes</option>
            <option>Electronics</option>
            <option>Men</option>
            <option>Women</option>
          </select>

          <select className="select select-bordered w-full lg:w-40">
            <option>All Status</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </div>
      </div>

      <div className="bg-base-100 rounded-2xl border border-base-300 p-4 md:p-5">
        <ProductTable/>
      </div>
    </div>
  );
}
