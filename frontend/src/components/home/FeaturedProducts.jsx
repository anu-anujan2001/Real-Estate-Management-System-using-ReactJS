import { products } from "../../data/homeData";
import ProductCard from "./ProductCard";
import SectionHeader from "./SectionHeader";

export default function FeaturedProducts() {
  const featuredProducts = products.filter((product) => product.isFeatured);

  return (
    <section className="px-4 md:px-8 lg:px-12 py-10">
      <SectionHeader
        title="Featured Products"
        subtitle="Top picks chosen for you"
        actionText="View All"
        actionLink="/shop"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {featuredProducts.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </section>
  );
}
