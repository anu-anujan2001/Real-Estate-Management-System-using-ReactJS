import { Menu, Bell, Search } from "lucide-react";

export default function AdminTopbar() {
  return (
    <div className="navbar bg-base-100 border-b border-base-300 px-4 md:px-6 sticky top-0 z-30">
      <div className="flex-1 gap-3">
        <label
          htmlFor="admin-drawer"
          className="btn btn-ghost btn-circle lg:hidden"
        >
          <Menu size={20} />
        </label>
        <h1 className="text-lg md:text-xl font-semibold">Admin Dashboard</h1>
      </div>

      <div className="flex-none gap-2">
        <label className="input input-bordered hidden md:flex items-center gap-2 rounded-full">
          <Search size={16} />
          <input type="text" className="grow" placeholder="Search..." />
        </label>

        <button className="btn btn-ghost btn-circle">
          <Bell size={18} />
        </button>

        <div className="avatar placeholder">
          <div className="bg-primary text-primary-content rounded-full w-10">
            <span>A</span>
          </div>
        </div>
      </div>
    </div>
  );
}
