import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
} from "lucide-react";

const menuItems = [
  { name: "Dashboard", path: "/admin", icon: <LayoutDashboard size={18} /> },
  { name: "Products", path: "/admin/products", icon: <Package size={18} /> },
  { name: "Orders", path: "/admin/orders", icon: <ShoppingCart size={18} /> },
  { name: "Users", path: "/admin/users", icon: <Users size={18} /> },
  { name: "Settings", path: "/admin/settings", icon: <Settings size={18} /> },
];

export default function AdminSidebar() {
  return (
    <aside className="min-h-full w-72 bg-base-100 border-r border-base-300">
      <div className="p-5 border-b border-base-300">
        <h2 className="text-2xl font-bold text-primary">Admin Panel</h2>
        <p className="text-sm text-base-content/60 mt-1">
          E-commerce dashboard
        </p>
      </div>

      <ul className="menu p-4 gap-2">
        {menuItems.map((item) => (
          <li key={item.path}>
            <NavLink
              to={item.path}
              end={item.path === "/admin"}
              className={({ isActive }) =>
                isActive
                  ? "bg-primary text-primary-content rounded-xl"
                  : "rounded-xl hover:bg-base-200"
              }
            >
              {item.icon}
              <span>{item.name}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </aside>
  );
}
