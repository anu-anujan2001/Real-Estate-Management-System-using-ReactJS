import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  Heart,
  ShoppingCart,
  Star,
  Minus,
  Plus,
  ArrowLeft,
} from "lucide-react";
import toast from "react-hot-toast";
import useAuthStore from "../store/useAuthStore";
import useProductStore from "../store/useProductStore";
import useWishlistStore from "../store/useWishlistStore";
import ShopProductCard from "../components/shop/ShopProductCard";
import useCartStore from "../store/useCartStore";

export default function SingleProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { authUser } = useAuthStore();
  const { addToCart } = useCartStore();
  const {
    selectedProduct,
    isLoadingProduct,
    fetchProductById,
    clearSelectedProduct,
    fetchProducts,
  } = useProductStore();

  const {
    wishlist,
    fetchWishlist,
    toggleWishlist,
    clearWishlist,
    isUpdatingWishlist,
  } = useWishlistStore();

  const [selectedImage, setSelectedImage] = useState("");
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [isLoadingRelated, setIsLoadingRelated] = useState(false);

  useEffect(() => {
    if (id) {
      fetchProductById(id);
    }

    return () => {
      clearSelectedProduct();
    };
  }, [id, fetchProductById, clearSelectedProduct]);

  useEffect(() => {
    if (authUser) {
      fetchWishlist();
    } else {
      clearWishlist();
    }
  }, [authUser, fetchWishlist, clearWishlist]);

  useEffect(() => {
    if (selectedProduct?.images?.length > 0) {
      setSelectedImage(selectedProduct.images[0]);
    }
  }, [selectedProduct]);

  useEffect(() => {
    if (selectedProduct?.variants?.length > 0) {
      setSelectedVariantIndex(0);
    } else {
      setSelectedVariantIndex(null);
    }
    setQuantity(1);
  }, [selectedProduct]);

  useEffect(() => {
    const loadRelatedProducts = async () => {
      if (!selectedProduct?.category) return;

      setIsLoadingRelated(true);

      try {
        const res = await fetchProducts({
          category: selectedProduct.category,
          limit: 4,
          page: 1,
          active: "true",
        });

        if (res?.success) {
          const filtered = (res.products || []).filter(
            (product) => product._id !== selectedProduct._id,
          );
          setRelatedProducts(filtered.slice(0, 4));
        }
      } finally {
        setIsLoadingRelated(false);
      }
    };

    loadRelatedProducts();
  }, [selectedProduct, fetchProducts]);

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

  const getWishlistProductId = (item) => {
    if (!item?.product) return null;
    return typeof item.product === "string" ? item.product : item.product._id;
  };

  const isWishlisted =
    authUser && selectedProduct
      ? wishlist.some(
          (item) => getWishlistProductId(item) === selectedProduct._id,
        )
      : false;

  const selectedVariant =
    selectedVariantIndex !== null &&
    selectedProduct?.variants?.[selectedVariantIndex]
      ? selectedProduct.variants[selectedVariantIndex]
      : null;

  const hasVariants = Boolean(selectedProduct?.variants?.length);

  const displayPrice =
    selectedVariant?.price !== undefined && selectedVariant?.price !== null
      ? selectedVariant.price
      : selectedProduct?.price || 0;

  const displayStock = hasVariants
    ? Number(selectedVariant?.stock || 0)
    : Number(selectedProduct?.stock || 0);

  const inStock = displayStock > 0;

  const variantLabel = useMemo(() => {
    if (!selectedVariant) return "";
    const parts = [];
    if (selectedVariant.size) parts.push(`Size: ${selectedVariant.size}`);
    if (selectedVariant.color) parts.push(`Color: ${selectedVariant.color}`);
    return parts.join(" • ");
  }, [selectedVariant]);

  const handleWishlist = async () => {
    if (!requireLogin()) return;
    await toggleWishlist(selectedProduct._id);
  };

  const handleAddToCart = async () => {
    if (!requireLogin()) return;

    if (hasVariants && !selectedVariant) {
      toast.error("Please select a variant");
      return;
    }

    await addToCart({
      productId: selectedProduct._id,
      quantity,
      variant: selectedVariant
        ? {
            size: selectedVariant.size || "",
            color: selectedVariant.color || "",
          }
        : null,
    });
  };

  const handleIncrease = () => {
    if (quantity < displayStock) {
      setQuantity((prev) => prev + 1);
    }
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleVariantSelect = (index) => {
    setSelectedVariantIndex(index);
    setQuantity(1);
  };

  if (isLoadingProduct) {
    return (
      <div className="min-h-screen bg-base-200">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-10">
          <div className="flex justify-center py-20">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        </div>
      </div>
    );
  }

  if (!selectedProduct) {
    return (
      <div className="min-h-screen bg-base-200">
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-10">
          <div className="bg-base-100 rounded-2xl border border-base-300 p-10 text-center">
            <h2 className="text-2xl font-bold mb-3">Product not found</h2>
            <p className="text-base-content/60 mb-6">
              The product you are looking for does not exist.
            </p>
            <Link to="/shop" className="btn btn-primary rounded-xl">
              Back to Shop
            </Link>
          </div>
        </div>
      </div>
    );
  }

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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="bg-base-100 rounded-2xl border border-base-300 overflow-hidden">
              <img
                src={
                  selectedImage ||
                  selectedProduct.images?.[0] ||
                  "/no-image.png"
                }
                alt={selectedProduct.name}
                className="w-full h-[420px] object-cover"
              />
            </div>

            {selectedProduct.images?.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {selectedProduct.images.map((image, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setSelectedImage(image)}
                    className={`rounded-xl overflow-hidden border-2 ${
                      selectedImage === image
                        ? "border-primary"
                        : "border-base-300"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`product-${index}`}
                      className="w-full h-24 object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="bg-base-100 rounded-2xl border border-base-300 p-6 md:p-8">
            <p className="text-sm uppercase tracking-wide text-base-content/60">
              {selectedProduct.category}
              {selectedProduct.brand ? ` • ${selectedProduct.brand}` : ""}
            </p>

            <h1 className="text-3xl md:text-4xl font-bold mt-2">
              {selectedProduct.name}
            </h1>

            <div className="flex items-center gap-4 mt-4 flex-wrap">
              <div className="flex items-center gap-1">
                <Star size={18} className="fill-yellow-400 text-yellow-400" />
                <span className="font-medium">
                  {Number(selectedProduct.rating || 0).toFixed(1)}
                </span>
              </div>

              <span className="text-base-content/60">
                {selectedProduct.numReviews || 0} reviews
              </span>

              <span
                className={`badge ${inStock ? "badge-success" : "badge-error"}`}
              >
                {inStock ? "In Stock" : "Out of Stock"}
              </span>
            </div>

            <div className="mt-6">
              <p className="text-3xl font-bold text-primary">
                Rs. {Number(displayPrice || 0).toLocaleString()}
              </p>
              {hasVariants && variantLabel && (
                <p className="text-sm text-base-content/60 mt-2">
                  Selected: {variantLabel}
                </p>
              )}
              <p className="text-sm text-base-content/60 mt-1">
                Available stock: {displayStock}
              </p>
            </div>

            <div className="mt-6">
              <h3 className="font-semibold text-lg mb-2">Description</h3>
              <p className="text-base-content/70 leading-7">
                {selectedProduct.description}
              </p>
            </div>

            {hasVariants && (
              <div className="mt-6">
                <h3 className="font-semibold text-lg mb-3">Select Variant</h3>

                <div className="flex flex-wrap gap-3">
                  {selectedProduct.variants.map((variant, index) => {
                    const isSelected = selectedVariantIndex === index;
                    const variantStock = Number(variant.stock || 0);
                    const variantPrice =
                      variant.price !== undefined && variant.price !== null
                        ? variant.price
                        : selectedProduct.price;

                    return (
                      <button
                        key={`${variant.size}-${variant.color}-${index}`}
                        type="button"
                        onClick={() => handleVariantSelect(index)}
                        className={`rounded-xl border px-4 py-3 text-left min-w-[160px] transition ${
                          isSelected
                            ? "border-primary bg-primary text-white"
                            : "border-base-300 bg-base-200 hover:border-primary"
                        }`}
                      >
                        <div className="font-medium">
                          {variant.size || "Default Size"}
                          {variant.color ? ` • ${variant.color}` : ""}
                        </div>
                        <div
                          className={`text-sm mt-1 ${
                            isSelected
                              ? "text-white/90"
                              : "text-base-content/60"
                          }`}
                        >
                          Rs. {Number(variantPrice || 0).toLocaleString()}
                        </div>
                        <div
                          className={`text-xs mt-1 ${
                            isSelected
                              ? "text-white/80"
                              : "text-base-content/50"
                          }`}
                        >
                          Stock: {variantStock}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="mt-6">
              <h3 className="font-semibold text-lg mb-3">Quantity</h3>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleDecrease}
                  className="btn btn-outline btn-square rounded-xl"
                >
                  <Minus size={16} />
                </button>

                <span className="w-12 text-center font-semibold text-lg">
                  {quantity}
                </span>

                <button
                  onClick={handleIncrease}
                  className="btn btn-outline btn-square rounded-xl"
                  disabled={!inStock || quantity >= displayStock}
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
              <button
                onClick={handleAddToCart}
                disabled={!inStock}
                className="btn btn-primary rounded-xl"
              >
                <ShoppingCart size={18} />
                Add to Cart
              </button>

              <button
                onClick={handleWishlist}
                disabled={isUpdatingWishlist}
                className={`btn rounded-xl ${
                  isWishlisted ? "btn-primary" : "btn-outline"
                }`}
              >
                <Heart
                  size={18}
                  className={isWishlisted ? "fill-current" : ""}
                />
                {isWishlisted ? "Wishlisted" : "Wishlist"}
              </button>
            </div>

            {selectedProduct.sku && (
              <div className="mt-6 pt-6 border-t border-base-300">
                <p className="text-sm text-base-content/60">
                  SKU:{" "}
                  <span className="font-medium">{selectedProduct.sku}</span>
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-14">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">Related Products</h2>
              <p className="text-base-content/60">
                More products from {selectedProduct.category}
              </p>
            </div>

            <Link
              to={`/shop?category=${encodeURIComponent(
                selectedProduct.category,
              )}`}
              className="btn btn-outline rounded-xl"
            >
              View More
            </Link>
          </div>

          {isLoadingRelated ? (
            <div className="flex justify-center py-10">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          ) : relatedProducts.length === 0 ? (
            <div className="bg-base-100 rounded-2xl border border-base-300 p-10 text-center text-base-content/60">
              No related products found
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((product) => {
                const relatedIsWishlisted = authUser
                  ? wishlist.some(
                      (item) => getWishlistProductId(item) === product._id,
                    )
                  : false;

                return (
                  <ShopProductCard
                    key={product._id}
                    product={product}
                    isWishlisted={relatedIsWishlisted}
                    onAddToCart={(product) => {
                      if (!requireLogin()) return;
                      addToCart({
                        productId: product._id,
                        quantity: 1,
                      });
                    }}
                    onToggleWishlist={async (productId) => {
                      if (!requireLogin()) return;
                      await toggleWishlist(productId);
                    }}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
