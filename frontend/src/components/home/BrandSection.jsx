import { useEffect } from "react";
import { Link } from "react-router-dom";
import useProductStore from "../../store/useProductStore";
import SectionHeader from "./SectionHeader";

const brandLogos = {
  Nike: "https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg",
  Adidas:
    "https://upload.wikimedia.org/wikipedia/commons/2/20/Adidas_Logo.svg",
  Apple:
    "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
  
  Sony: "https://upload.wikimedia.org/wikipedia/commons/c/ca/Sony_logo.svg",
  Zara: "https://upload.wikimedia.org/wikipedia/commons/f/fd/Zara_Logo.svg",
  "H&M":
    "https://upload.wikimedia.org/wikipedia/commons/5/53/H%26M-Logo.svg",
  Gucci: "https://upload.wikimedia.org/wikipedia/commons/5/53/Gucci_logo.svg",
  LouisVuitton:
    "https://upload.wikimedia.org/wikipedia/commons/5/5e/Louis_Vuitton_Logo.svg",
  

};

export default function BrandSection() {
  const { brands, fetchBrandSummary, isLoadingBrands } = useProductStore();

  useEffect(() => {
    fetchBrandSummary();
  }, [fetchBrandSummary]);

  return (
    <section className="px-4 md:px-8 lg:px-12 py-10">
      <SectionHeader
        title="Popular Brands"
        subtitle="Trusted brands loved by customers"
        actionText="Shop All"
        actionLink="/shop"
      />

      {isLoadingBrands ? (
        <div className="flex justify-center py-10">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : brands.length === 0 ? (
        <div className="text-center text-base-content/60 py-10">
          No brands available
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-8 gap-4">
          {brands.map((brand) => (
            <Link
              key={brand.name}
              to={`/shop?brand=${encodeURIComponent(brand.name)}`}
              className="bg-base-100 border border-base-300 rounded-2xl p-4 text-center shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col items-center justify-center min-h-[120px]"
            >
              {brandLogos[brand.name] ? (
                <img
                  src={brandLogos[brand.name]}
                  alt={brand.name}
                  className="h-8 object-contain mb-3"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-base-200 flex items-center justify-center text-sm font-bold mb-3">
                  {brand.name.charAt(0).toUpperCase()}
                </div>
              )}

              <p className="font-semibold text-sm">{brand.name}</p>
              <p className="text-xs text-base-content/60 mt-1">
                {brand.count} products
              </p>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}