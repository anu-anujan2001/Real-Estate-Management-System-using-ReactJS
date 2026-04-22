import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, ShoppingCart, Trash2, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import useWishlistStore from "../store/useWishlistStore";
import useAuthStore from "../store/useAuthStore";

export default function WishlistPage() {
  const navigate = useNavigate();
  const { authUser } = useAuthStore();
  const {
    wishlist,
    fetchWishlist,
    removeFromWishlist,
    isLoadingWishlist,
    isUpdatingWishlist,
  } = useWishlistStore();

  useEffect(() => {
    if (authUser) {
      fetchWishlist();
    }
  }, [authUser, fetchWishlist]);

  const handleRemove = async (productId) => {
    await removeFromWishlist(productId);
  };

  const handleAddToCart = (product) => {
    toast.success(`${product.name} added to cart`);
  };

  if (!authUser) {
    return (
      <div className="min-h-screen bg-base-200">
        <div className="max-w-5xl mx-auto px-4 md:px-8 py-10">
          <div className="bg-base-100 border border-base-300 rounded-2xl p-10 text-center">
            <h1 className="text-3xl font-bold mb-3">Please login first</h1>
            <p className="text-base-content/60 mb-6">
              Login to view and manage your wishlist.
            </p>
            <Link to="/login" className="btn btn-primary rounded-xl">
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const wishlistProducts = wishlist.map((item) => item.product).filter(Boolean);

  return (
    <div className="min-h-screen bg-base-200">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-8">
        <button
          onClick={() => navigate(-1)}
          className="btn btn-ghost rounded-xl mb-6"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">My Wishlist</h1>
            <p className="text-base-content/60 mt-2">
              Save your favorite products for later
            </p>
          </div>

          <div className="badge badge-outline badge-lg px-4 py-4">
            {wishlistProducts.length} item
            {wishlistProducts.length !== 1 ? "s" : ""}
          </div>
        </div>

        {isLoadingWishlist ? (
          <div className="flex justify-center py-20">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : wishlistProducts.length === 0 ? (
          <div className="bg-base-100 border border-base-300 rounded-2xl p-12 text-center">
            <div className="w-20 h-20 mx-auto rounded-full bg-base-200 flex items-center justify-center mb-5">
              <Heart className="w-10 h-10 text-base-content/50" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Your wishlist is empty</h2>
            <p className="text-base-content/60 mb-6">
              Explore products and add your favorites to wishlist.
            </p>
            <Link to="/shop" className="btn btn-primary rounded-xl">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {wishlistProducts.map((product) => (
                <div
                  key={product._id}
                  className="bg-base-100 border border-base-300 rounded-2xl p-4 md:p-5 flex flex-col sm:flex-row gap-4"
                >
                  <Link
                    to={`/product/${product._id}`}
                    className="w-full sm:w-36 h-36 rounded-xl overflow-hidden bg-base-200 shrink-0"
                  >
                    <img
                      src={product.images?.[0] || "/no-image.png"}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </Link>

                  <div className="flex-1 flex flex-col justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-base-content/60">
                        {product.category}{" "}
                        {product.brand ? `• ${product.brand}` : ""}
                      </p>

                      <Link to={`/product/${product._id}`}>
                        <h3 className="text-lg font-semibold hover:text-primary transition">
                          {product.name}
                        </h3>
                      </Link>

                      <p className="text-sm text-base-content/60 line-clamp-2 mt-1">
                        {product.description}
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div>
                        <p className="text-xl font-bold text-primary">
                          Rs. {Number(product.price || 0).toLocaleString()}
                        </p>
                        {product.stock > 0 ? (
                          <p className="text-sm text-success">In stock</p>
                        ) : (
                          <p className="text-sm text-error">Out of stock</p>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleAddToCart(product)}
                          disabled={product.stock <= 0}
                          className="btn btn-primary rounded-xl"
                        >
                          <ShoppingCart size={16} />
                          Add to Cart
                        </button>

                        <button
                          type="button"
                          onClick={() => handleRemove(product._id)}
                          disabled={isUpdatingWishlist}
                          className="btn btn-outline btn-error rounded-xl"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-1">
              <div className="bg-base-100 border border-base-300 rounded-2xl p-5 sticky top-24">
                <h2 className="text-xl font-bold mb-4">Wishlist Summary</h2>

                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span>Total Items</span>
                    <span className="font-medium">
                      {wishlistProducts.length}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span>Available Items</span>
                    <span className="font-medium">
                      {
                        wishlistProducts.filter((product) => product.stock > 0)
                          .length
                      }
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span>Out of Stock</span>
                    <span className="font-medium">
                      {
                        wishlistProducts.filter((product) => product.stock <= 0)
                          .length
                      }
                    </span>
                  </div>
                </div>

                <div className="divider"></div>

                <Link to="/shop" className="btn btn-outline w-full rounded-xl">
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
