import { categories } from "../../data/homeData";
import CategoryCard from "./CategoryCard";
import SectionHeader from "./SectionHeader";

export default function CategorySection() {
  return (
    <section className="px-4 md:px-8 lg:px-12 py-10">
      <SectionHeader
        title="Shop by Category"
        subtitle="Find your perfect products by category"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>
    </section>
  );
}
