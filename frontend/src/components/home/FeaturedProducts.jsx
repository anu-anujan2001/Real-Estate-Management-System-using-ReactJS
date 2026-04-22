import { useEffect } from "react";
import useProductStore from "../../store/useProductStore";
import ProductCard from "./ProductCard";
import SectionHeader from "./SectionHeader";

export default function FeaturedProducts() {
  const { featuredProducts, fetchFeaturedProducts, isLoadingProducts } =
    useProductStore();

  useEffect(() => {
    fetchFeaturedProducts();
  }, [fetchFeaturedProducts]);

  return (
    <section className="px-4 md:px-8 lg:px-12 py-10">
      <SectionHeader
        title="Featured Products"
        subtitle="Top picks chosen for you"
        actionText="View All"
        actionLink="/shop"
      />

      {isLoadingProducts ? (
        <div className="flex justify-center py-10">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : featuredProducts.length === 0 ? (
        <div className="text-center text-base-content/60 py-10">
          No featured products available
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}
