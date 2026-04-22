import { useEffect } from "react";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import useAuthStore from "../../store/useAuthStore";
import useWishlistStore from "../../store/useWishlistStore";

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const { authUser } = useAuthStore();

  const {
    wishlist,
    fetchWishlist,
    toggleWishlist,
    isLoadingWishlist,
    clearWishlist,
  } = useWishlistStore();

  useEffect(() => {
    if (authUser) {
      fetchWishlist();
    } else {
      clearWishlist();
    }
  }, [authUser, fetchWishlist, clearWishlist]);

  const requireLogin = () => {
    if (!authUser) {
      toast.error("Please login first");
      navigate("/login");
      return false;
    }

    if (!authUser.isVerified) {
      toast.error("Please verify your email first");
      navigate("/verify-email");
      return false;
    }

    return true;
  };

  const isWishlisted = authUser
    ? wishlist.some((item) => {
        if (!item?.product) return false;
        return typeof item.product === "string"
          ? item.product === product._id
          : item.product._id === product._id;
      })
    : false;

  const handleWishlist = () => {
    if (!requireLogin()) return;
    toggleWishlist(product._id);
  };

  const handleAddToCart = () => {
    if (!requireLogin()) return;
    toast.success("Added to cart");
  };

  return (
    <div className="card bg-base-100 border border-base-300 shadow-sm hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden group">
      <figure className="relative bg-base-200 h-60 overflow-hidden">
        <img
          src={product.images?.[0] || "/no-image.png"}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
        />

        <button
          type="button"
          onClick={handleWishlist}
          disabled={isLoadingWishlist}
          className={`btn btn-sm btn-circle absolute top-3 right-3 border-none shadow ${
            isWishlisted
              ? "bg-primary text-primary-content"
              : "bg-base-100/90 text-base-content"
          }`}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? "fill-current" : ""}`} />
        </button>

        {product.isFeatured && (
          <span className="badge badge-primary absolute top-3 left-3">
            Featured
          </span>
        )}
      </figure>

      <div className="card-body p-4">
        <p className="text-xs uppercase tracking-wide text-base-content/60">
          {product.category} {product.brand ? `• ${product.brand}` : ""}
        </p>

        <Link to={`/product/${product._id}`}>
          <h3 className="font-semibold text-lg line-clamp-1 hover:text-primary transition">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center gap-1 text-sm mt-1">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span>{Number(product.rating || 0).toFixed(1)}</span>
          <span className="text-base-content/50">
            ({product.numReviews || 0})
          </span>
        </div>

        <div className="flex items-center justify-between mt-3">
          <span className="text-xl font-bold text-primary">
            Rs. {Number(product.price || 0).toLocaleString()}
          </span>

          <button
            type="button"
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            className="btn btn-primary btn-sm rounded-full"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>

        {product.stock > 0 ? (
          <p className="text-sm text-success mt-2">In stock</p>
        ) : (
          <p className="text-sm text-error mt-2">Out of stock</p>
        )}
      </div>
    </div>
  );
}
