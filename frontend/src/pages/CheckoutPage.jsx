import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";
import useCartStore from "../store/useCartStore";
import useOrderStore from "../store/useOrderStore";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { authUser } = useAuthStore();
  const { cart, getCartTotals } = useCartStore();
  const { createCashOrder, createStripeCheckoutSession, isCreatingOrder } =
    useOrderStore();

  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [shippingAddress, setShippingAddress] = useState({
    fullName: authUser?.name || "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    country: "Sri Lanka",
  });

  if (!authUser) {
    navigate("/login");
    return null;
  }

  const cartItems = cart?.items || [];
  const { subtotal } = getCartTotals();
  const shippingPrice = subtotal > 0 ? 500 : 0;
  const total = subtotal + shippingPrice;

  const handleChange = (e) => {
    setShippingAddress((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const validateShippingAddress = () => {
    if (
      !shippingAddress.fullName.trim() ||
      !shippingAddress.phone.trim() ||
      !shippingAddress.address.trim() ||
      !shippingAddress.city.trim()
    ) {
      return false;
    }

    return true;
  };

  const handlePlaceOrder = async () => {
    if (isCreatingOrder) return;

    if (!validateShippingAddress()) {
      return;
    }

    if (paymentMethod === "COD") {
      const result = await createCashOrder(shippingAddress);

      if (result.success) {
        navigate("/orders");
      }
    } else {
      await createStripeCheckoutSession(cartItems, shippingAddress);
    }
  };

  if (!cartItems.length) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center px-4">
        <div className="bg-base-100 p-8 rounded-2xl border border-base-300 text-center max-w-md w-full">
          <h2 className="text-2xl font-bold mb-3">Your cart is empty</h2>
          <p className="text-base-content/60 mb-6">
            Add some products before proceeding to checkout.
          </p>
          <button
            onClick={() => navigate("/shop")}
            className="btn btn-primary rounded-xl"
          >
            Go to Shop
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200">
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-base-100 border border-base-300 rounded-2xl p-6">
          <h1 className="text-3xl font-bold mb-6">Checkout</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label font-medium">Full Name</label>
              <input
                name="fullName"
                value={shippingAddress.fullName}
                onChange={handleChange}
                placeholder="Enter full name"
                className="input input-bordered w-full"
              />
            </div>

            <div>
              <label className="label font-medium">Phone</label>
              <input
                name="phone"
                value={shippingAddress.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
                className="input input-bordered w-full"
              />
            </div>

            <div className="md:col-span-2">
              <label className="label font-medium">Address</label>
              <input
                name="address"
                value={shippingAddress.address}
                onChange={handleChange}
                placeholder="Enter address"
                className="input input-bordered w-full"
              />
            </div>

            <div>
              <label className="label font-medium">City</label>
              <input
                name="city"
                value={shippingAddress.city}
                onChange={handleChange}
                placeholder="Enter city"
                className="input input-bordered w-full"
              />
            </div>

            <div>
              <label className="label font-medium">Postal Code</label>
              <input
                name="postalCode"
                value={shippingAddress.postalCode}
                onChange={handleChange}
                placeholder="Enter postal code"
                className="input input-bordered w-full"
              />
            </div>

            <div className="md:col-span-2">
              <label className="label font-medium">Country</label>
              <input
                name="country"
                value={shippingAddress.country}
                onChange={handleChange}
                placeholder="Enter country"
                className="input input-bordered w-full"
              />
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Payment Method</h2>

            <div className="flex flex-col sm:flex-row gap-4">
              <label className="label cursor-pointer justify-start gap-3 p-4 border border-base-300 rounded-xl">
                <input
                  type="radio"
                  className="radio radio-primary"
                  checked={paymentMethod === "COD"}
                  onChange={() => setPaymentMethod("COD")}
                />
                <span className="font-medium">Cash on Delivery</span>
              </label>

              <label className="label cursor-pointer justify-start gap-3 p-4 border border-base-300 rounded-xl">
                <input
                  type="radio"
                  className="radio radio-primary"
                  checked={paymentMethod === "CARD"}
                  onChange={() => setPaymentMethod("CARD")}
                />
                <span className="font-medium">Card (Stripe Test)</span>
              </label>
            </div>
          </div>
        </div>

        <div className="bg-base-100 border border-base-300 rounded-2xl p-6 h-fit">
          <h2 className="text-xl font-bold mb-4">Order Summary</h2>

          <div className="space-y-3 text-sm">
            {cartItems.map((item) => (
              <div key={item._id} className="flex justify-between gap-4">
                <div className="flex-1">
                  <p className="line-clamp-1">
                    {item.name} × {item.quantity}
                  </p>

                  {(item.variant?.size || item.variant?.color) && (
                    <p className="text-xs text-base-content/60 mt-1">
                      {item.variant?.size ? `Size: ${item.variant.size}` : ""}
                      {item.variant?.size && item.variant?.color ? " • " : ""}
                      {item.variant?.color
                        ? `Color: ${item.variant.color}`
                        : ""}
                    </p>
                  )}
                </div>

                <span>Rs. {(item.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}

            <div className="divider"></div>

            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>Rs. {subtotal.toLocaleString()}</span>
            </div>

            <div className="flex justify-between">
              <span>Shipping</span>
              <span>Rs. {shippingPrice.toLocaleString()}</span>
            </div>

            <div className="flex justify-between text-base font-bold">
              <span>Total</span>
              <span>Rs. {total.toLocaleString()}</span>
            </div>
          </div>

          <button
            onClick={handlePlaceOrder}
            disabled={isCreatingOrder}
            className="btn btn-primary w-full rounded-xl mt-6"
          >
            {isCreatingOrder ? "Processing..." : "Place Order"}
          </button>
        </div>
      </div>
    </div>
  );
}
