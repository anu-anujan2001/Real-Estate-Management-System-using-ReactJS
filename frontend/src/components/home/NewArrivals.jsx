import { products } from "../../data/homeData";
import ProductCard from "./ProductCard";
import SectionHeader from "./SectionHeader";

export default function NewArrivals() {
  const newArrivals = [...products]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 4);

  return (
    <section className="px-4 md:px-8 lg:px-12 py-10">
      <SectionHeader
        title="New Arrivals"
        subtitle="Fresh products just added to the store"
        actionText="Explore More"
        actionLink="/shop"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {newArrivals.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </section>
  );
}
