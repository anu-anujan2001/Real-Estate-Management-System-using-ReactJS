import { Link } from "react-router-dom";

export default function CategoryCard({ category }) {
  return (
    <Link
      to={`/category/${category.title.toLowerCase()}`}
      className="relative rounded-2xl overflow-hidden h-56 group block"
    >
      <img
        src={category.image}
        alt={category.title}
        className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
      />
      <div className="absolute inset-0 bg-black/35 flex items-end p-5">
        <div>
          <h3 className="text-white text-xl font-bold">{category.title}</h3>
          <p className="text-white/80 text-sm mt-1">Explore collection</p>
        </div>
      </div>
    </Link>
  );
}
