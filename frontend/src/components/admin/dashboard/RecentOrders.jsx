export default function RecentOrders({ orders }) {
  return (
    <div className="bg-base-100 rounded-2xl border border-base-300 p-5">
      <h3 className="font-semibold text-lg mb-4">Recent Orders</h3>

      <div className="space-y-3">
        {orders.map((order) => (
          <div
            key={order.id}
            className="flex items-center justify-between rounded-xl bg-base-200 p-4"
          >
            <div>
              <p className="font-medium">{order.id}</p>
              <p className="text-sm text-base-content/60">{order.customer}</p>
            </div>

            <div className="text-right">
              <p className="font-medium">{order.total}</p>
              <p className="text-sm text-base-content/60">{order.status}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
