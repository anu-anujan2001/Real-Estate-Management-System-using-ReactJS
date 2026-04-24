import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Minus,
  Plus,
  ShoppingCart,
  Trash2,
  ShieldCheck,
} from "lucide-react";
import useCartStore from "../store/useCartStore";
import useAuthStore from "../store/useAuthStore";

export default function CartPage() {
  const navigate = useNavigate();
  const { authUser } = useAuthStore();
  const {
    cart,
    fetchCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    isLoadingCart,
    isUpdatingCart,
    getCartTotals,
  } = useCartStore();

  useEffect(() => {
    if (authUser) {
      fetchCart();
    }
  }, [authUser, fetchCart]);

  if (!authUser) {
    return (
      <div className="min-h-screen bg-base-200">
        <div className="max-w-5xl mx-auto px-4 md:px-8 py-10">
          <div className="bg-base-100 border border-base-300 rounded-2xl p-10 text-center">
            <h1 className="text-3xl font-bold mb-3">Please login first</h1>
            <p className="text-base-content/60 mb-6">
              Login to view and manage your cart.
            </p>
            <Link to="/login" className="btn btn-primary rounded-xl">
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const cartItems = cart?.items || [];
  const { itemsCount, subtotal } = getCartTotals();
  const shipping = itemsCount > 0 ? 500 : 0;
  const total = subtotal + shipping;

  const handleDecrease = (item) => {
    if (item.quantity > 1) {
      updateQuantity(item._id, item.quantity - 1);
    }
  };

  const handleIncrease = (item) => {
    updateQuantity(item._id, item.quantity + 1);
  };

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
            <h1 className="text-3xl md:text-4xl font-bold">My Cart</h1>
            <p className="text-base-content/60 mt-2">
              Review your selected items before checkout
            </p>
          </div>

          <div className="badge badge-outline badge-lg px-4 py-4">
            {itemsCount} item{itemsCount !== 1 ? "s" : ""}
          </div>
        </div>

        {isLoadingCart ? (
          <div className="flex justify-center py-20">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="bg-base-100 border border-base-300 rounded-2xl p-12 text-center">
            <div className="w-20 h-20 mx-auto rounded-full bg-base-200 flex items-center justify-center mb-5">
              <ShoppingCart className="w-10 h-10 text-base-content/50" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
            <p className="text-base-content/60 mb-6">
              Browse products and add items to your cart.
            </p>
            <Link to="/shop" className="btn btn-primary rounded-xl">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => {
                const product = item.product;
                const image =
                  item.image || product?.images?.[0] || "/no-image.png";
                const productId =
                  typeof product === "string" ? product : product?._id;

                return (
                  <div
                    key={item._id}
                    className="bg-base-100 border border-base-300 rounded-2xl p-4 md:p-5 flex flex-col sm:flex-row gap-4"
                  >
                    <Link
                      to={`/product/${productId}`}
                      className="w-full sm:w-36 h-36 rounded-xl overflow-hidden bg-base-200 shrink-0"
                    >
                      <img
                        src={image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </Link>

                    <div className="flex-1 flex flex-col justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-semibold">{item.name}</h3>

                        {(item.variant?.size || item.variant?.color) && (
                          <p className="text-sm text-base-content/60 mt-1">
                            {item.variant?.size
                              ? `Size: ${item.variant.size}`
                              : ""}
                            {item.variant?.size && item.variant?.color
                              ? " • "
                              : ""}
                            {item.variant?.color
                              ? `Color: ${item.variant.color}`
                              : ""}
                          </p>
                        )}

                        <p className="text-lg font-bold text-primary mt-2">
                          Rs. {Number(item.price || 0).toLocaleString()}
                        </p>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => handleDecrease(item)}
                            className="btn btn-outline btn-square rounded-xl"
                            disabled={isUpdatingCart || item.quantity <= 1}
                          >
                            <Minus size={16} />
                          </button>

                          <span className="w-12 text-center font-semibold text-lg">
                            {item.quantity}
                          </span>

                          <button
                            type="button"
                            onClick={() => handleIncrease(item)}
                            className="btn btn-outline btn-square rounded-xl"
                            disabled={isUpdatingCart}
                          >
                            <Plus size={16} />
                          </button>
                        </div>

                        <div className="flex items-center gap-2">
                          <p className="font-semibold">
                            Rs.{" "}
                            {Number(
                              item.price * item.quantity,
                            ).toLocaleString()}
                          </p>

                          <button
                            type="button"
                            onClick={() => removeFromCart(item._id)}
                            className="btn btn-outline btn-error rounded-xl"
                            disabled={isUpdatingCart}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="lg:col-span-1">
              <div className="bg-base-100 border border-base-300 rounded-2xl p-5 sticky top-24">
                <h2 className="text-xl font-bold mb-4">Order Summary</h2>

                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span>Items</span>
                    <span className="font-medium">{itemsCount}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span>Subtotal</span>
                    <span className="font-medium">
                      Rs. {Number(subtotal).toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span>Shipping</span>
                    <span className="font-medium">
                      Rs. {Number(shipping).toLocaleString()}
                    </span>
                  </div>

                  <div className="divider my-2"></div>

                  <div className="flex items-center justify-between text-base font-bold">
                    <span>Total</span>
                    <span>Rs. {Number(total).toLocaleString()}</span>
                  </div>
                </div>

                <button
                  onClick={() => navigate("/checkout")}
                  className="btn btn-primary w-full rounded-xl mt-5"
                >
                  Proceed to Checkout
                </button>

                <button
                  onClick={clearCart}
                  disabled={isUpdatingCart}
                  className="btn btn-outline w-full rounded-xl mt-3"
                >
                  Clear Cart
                </button>

                <div className="mt-5 p-4 rounded-xl bg-base-200 text-sm text-base-content/70">
                  <div className="flex items-center gap-2 font-medium mb-2">
                    <ShieldCheck size={16} />
                    Secure Checkout
                  </div>
                  <p>
                    Your payment and order details will be protected during
                    checkout.
                  </p>
                </div>

                <Link
                  to="/shop"
                  className="btn btn-ghost w-full rounded-xl mt-3"
                >
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
