import { useEffect } from "react";
import useProductStore from "../store/useProductStore";
import CategoryCard from "../components/home/CategoryCard";

export default function CategoriesPage() {
  const { categories, fetchCategorySummary, isLoadingCategories } =
    useProductStore();

  useEffect(() => {
    fetchCategorySummary();
  }, [fetchCategorySummary]);

  return (
    <div className="min-h-screen bg-base-200">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold">Categories</h1>
          <p className="text-base-content/60 mt-2">
            Explore products by category
          </p>
        </div>

        {isLoadingCategories ? (
          <div className="flex justify-center py-16">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : categories.length === 0 ? (
          <div className="bg-base-100 rounded-2xl border border-base-300 p-12 text-center text-base-content/60">
            No categories available
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <CategoryCard key={category.title} category={category} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
