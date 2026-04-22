import StatCard from "../../components/admin/dashboard/StatsCard";
import RecentOrders from "../../components/admin/dashboard/RecentOrders";
import LowStockList from "../../components/admin/dashboard/LowStockList";
import {
  stats,
  recentOrders,
  lowStockProducts,
} from "../../data/adminDashboardData";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl md:text-3xl font-bold">Overview</h2>
        <p className="text-base-content/60 mt-1">
          Monitor products, orders, customers, and revenue.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {stats.map((item) => (
          <StatCard
            key={item.id}
            title={item.title}
            value={item.value}
            subtitle={item.subtitle}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <div className="bg-base-100 rounded-2xl border border-base-300 p-5 min-h-[320px]">
          <h3 className="font-semibold text-lg mb-4">Sales Overview</h3>
          <div className="h-[240px] rounded-2xl bg-base-200 flex items-center justify-center text-base-content/50">
            Chart UI Here
          </div>
        </div>

        <div className="bg-base-100 rounded-2xl border border-base-300 p-5 min-h-[320px]">
          <h3 className="font-semibold text-lg mb-4">Traffic / Orders</h3>
          <div className="h-[240px] rounded-2xl bg-base-200 flex items-center justify-center text-base-content/50">
            Chart UI Here
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <RecentOrders orders={recentOrders} />
        <LowStockList products={lowStockProducts} />
      </div>
    </div>
  );
}
