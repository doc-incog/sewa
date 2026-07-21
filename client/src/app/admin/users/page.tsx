"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { User } from "@shared/types";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import EmptyState from "@/components/ui/EmptyState";
import { TableSkeleton } from "@/components/ui/Skeleton";
import toast from "react-hot-toast";
import { Search, Trash2, ChevronLeft, ChevronRight } from "lucide-react";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchUsers();
  }, [search, role, page]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params: any = { page, limit: 20 };
      if (search) params.search = search;
      if (role) params.role = role;
      const { data } = await api.get("/admin/users", { params });
      setUsers(data.data.users);
      setTotalPages(data.data.totalPages);
    } catch {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      await api.delete(`/admin/users/${userId}`);
      toast.success("User deleted");
      fetchUsers();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to delete");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-warmgray-900">Users</h1>
        <p className="text-sm text-warmgray-500 mt-1">Manage platform users</p>
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-warmgray-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-10 pr-4 py-2.5 bg-warmgray-50 border border-warmgray-200 rounded-xl text-sm text-warmgray-900 placeholder:text-warmgray-400 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
          />
        </div>
        <select
          value={role}
          onChange={(e) => { setRole(e.target.value); setPage(1); }}
          className="px-4 py-2.5 bg-warmgray-50 border border-warmgray-200 rounded-xl text-sm text-warmgray-700 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
        >
          <option value="">All Roles</option>
          <option value="user">Users</option>
          <option value="provider">Providers</option>
          <option value="admin">Admins</option>
        </select>
      </div>

      {loading ? (
        <TableSkeleton rows={6} />
      ) : users.length === 0 ? (
        <EmptyState title="No users found" description="No users match your current filters." />
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-warmgray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-warmgray-50">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-medium text-warmgray-500 uppercase">Name</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-warmgray-500 uppercase">Email</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-warmgray-500 uppercase">Role</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-warmgray-500 uppercase">Joined</th>
                  <th className="px-5 py-3 text-right text-xs font-medium text-warmgray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-warmgray-100">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-warmgray-50/50 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <Avatar name={user.name} size="sm" />
                        <span className="text-sm font-medium text-warmgray-900">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-warmgray-500">{user.email}</td>
                    <td className="px-5 py-3.5">
                      <Badge status={user.role} />
                    </td>
                    <td className="px-5 py-3.5 text-sm text-warmgray-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      {user.role !== "admin" && (
                        <button
                          onClick={() => handleDelete(user._id)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 border border-red-200 rounded-xl text-xs font-medium hover:bg-red-100 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-1.5 p-4 border-t border-warmgray-100">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="w-8 h-8 rounded-lg text-sm flex items-center justify-center text-warmgray-600 hover:bg-warmgray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                .reduce<(number | string)[]>((acc, p, i, arr) => {
                  if (i > 0 && typeof arr[i - 1] === "number" && p - (arr[i - 1] as number) > 1) acc.push("...");
                  acc.push(p);
                  return acc;
                }, [])
                .map((p, i) =>
                  typeof p === "string" ? (
                    <span key={`dots-${i}`} className="w-8 h-8 flex items-center justify-center text-warmgray-400 text-sm">...</span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                        page === p
                          ? "bg-primary-600 text-white"
                          : "text-warmgray-600 hover:bg-warmgray-100"
                      }`}
                    >
                      {p}
                    </button>
                  )
                )}
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="w-8 h-8 rounded-lg text-sm flex items-center justify-center text-warmgray-600 hover:bg-warmgray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
