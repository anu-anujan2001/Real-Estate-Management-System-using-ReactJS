import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import useOrderStore from "../store/useOrderStore";
import useCartStore from "../store/useCartStore";

export default function OrderSuccessPage() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const { createPaidOrderAfterStripeSuccess, isCreatingOrder } =
    useOrderStore();
  const { resetCart } = useCartStore();

  const [done, setDone] = useState(false);
  const hasRequestedRef = useRef(false);

  useEffect(() => {
    const createOrder = async () => {
      if (!sessionId || hasRequestedRef.current) return;

      hasRequestedRef.current = true;

      const result = await createPaidOrderAfterStripeSuccess(sessionId);

      if (result.success) {
        resetCart();
        setDone(true);
      }
    };

    createOrder();
  }, [sessionId, createPaidOrderAfterStripeSuccess, resetCart]);

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center px-4">
      <div className="bg-base-100 border border-base-300 rounded-2xl p-10 text-center max-w-lg w-full">
        {isCreatingOrder ? (
          <>
            <h1 className="text-3xl font-bold">Processing Payment...</h1>
            <p className="text-base-content/60 mt-3">
              Please wait while we confirm your order.
            </p>
          </>
        ) : done ? (
          <>
            <h1 className="text-3xl font-bold text-success">
              Payment Successful
            </h1>
            <p className="text-base-content/60 mt-3">
              Your order has been placed successfully.
            </p>

            <div className="flex justify-center gap-3 mt-6">
              <Link to="/orders" className="btn btn-primary rounded-xl">
                View Orders
              </Link>
              <Link to="/shop" className="btn btn-outline rounded-xl">
                Continue Shopping
              </Link>
            </div>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-error">
              Something went wrong
            </h1>
            <p className="text-base-content/60 mt-3">
              We could not confirm your payment.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
