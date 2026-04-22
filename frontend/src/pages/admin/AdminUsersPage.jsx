import { useEffect, useMemo, useState } from "react";
import { Search, Eye, Trash2, ShieldCheck, User } from "lucide-react";
import PageHeader from "../../components/common/PageHeader";
import useAuthStore from "../../store/useAuthStore";

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const { users, getAllUsers, isGettingUsers } = useAuthStore();

  useEffect(() => {
    getAllUsers();
  }, [getAllUsers]);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.name?.toLowerCase().includes(search.toLowerCase()) ||
        user.email?.toLowerCase().includes(search.toLowerCase());

      const matchesRole =
        roleFilter === "all" ? true : user.role === roleFilter;

      const matchesStatus =
        statusFilter === "all"
          ? true
          : statusFilter === "blocked"
            ? user.isBlocked
            : statusFilter === "active"
              ? !user.isBlocked
              : statusFilter === "verified"
                ? user.isVerified
                : !user.isVerified;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, search, roleFilter, statusFilter]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Users"
        subtitle="Manage all registered users in your store"
      />

      <div className="bg-base-100 rounded-2xl border border-base-300 p-4 md:p-5">
        <div className="flex flex-col lg:flex-row gap-3">
          <label className="input input-bordered flex items-center gap-2 w-full lg:max-w-sm">
            <Search size={16} />
            <input
              type="text"
              className="grow"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </label>

          <select
            className="select select-bordered w-full lg:w-40"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>

          <select
            className="select select-bordered w-full lg:w-44"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="blocked">Blocked</option>
            <option value="verified">Verified</option>
            <option value="unverified">Unverified</option>
          </select>
        </div>
      </div>

      <div className="bg-base-100 rounded-2xl border border-base-300 p-4 md:p-5">
        {isGettingUsers ? (
          <div className="flex justify-center py-10">
            <span className="loading loading-spinner loading-md"></span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Role</th>
                  <th>Verification</th>
                  <th>Account Status</th>
                  <th>Joined Date</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr key={user._id}>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="avatar placeholder">
                            <div className="w-12 h-12 rounded-full bg-primary/10 text-primary">
                              <span className="font-semibold">
                                {user.name?.charAt(0)?.toUpperCase() || "U"}
                              </span>
                            </div>
                          </div>

                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-base-content/60">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td>
                        <span
                          className={`badge gap-1 ${
                            user.role === "admin"
                              ? "badge-primary"
                              : "badge-ghost"
                          }`}
                        >
                          {user.role === "admin" ? (
                            <ShieldCheck size={12} />
                          ) : (
                            <User size={12} />
                          )}
                          {user.role}
                        </span>
                      </td>

                      <td>
                        <span
                          className={`badge ${
                            user.isVerified ? "badge-success" : "badge-warning"
                          }`}
                        >
                          {user.isVerified ? "Verified" : "Unverified"}
                        </span>
                      </td>

                      <td>
                        <span
                          className={`badge ${
                            user.isBlocked ? "badge-error" : "badge-success"
                          }`}
                        >
                          {user.isBlocked ? "Blocked" : "Active"}
                        </span>
                      </td>

                      <td>
                        {user.createdAt
                          ? new Date(user.createdAt).toLocaleDateString()
                          : user.joinedAt || "-"}
                      </td>

                      <td>
                        <div className="flex justify-end gap-2">
                          <button className="btn btn-sm btn-outline">
                            <Eye size={16} />
                          </button>
                          <button className="btn btn-sm btn-outline btn-error">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="text-center py-8 text-base-content/60"
                    >
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
