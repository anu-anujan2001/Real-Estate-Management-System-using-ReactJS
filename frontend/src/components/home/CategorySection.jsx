import { useEffect } from "react";
import useProductStore from "../../store/useProductStore";
import CategoryCard from "./CategoryCard";
import SectionHeader from "./SectionHeader";

export default function CategorySection() {
  const { categories, fetchCategorySummary, isLoadingCategories } =
    useProductStore();

  useEffect(() => {
    fetchCategorySummary();
  }, [fetchCategorySummary]);

  return (
    <section className="px-4 md:px-8 lg:px-12 py-10">
      <SectionHeader
        title="Shop by Category"
        subtitle="Explore products by category"
        actionText="View All"
        actionLink="/shop"
      />

      {isLoadingCategories ? (
        <div className="flex justify-center py-10">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : categories.length === 0 ? (
        <div className="text-center text-base-content/60 py-10">
          No categories available
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <CategoryCard key={category.title} category={category} />
          ))}
        </div>
      )}
    </section>
  );
}
