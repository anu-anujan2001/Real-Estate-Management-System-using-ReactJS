import { Link } from "react-router-dom";

export default function CategoryCard({ category }) {
  return (
    <Link
      to={`/shop?category=${encodeURIComponent(category.title)}`}
      className="relative rounded-2xl overflow-hidden h-64 group block shadow-sm hover:shadow-xl transition-all duration-300"
    >
      <img
        src={category.image || "/no-image.png"}
        alt={category.title}
        className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

      <div className="absolute bottom-0 p-5 w-full">
        <h3 className="text-white text-xl font-bold">{category.title}</h3>
        <p className="text-white/80 text-sm">{category.count || 0} products</p>
        <p className="text-white/70 text-sm mt-1">Explore collection →</p>
      </div>
    </Link>
  );
}
