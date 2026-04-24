import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  CalendarDays,
  CreditCard,
  Package,
  Truck,
  Eye,
  ShoppingBag,
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

export default function OrdersPage() {
  const { orders, fetchMyOrders, isLoadingOrders } = useOrderStore();

  useEffect(() => {
    fetchMyOrders();
  }, [fetchMyOrders]);

  if (isLoadingOrders) {
    return (
      <div className="min-h-screen bg-base-200 flex justify-center items-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200">
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold">My Orders</h1>
          <p className="text-base-content/60 mt-2">
            Track your purchases and view order details
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="bg-base-100 border border-base-300 rounded-2xl p-12 text-center">
            <div className="w-20 h-20 mx-auto rounded-full bg-base-200 flex items-center justify-center mb-5">
              <ShoppingBag className="w-10 h-10 text-base-content/50" />
            </div>

            <h2 className="text-2xl font-bold mb-2">No orders yet</h2>
            <p className="text-base-content/60 mb-6">
              Start shopping and your orders will appear here.
            </p>

            <Link to="/shop" className="btn btn-primary rounded-xl">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-5">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-base-100 border border-base-300 rounded-2xl p-5 md:p-6 shadow-sm hover:shadow-md transition"
              >
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-base-content/60">Order ID</p>
                      <h2 className="font-bold text-lg break-all">
                        #{order._id}
                      </h2>
                    </div>

                    <div className="flex flex-wrap gap-3 text-sm text-base-content/70">
                      <div className="flex items-center gap-2">
                        <CalendarDays size={16} />
                        {new Date(order.createdAt).toLocaleString()}
                      </div>

                      <div className="flex items-center gap-2">
                        <Package size={16} />
                        {order.orderItems?.length || 0} item
                        {(order.orderItems?.length || 0) !== 1 ? "s" : ""}
                      </div>

                      <div className="flex items-center gap-2">
                        <CreditCard size={16} />
                        {order.paymentMethod}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <span
                      className={`badge ${
                        order.isPaid ? "badge-success" : "badge-warning"
                      }`}
                    >
                      {order.isPaid ? "Paid" : "Unpaid"}
                    </span>

                    <span
                      className={`badge ${getStatusBadge(order.orderStatus)}`}
                    >
                      {order.orderStatus}
                    </span>
                  </div>
                </div>

                <div className="divider my-5"></div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-base-200 rounded-xl p-4">
                    <p className="text-sm text-base-content/60">Total Amount</p>
                    <p className="text-xl font-bold text-primary mt-1">
                      Rs. {Number(order.totalPrice || 0).toLocaleString()}
                    </p>
                  </div>

                  <div className="bg-base-200 rounded-xl p-4">
                    <p className="text-sm text-base-content/60">Shipping To</p>
                    <p className="font-semibold mt-1 line-clamp-1">
                      {order.shippingAddress?.city || "N/A"}
                    </p>
                    <p className="text-sm text-base-content/60 line-clamp-1">
                      {order.shippingAddress?.address || ""}
                    </p>
                  </div>

                  <div className="bg-base-200 rounded-xl p-4">
                    <p className="text-sm text-base-content/60">Delivery</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Truck size={18} />
                      <p className="font-semibold">
                        {order.isDelivered ? "Delivered" : "In Progress"}
                      </p>
                    </div>
                  </div>
                </div>

                {order.orderItems?.length > 0 && (
                  <div className="mt-5 flex -space-x-3 overflow-hidden">
                    {order.orderItems.slice(0, 5).map((item, index) => (
                      <img
                        key={index}
                        src={item.image || "/no-image.png"}
                        alt={item.name}
                        className="w-12 h-12 rounded-full border-2 border-base-100 object-cover bg-base-200"
                      />
                    ))}

                    {order.orderItems.length > 5 && (
                      <div className="w-12 h-12 rounded-full border-2 border-base-100 bg-base-300 flex items-center justify-center text-sm font-bold">
                        +{order.orderItems.length - 5}
                      </div>
                    )}
                  </div>
                )}

                <div className="mt-5 flex justify-end">
                  <Link
                    to={`/orders/${order._id}`}
                    className="btn btn-outline rounded-xl"
                  >
                    <Eye size={16} />
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
