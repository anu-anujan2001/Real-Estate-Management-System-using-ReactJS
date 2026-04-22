import { brands } from "../../data/homeData";
import SectionHeader from "./SectionHeader";

export default function BrandSection() {
  return (
    <section className="px-4 md:px-8 lg:px-12 py-10">
      <SectionHeader
        title="Popular Brands"
        subtitle="Trusted brands loved by customers"
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-4">
        {brands.map((brand, index) => (
          <div
            key={index}
            className="bg-base-200 rounded-2xl p-5 text-center font-semibold shadow-sm hover:shadow-md transition"
          >
            {brand}
          </div>
        ))}
      </div>
    </section>
  );
}
