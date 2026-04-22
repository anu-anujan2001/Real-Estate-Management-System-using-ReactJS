import { Search, SlidersHorizontal } from "lucide-react";
import useProductStore from "../../store/useProductStore";

export default function ShopSidebar({
  filters,
  onSearchChange,
  onCategoryChange,
  onBrandChange,
  onMinPriceChange,
  onMaxPriceChange,
  onReset,
}) {
  const { brands } = useProductStore();

  return (
    <aside className="bg-base-100 rounded-2xl border border-base-300 p-5 space-y-5 lg:sticky lg:top-24">
      <div className="flex items-center gap-2">
        <SlidersHorizontal size={18} />
        <h2 className="text-lg font-semibold">Filters</h2>
      </div>

      <label className="input input-bordered flex items-center gap-2">
        <Search size={16} />
        <input
          type="text"
          className="grow"
          placeholder="Search products..."
          value={filters.search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </label>

      <div>
        <label className="label font-medium">Category</label>
        <select
          className="select select-bordered w-full"
          value={filters.category || "All Categories"}
          onChange={(e) =>
            onCategoryChange(
              e.target.value === "All Categories" ? "" : e.target.value,
            )
          }
        >
          <option>All Categories</option>
          <option>Footwear</option>
          <option>Clothing</option>
          <option>Electronics</option>
          <option>Accessories</option>
          <option>Beauty</option>
          <option>Home & Living</option>
        </select>
      </div>

      <div>
        <label className="label font-medium">Brand</label>
        <select
          className="select select-bordered w-full"
          value={filters.brand || "All Brands"}
          onChange={(e) =>
            onBrandChange(e.target.value === "All Brands" ? "" : e.target.value)
          }
        >
          <option>All Brands</option>
          {brands.map((brand) => (
            <option key={brand.name} value={brand.name}>
              {brand.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label font-medium">Min Price</label>
          <input
            type="number"
            className="input input-bordered w-full"
            placeholder="0"
            value={filters.minPrice}
            onChange={(e) => onMinPriceChange(e.target.value)}
          />
        </div>

        <div>
          <label className="label font-medium">Max Price</label>
          <input
            type="number"
            className="input input-bordered w-full"
            placeholder="100000"
            value={filters.maxPrice}
            onChange={(e) => onMaxPriceChange(e.target.value)}
          />
        </div>
      </div>

      <button onClick={onReset} className="btn btn-outline w-full">
        Reset Filters
      </button>
    </aside>
  );
}
