import { Menu, Bell, Search, LogOut, User } from "lucide-react";
import useAuthStore from "../../../store/useAuthStore";

export default function AdminTopbar() {
  const { authUser, logout } = useAuthStore();

  return (
    <div className="navbar bg-base-100 border-b border-base-300 px-4 md:px-6 sticky top-0 z-30">
      {/* LEFT */}
      <div className="flex-1 gap-3">
        <label
          htmlFor="admin-drawer"
          className="btn btn-ghost btn-circle lg:hidden"
        >
          <Menu size={20} />
        </label>

        <h1 className="text-lg md:text-xl font-semibold">Admin Dashboard</h1>
      </div>

      {/* RIGHT */}
      <div className="flex-none gap-2 items-center">
        {/* Search */}
        <label className="input input-bordered hidden md:flex items-center gap-2 rounded-full">
          <Search size={16} />
          <input type="text" className="grow" placeholder="Search..." />
        </label>

        {/* Notification */}
        <button className="btn btn-ghost btn-circle">
          <Bell size={18} />
        </button>

        {/* Avatar Dropdown */}
        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
            <div className="w-10 rounded-full bg-primary text-primary-content flex items-center justify-center">
              {authUser?.name ? (
                <span className="font-bold">
                  {authUser.name.charAt(0).toUpperCase()}
                </span>
              ) : (
                <User size={18} />
              )}
            </div>
          </label>

          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
          >
            {/* User Info */}
            <li className="px-2 py-1 text-sm text-base-content/70">
              {authUser?.name || "Admin"}
            </li>

            <div className="divider my-1"></div>

            {/* Profile */}
            <li>
              <a>Profile</a>
            </li>

            {/* Logout */}
            <li>
              <button
                onClick={logout}
                className="text-error flex items-center gap-2"
              >
                <LogOut size={16} />
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
