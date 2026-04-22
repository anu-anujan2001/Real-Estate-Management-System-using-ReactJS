export default function ShopTopbar({
  productsCount,
  totalProducts,
  currentPage,
  totalPages,
  sortValue,
  onSortChange,
}) {
  return (
    <div className="bg-base-100 rounded-2xl border border-base-300 p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <p className="font-medium">
          Showing {productsCount} of {totalProducts} products
        </p>
        <p className="text-sm text-base-content/60">
          Page {currentPage} of {totalPages}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-sm text-base-content/60">Sort by</span>
        <select
          className="select select-bordered"
          value={sortValue}
          onChange={(e) => onSortChange(e.target.value)}
        >
          <option value="newest">Newest</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="name_asc">Name: A to Z</option>
          <option value="name_desc">Name: Z to A</option>
        </select>
      </div>
    </div>
  );
}
