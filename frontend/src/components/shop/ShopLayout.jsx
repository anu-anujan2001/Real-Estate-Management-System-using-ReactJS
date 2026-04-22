import ShopSidebar from "./ShopSidebar";
import ShopTopbar from "./ShopTopbar";
import ShopProductGrid from "./ShopProductGrid";
import ShopPagination from "./ShopPagination";

export default function ShopLayout({
  products,
  totalProducts,
  totalPages,
  currentPage,
  filters,
  isLoadingProducts,
  onSearchChange,
  onCategoryChange,
  onBrandChange,
  onMinPriceChange,
  onMaxPriceChange,
  onSortChange,
  onPageChange,
  onReset,
}) {
  return (
    <div className="min-h-screen bg-base-200">
      <div className="max-w-7xl mx-auto px-4 md:px-6 pt-3 pb-6">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_minmax(0,1fr)] gap-6 items-start">
          <ShopSidebar
            filters={filters}
            onSearchChange={onSearchChange}
            onCategoryChange={onCategoryChange}
            onBrandChange={onBrandChange}
            onMinPriceChange={onMinPriceChange}
            onMaxPriceChange={onMaxPriceChange}
            onReset={onReset}
          />

          <div className="min-w-0 space-y-6">
            <ShopTopbar
              productsCount={products.length}
              totalProducts={totalProducts}
              currentPage={currentPage}
              totalPages={totalPages}
              sortValue={filters.sort}
              onSortChange={onSortChange}
            />

            <ShopProductGrid
              products={products}
              isLoading={isLoadingProducts}
            />

            <ShopPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={onPageChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
