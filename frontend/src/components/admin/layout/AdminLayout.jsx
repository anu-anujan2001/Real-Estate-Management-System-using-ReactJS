import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminTopbar from "./AdminTopbar";

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-base-200">
      <div className="drawer lg:drawer-open">
        <input id="admin-drawer" type="checkbox" className="drawer-toggle" />

        <div className="drawer-content flex flex-col">
          <AdminTopbar />
          <main className="p-4 md:p-6">
            <Outlet />
          </main>
        </div>

        <div className="drawer-side z-40">
          <label htmlFor="admin-drawer" className="drawer-overlay"></label>
          <AdminSidebar />
        </div>
      </div>
    </div>
  );
}
