import { useEffect, useState } from "react";
import useProductStore from "../../store/useProductStore";
import ProductCard from "./ProductCard";
import SectionHeader from "./SectionHeader";

export default function NewArrivals() {
  const { fetchProducts } = useProductStore();
  const [newArrivals, setNewArrivals] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadNewArrivals = async () => {
      setIsLoading(true);

      try {
        const res = await fetchProducts({
          sort: "newest",
          page: 1,
          limit: 4,
          active: "true",
        });

        if (res?.success) {
          setNewArrivals(res.products || []);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadNewArrivals();
  }, [fetchProducts]);

  return (
    <section className="px-4 md:px-8 lg:px-12 py-10">
      <SectionHeader
        title="New Arrivals"
        subtitle="Fresh products just added to the store"
        actionText="Explore More"
        actionLink="/shop"
      />

      {isLoading ? (
        <div className="flex justify-center py-10">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : newArrivals.length === 0 ? (
        <div className="text-center text-base-content/60 py-10">
          No new arrivals available
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {newArrivals.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}
