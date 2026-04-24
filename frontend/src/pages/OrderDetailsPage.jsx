import { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  CreditCard,
  MapPin,
  Package,
  Phone,
  Truck,
  User,
} from "lucide-react";
import useOrderStore from "../store/useOrderStore";

const getStatusBadge = (status) => {
  const styles = {
    Pending: "badge-warning",
    Paid: "badge-success",
    Processing: "badge-info",
    Shipped: "badge-primary",
    Delivered: "badge-success",
    Cancelled: "badge-error",
  };

  return styles[status] || "badge-outline";
};

const steps = ["Pending", "Paid", "Processing", "Shipped", "Delivered"];

export default function OrderDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { selectedOrder, fetchOrderById, clearSelectedOrder, isLoadingOrders } =
    useOrderStore();

  useEffect(() => {
    fetchOrderById(id);

    return () => {
      clearSelectedOrder();
    };
  }, [id, fetchOrderById, clearSelectedOrder]);

  if (isLoadingOrders) {
    return (
      <div className="min-h-screen bg-base-200 flex justify-center items-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!selectedOrder) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center px-4">
        <div className="bg-base-100 border border-base-300 rounded-2xl p-10 text-center max-w-md w-full">
          <h1 className="text-2xl font-bold mb-3">Order not found</h1>
          <p className="text-base-content/60 mb-6">
            We could not find this order.
          </p>
          <Link to="/orders" className="btn btn-primary rounded-xl">
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  const currentStepIndex = steps.indexOf(selectedOrder.orderStatus);

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

        <div className="bg-base-100 border border-base-300 rounded-2xl p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">Order Details</h1>
              <p className="text-base-content/60 mt-2 break-all">
                #{selectedOrder._id}
              </p>

              <div className="flex flex-wrap gap-4 mt-4 text-sm text-base-content/70">
                <div className="flex items-center gap-2">
                  <CalendarDays size={16} />
                  {new Date(selectedOrder.createdAt).toLocaleString()}
                </div>

                <div className="flex items-center gap-2">
                  <CreditCard size={16} />
                  {selectedOrder.paymentMethod}
                </div>

                <div className="flex items-center gap-2">
                  <Package size={16} />
                  {selectedOrder.orderItems?.length || 0} item
                  {(selectedOrder.orderItems?.length || 0) !== 1 ? "s" : ""}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <span
                className={`badge ${
                  selectedOrder.isPaid ? "badge-success" : "badge-warning"
                }`}
              >
                {selectedOrder.isPaid ? "Paid" : "Unpaid"}
              </span>

              <span
                className={`badge ${getStatusBadge(selectedOrder.orderStatus)}`}
              >
                {selectedOrder.orderStatus}
              </span>
            </div>
          </div>
        </div>

        {selectedOrder.orderStatus !== "Cancelled" && (
          <div className="bg-base-100 border border-base-300 rounded-2xl p-6 mb-6">
            <h2 className="text-xl font-bold mb-5">Order Progress</h2>

            <ul className="steps steps-vertical lg:steps-horizontal w-full">
              {steps.map((step, index) => (
                <li
                  key={step}
                  className={`step ${
                    index <= currentStepIndex ? "step-primary" : ""
                  }`}
                >
                  {step}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 space-y-6">
            <div className="bg-base-100 border border-base-300 rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-4">Ordered Items</h2>

              <div className="space-y-4">
                {selectedOrder.orderItems?.map((item, index) => (
                  <div
                    key={index}
                    className="flex flex-col sm:flex-row gap-4 border border-base-300 rounded-2xl p-4"
                  >
                    <img
                      src={item.image || "/no-image.png"}
                      alt={item.name}
                      className="w-full sm:w-28 h-28 object-cover rounded-xl bg-base-200"
                    />

                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{item.name}</h3>

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

                      <p className="text-sm text-base-content/60 mt-2">
                        Quantity: {item.quantity}
                      </p>
                    </div>

                    <div className="sm:text-right">
                      <p className="font-semibold">
                        Rs. {Number(item.price || 0).toLocaleString()}
                      </p>
                      <p className="text-primary font-bold mt-2">
                        Rs.{" "}
                        {Number(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-base-100 border border-base-300 rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-4">Shipping Information</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="bg-base-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 font-semibold mb-2">
                    <User size={16} />
                    Recipient
                  </div>
                  <p>{selectedOrder.shippingAddress?.fullName}</p>
                </div>

                <div className="bg-base-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 font-semibold mb-2">
                    <Phone size={16} />
                    Phone
                  </div>
                  <p>{selectedOrder.shippingAddress?.phone}</p>
                </div>

                <div className="bg-base-200 rounded-xl p-4 md:col-span-2">
                  <div className="flex items-center gap-2 font-semibold mb-2">
                    <MapPin size={16} />
                    Address
                  </div>
                  <p>{selectedOrder.shippingAddress?.address}</p>
                  <p className="text-base-content/60 mt-1">
                    {selectedOrder.shippingAddress?.city}
                    {selectedOrder.shippingAddress?.postalCode
                      ? `, ${selectedOrder.shippingAddress.postalCode}`
                      : ""}
                    , {selectedOrder.shippingAddress?.country}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="xl:col-span-1 space-y-6">
            <div className="bg-base-100 border border-base-300 rounded-2xl p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-4">Payment Summary</h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Items Price</span>
                  <span>
                    Rs. {Number(selectedOrder.itemsPrice || 0).toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>
                    Rs.{" "}
                    {Number(selectedOrder.shippingPrice || 0).toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>
                    Rs. {Number(selectedOrder.taxPrice || 0).toLocaleString()}
                  </span>
                </div>

                <div className="divider my-2"></div>

                <div className="flex justify-between text-base font-bold">
                  <span>Total</span>
                  <span>
                    Rs. {Number(selectedOrder.totalPrice || 0).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="mt-6 bg-base-200 rounded-xl p-4 text-sm">
                <div className="flex items-center gap-2 font-semibold mb-2">
                  <Truck size={16} />
                  Delivery Status
                </div>
                <p>
                  {selectedOrder.isDelivered
                    ? "Delivered"
                    : selectedOrder.orderStatus}
                </p>

                {selectedOrder.deliveredAt && (
                  <p className="text-base-content/60 mt-1">
                    {new Date(selectedOrder.deliveredAt).toLocaleString()}
                  </p>
                )}
              </div>

              {selectedOrder.paymentResult?.id && (
                <div className="mt-4 bg-base-200 rounded-xl p-4 text-sm">
                  <p className="font-semibold mb-1">Payment ID</p>
                  <p className="break-all text-base-content/60">
                    {selectedOrder.paymentResult.id}
                  </p>
                </div>
              )}

              <Link
                to="/orders"
                className="btn btn-outline w-full rounded-xl mt-5"
              >
                Back to Orders
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
