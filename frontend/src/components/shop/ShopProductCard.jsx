import { Link, useNavigate } from "react-router-dom";
import { Heart, ShoppingCart, Star, Eye } from "lucide-react";
import toast from "react-hot-toast";
import useAuthStore from "../../store/useAuthStore";

export default function ShopProductCard({
  product,
  isWishlisted = false,
  onToggleWishlist,
  onAddToCart,
}) {
  const inStock = Number(product?.stock || 0) > 0;
  const navigate = useNavigate();
  const { authUser } = useAuthStore();

  const requireLogin = () => {
    if (!authUser) {
      toast.error("Please login first");
      navigate("/login");
      return false;
    }
    return true;
  };

  const handleWishlistClick = () => {
    if (!requireLogin()) return;
    onToggleWishlist?.(product._id);
  };

  const handleAddToCartClick = () => {
    if (!requireLogin()) return;
    onAddToCart?.(product);
  };

  return (
    <div className="group card bg-base-100 border border-base-300 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
      <figure className="relative h-64 bg-base-200 overflow-hidden">
        <img
          src={product.images?.[0] || "/no-image.png"}
          alt={product.name}
          className="w-full h-full object-cover transition duration-500 group-hover:scale-110"
        />

        <div className="absolute top-3 left-3 z-20">
          <span
            className={`badge border-none ${
              inStock ? "badge-success text-white" : "badge-error text-white"
            }`}
          >
            {inStock ? "In Stock" : "Out of Stock"}
          </span>
        </div>

        <div className="absolute top-3 right-3 z-20">
          <button
            type="button"
            onClick={handleWishlistClick}
            className={`btn btn-sm btn-circle border-none shadow-md ${
              isWishlisted
                ? "bg-primary text-primary-content"
                : "bg-base-100/90 text-base-content"
            }`}
          >
            <Heart size={16} className={isWishlisted ? "fill-current" : ""} />
          </button>
        </div>

        <div className="absolute inset-x-0 bottom-0 z-20 translate-y-full group-hover:translate-y-0 transition duration-300 px-4 pb-4">
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={handleAddToCartClick}
              disabled={!inStock}
              className="btn btn-primary rounded-xl"
            >
              <ShoppingCart size={16} />
              Add
            </button>

            <Link
              to={`/product/${product._id}`}
              className="btn btn-outline bg-base-100/90 rounded-xl"
            >
              <Eye size={16} />
              View
            </Link>
          </div>
        </div>

        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition duration-300"></div>
      </figure>

      <div className="card-body p-4">
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs uppercase tracking-wide text-base-content/60 line-clamp-1">
            {product.category} {product.brand ? `• ${product.brand}` : ""}
          </p>

          <div className="flex items-center gap-1 text-sm text-base-content/70 shrink-0">
            <Star size={14} className="fill-yellow-400 text-yellow-400" />
            <span>{Number(product.rating || 0).toFixed(1)}</span>
          </div>
        </div>

        <h3 className="font-semibold text-lg line-clamp-1">{product.name}</h3>

        <p className="text-sm text-base-content/60 line-clamp-2 min-h-[40px]">
          {product.description}
        </p>

        <div className="flex items-center justify-between mt-4">
          <span className="text-xl font-bold text-primary">
            Rs. {Number(product.price || 0).toLocaleString()}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-4 md:hidden">
          <button
            type="button"
            onClick={handleAddToCartClick}
            disabled={!inStock}
            className="btn btn-primary rounded-xl"
          >
            <ShoppingCart size={16} />
            Add
          </button>

          <Link
            to={`/product/${product._id}`}
            className="btn btn-outline rounded-xl"
          >
            <Eye size={16} />
            View
          </Link>
        </div>
      </div>
    </div>
  );
}
