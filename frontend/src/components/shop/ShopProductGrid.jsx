import ShopProductCard from "./ShopProductCard";

export default function ShopProductGrid({
  products,
  isLoading,
  wishlistItems = [],
  onToggleWishlist,
  onAddToCart,
}) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="bg-base-100 border border-base-300 rounded-2xl overflow-hidden shadow-sm"
          >
            <div className="skeleton h-64 w-full"></div>
            <div className="p-4 space-y-3">
              <div className="skeleton h-4 w-32"></div>
              <div className="skeleton h-6 w-48"></div>
              <div className="skeleton h-4 w-full"></div>
              <div className="skeleton h-4 w-4/5"></div>
              <div className="skeleton h-8 w-24 mt-4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="bg-base-100 rounded-2xl border border-base-300 p-12 text-center text-base-content/60">
        No products found
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
      {products.map((product) => {
        const isWishlisted = wishlistItems.some(
          (item) => item._id === product._id,
        );

        return (
          <ShopProductCard
            key={product._id}
            product={product}
            isWishlisted={isWishlisted}
            onToggleWishlist={onToggleWishlist}
            onAddToCart={onAddToCart}
          />
        );
      })}
    </div>
  );
}
